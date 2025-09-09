import { NextResponse, type NextRequest } from "next/server";
import TrackedJobModel from "@/models/trackedJobModel";
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

    const trackedJobs = await TrackedJobModel.find({ userIdentifier })
      .populate("jobId")
      .sort({ updatedAt: -1 });

    const jobsWithStatus = trackedJobs
      .filter((tracked) => tracked.jobId) 
      .map((tracked) => ({
        ...tracked.jobId._doc,
        trackingId: tracked._id,
        status: tracked.status,
        notes: tracked.notes,
        applicationDate: tracked.applicationDate,
        interviewDate: tracked.interviewDate,
        updatedAt: tracked.updatedAt,
      }));

    return NextResponse.json(jobsWithStatus);
  } catch (err) {
    console.log("Error getting tracked jobs", err);
    return NextResponse.json(
      { message: "Error getting tracked jobs" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { jobId, userIdentifier, status, notes, applicationDate, interviewDate } = body;

    if (!jobId || !userIdentifier || !status) {
      return NextResponse.json(
        { message: "Job ID, user identifier, and status are required" },
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

    
    const updateData = {
      status,
      updatedAt: new Date(),
      ...(notes !== undefined && { notes }),
      ...(applicationDate && { applicationDate: new Date(applicationDate) }),
      ...(interviewDate && { interviewDate: new Date(interviewDate) }),
    };

    const trackedJob = await TrackedJobModel.findOneAndUpdate(
      { jobId, userIdentifier },
      updateData,
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Job tracking updated successfully",
      trackedJob,
      success: true,
    });
  } catch (error) {
    console.error("Error updating tracked job:", error);
    return NextResponse.json(
      { message: "Error updating tracked job" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const trackingId = url.searchParams.get("trackingId");
    const userIdentifier = url.searchParams.get("userIdentifier");

    if (!trackingId || !userIdentifier) {
      return NextResponse.json(
        { message: "Tracking ID and user identifier are required" },
        { status: 400 }
      );
    }

    await TrackedJobModel.findOneAndDelete({ 
      _id: trackingId, 
      userIdentifier 
    });

    return NextResponse.json({
      message: "Job removed from tracking",
      success: true,
    });
  } catch (error) {
    console.error("Error removing tracked job:", error);
    return NextResponse.json(
      { message: "Error removing tracked job" },
      { status: 500 }
    );
  }
};

