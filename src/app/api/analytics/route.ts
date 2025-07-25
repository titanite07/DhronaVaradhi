import { NextResponse } from "next/server";
import JobModel from "@/models/jobModel";
import dbConnect from "@/utils/dbConnect";

export const GET = async () => {
  try {
    await dbConnect();

    // Get total jobs count
    const totalJobs = await JobModel.countDocuments();

    // Get jobs by type
    const jobsByType = await JobModel.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get jobs by location
    const jobsByLocation = await JobModel.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent jobs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentJobs = await JobModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get top companies
    const topCompanies = await JobModel.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get most popular tags
    const popularTags = await JobModel.aggregate([
      {
        $unwind: "$tags"
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return NextResponse.json({
      totalJobs,
      recentJobs,
      jobsByType,
      jobsByLocation,
      topCompanies,
      popularTags,
    });
  } catch (err) {
    console.log("Error getting analytics", err);
    return NextResponse.json(
      { message: "Error getting analytics" },
      { status: 500 }
    );
  }
};
