import { NextResponse, type NextRequest } from "next/server";
import CommentModel from "@/models/commentModel";
import dbConnect from "@/utils/dbConnect";

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    if (!jobId) {
      return NextResponse.json(
        { message: "Job ID is required" },
        { status: 400 }
      );
    }

    const comments = await CommentModel.find({
      jobId,
      isDeleted: false,
      parentCommentId: null, 
    })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await CommentModel.find({
          parentCommentId: comment._id,
          isDeleted: false,
        })
          .populate("userId", "name avatar")
          .sort({ createdAt: 1 })
          .lean();

        return {
          ...comment,
          replies,
          replyCount: replies.length,
          likeCount: comment.likes.length,
          dislikeCount: comment.dislikes.length,
        };
      })
    );

    const totalComments = await CommentModel.countDocuments({
      jobId,
      isDeleted: false,
      parentCommentId: null,
    });

    return NextResponse.json({
      comments: commentsWithReplies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNextPage: page < Math.ceil(totalComments / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Error fetching comments" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { jobId, userId, content, parentCommentId } = body;

    if (!jobId || !userId || !content) {
      return NextResponse.json(
        { message: "Job ID, User ID, and content are required" },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { message: "Comment must be at least 3 characters long" },
        { status: 400 }
      );
    }

    const newComment = new CommentModel({
      jobId,
      userId,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    });

    await newComment.save();
    await newComment.populate("userId", "name avatar");

    return NextResponse.json({
      message: "Comment posted successfully",
      comment: {
        ...newComment.toObject(),
        likeCount: 0,
        dislikeCount: 0,
        replyCount: 0,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { message: "Error posting comment" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { commentId, userId, content } = body;

    if (!commentId || !userId || !content) {
      return NextResponse.json(
        { message: "Comment ID, User ID, and content are required" },
        { status: 400 }
      );
    }

    const comment = await CommentModel.findOne({
      _id: commentId,
      userId,
      isDeleted: false,
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found or you don't have permission to edit" },
        { status: 404 }
      );
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    return NextResponse.json({
      message: "Comment updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Error updating comment" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    const userId = url.searchParams.get("userId");

    if (!commentId || !userId) {
      return NextResponse.json(
        { message: "Comment ID and User ID are required" },
        { status: 400 }
      );
    }

    const comment = await CommentModel.findOne({
      _id: commentId,
      userId,
      isDeleted: false,
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found or you don't have permission to delete" },
        { status: 404 }
      );
    }

    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    return NextResponse.json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Error deleting comment" },
      { status: 500 }
    );
  }
};
