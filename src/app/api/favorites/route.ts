import { NextResponse, type NextRequest } from "next/server";
import FavoriteModel from "@/models/favoriteModel";
import JobModel from "@/models/jobModel";
import dbConnect from "@/utils/dbConnect";

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const userIdentifier = url.searchParams.get("userIdentifier");

    if (!userIdentifier) {
      return NextResponse.json(
        { message: "User identifier is required" },
        { status: 400 }
      );
    }

    const favorites = await FavoriteModel.find({ userIdentifier })
      .populate("jobId")
      .sort({ createdAt: -1 });

    const favoriteJobs = favorites
      .filter((fav) => fav.jobId) // Filter out null populated refs
      .map((fav) => fav.jobId);

    return NextResponse.json(favoriteJobs);
  } catch (err) {
    console.log("Error getting favorites", err);
    return NextResponse.json(
      { message: "Error getting favorites" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { jobId, userIdentifier, action } = body;

    if (!jobId || !userIdentifier || !action) {
      return NextResponse.json(
        { message: "Job ID, user identifier, and action are required" },
        { status: 400 }
      );
    }

    const job = await JobModel.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    if (action === "add") {
      try {
        const newFavorite = new FavoriteModel({
          jobId,
          userIdentifier,
        });

        await newFavorite.save();

        return NextResponse.json({
          message: "Job added to favorites",
          success: true,
        });
      } catch (err) {
        // Handle duplicate key error (job already in favorites)
        if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
          return NextResponse.json(
            { message: "Job already in favorites" },
            { status: 400 }
          );
        }
        throw err;
      }
    } else if (action === "remove") {
      await FavoriteModel.deleteOne({ jobId, userIdentifier });

      return NextResponse.json({
        message: "Job removed from favorites",
        success: true,
      });
    } else {
      return NextResponse.json(
        { message: "Invalid action. Use 'add' or 'remove'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error managing favorites:", error);
    return NextResponse.json(
      { message: "Error managing favorites" },
      { status: 500 }
    );
  }
};

