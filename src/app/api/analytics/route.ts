import { NextResponse } from "next/server";
import JobModel from "@/models/jobModel";
import dbConnect from "@/utils/dbConnect";

export const GET = async () => {
  try {
    await dbConnect();

    const totalJobs = await JobModel.countDocuments();

    const jobsByType = await JobModel.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const jobsByLocation = await JobModel.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentJobs = await JobModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const topCompanies = await JobModel.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const popularTags = await JobModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
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
      { status: 500 },
    );
  }
};

