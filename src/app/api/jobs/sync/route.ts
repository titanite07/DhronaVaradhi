import { NextResponse } from "next/server";
import jobSyncService from "@/services/jobSyncService";

export const POST = async () => {
  try {
    
    const syncInfo = await jobSyncService.getLastSyncInfo();
    if (syncInfo.isRunning) {
      return NextResponse.json({
        message: "Job sync is already running",
        success: false,
        isRunning: true,
      });
    }

    
    const result = await jobSyncService.forceSyncJobs();

    return NextResponse.json({
      message: "Job sync completed",
      success: result.success,
      stats: {
        added: result.added,
        skipped: result.skipped,
        errors: result.errors,
      },
    });
  } catch (error) {
    console.error("Error in job sync API:", error);
    return NextResponse.json(
      { message: "Error syncing jobs", success: false },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const syncInfo = await jobSyncService.getLastSyncInfo();
    
    return NextResponse.json({
      lastSync: syncInfo.lastSync,
      isRunning: syncInfo.isRunning,
      success: true,
    });
  } catch (error) {
    console.error("Error getting sync info:", error);
    return NextResponse.json(
      { message: "Error getting sync info", success: false },
      { status: 500 }
    );
  }
};
