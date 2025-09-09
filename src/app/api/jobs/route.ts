import { NextResponse, type NextRequest } from "next/server";
import JobModel from "@/models/jobModel";
import dbConnect from "@/utils/dbConnect";
import axios from "axios";
interface JobQuery {
  type?: string;
  location?: { $regex: string; $options: string };
  tags?: { $regex: string; $options: string };
}
async function isLinkAlive(url: string) {
  try {
    const res = await axios.get(url, {
      timeout: 5000,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; JobBot/1.0; +https://example.com/bot)",
      },
    });
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

interface JobQuery {
  type?: string;
  location?: { $regex: string; $options: string };
  tags?: { $regex: string; $options: string };
  source?: string;
  featured?: boolean;
}

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const location = url.searchParams.get("location");
    const tag = url.searchParams.get("tag");
    const source = url.searchParams.get("source");
    const featured = url.searchParams.get("featured");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");
    const search = url.searchParams.get("search");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const query: JobQuery = {};

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (tag) {
      query.tags = { $regex: tag, $options: "i" };
    }

    if (source) {
      query.source = source;
    }

    if (featured === "true") {
      query.featured = true;
    }

    
    let jobs;
    if (search) {
      jobs = await JobModel.find({
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } }
        ]
      })
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    } else {
      jobs = await JobModel.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }

    
    const totalJobs = search
      ? await JobModel.countDocuments({
          ...query,
          $or: [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } }
          ]
        })
      : await JobModel.countDocuments(query);

    const totalPages = Math.ceil(totalJobs / limit);

    console.log(`Jobs API Debug: Found ${jobs.length} jobs, Total: ${totalJobs}, Query:`, query);

    
    if (jobs.length > 0) {
      const jobIds = jobs.map(job => job._id);
      await JobModel.updateMany(
        { _id: { $in: jobIds } },
        { $inc: { views: 1 } }
      );
    }

    return NextResponse.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.log("Error getting jobs", err);
    return NextResponse.json("Error getting jobs", { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({
        message: "Body is required",
        status: 400,
      });
    }

    const { title, company, location, link, description, type, tags } = body;
    if (!title || !company || !link) {
      return NextResponse.json({
        message: "Title, company and link are required",
        success: false,
      });
    }

    const isLinkValid = await isLinkAlive(link);
    if (isLinkValid === false) {
      return NextResponse.json({
        message: "Link is not valid",
        success: false,
      });
    }

    const newJob = new JobModel({
      title,
      company,
      location,
      link,
      description,
      type,
      tags: tags || [],
    });

    await newJob.save();

    return NextResponse.json({
      message: "Job saved successfully",
      job: newJob,
      success: true,
    });
  } catch (error) {
    console.error("Error saving job:", error);

    return NextResponse.json({
      message: "Error saving job",
      success: false,
    });
  }
};

