import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import CommentModel from "@/models/commentModel";
import dbConnect from "@/utils/dbConnect";

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { commentId, userId, action } = body;

    if (!commentId || !userId || !action) {
      return NextResponse.json(
        { message: "Comment ID, User ID, and action are required" },
        { status: 400 }
      );
    }

    if (!["like", "dislike", "unlike", "undislike"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid action. Use 'like', 'dislike', 'unlike', or 'undislike'" },
        { status: 400 }
      );
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    const hasLiked = comment.likes.includes(userId);
    const hasDisliked = comment.dislikes.includes(userId);

    switch (action) {
      case "like":
        if (!hasLiked) {
          comment.likes.push(userId);
          
          if (hasDisliked) {
            comment.dislikes = comment.dislikes.filter((id: mongoose.Types.ObjectId) => id.toString() !== userId);
          }
        }
        break;

      case "unlike":
        if (hasLiked) {
          comment.likes = comment.likes.filter((id: mongoose.Types.ObjectId) => id.toString() !== userId);
        }
        break;

      case "dislike":
        if (!hasDisliked) {
          comment.dislikes.push(userId);
          
          if (hasLiked) {
            comment.likes = comment.likes.filter((id: mongoose.Types.ObjectId) => id.toString() !== userId);
          }
        }
        break;

      case "undislike":
        if (hasDisliked) {
          comment.dislikes = comment.dislikes.filter((id: mongoose.Types.ObjectId) => id.toString() !== userId);
        }
        break;
    }

    await comment.save();

    return NextResponse.json({
      message: `Comment ${action}d successfully`,
      likeCount: comment.likes.length,
      dislikeCount: comment.dislikes.length,
      hasLiked: comment.likes.includes(userId),
      hasDisliked: comment.dislikes.includes(userId),
      success: true,
    });
  } catch (error) {
    console.error("Error updating comment reaction:", error);
    return NextResponse.json(
      { message: "Error updating comment reaction" },
      { status: 500 }
    );
  }
};
