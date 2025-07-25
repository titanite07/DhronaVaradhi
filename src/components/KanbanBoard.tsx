"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Building2, Clock, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface TrackedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  link: string;
  tags: string[];
  type: string;
  trackingId: string;
  status: "saved" | "applied" | "interviewing" | "offered" | "rejected";
  notes?: string;
  applicationDate?: string;
  interviewDate?: string;
  updatedAt: string;
}

const COLUMNS = [
  { id: "saved", title: "Saved", color: "bg-blue-100 dark:bg-blue-900/20" },
  { id: "applied", title: "Applied", color: "bg-yellow-100 dark:bg-yellow-900/20" },
  { id: "interviewing", title: "Interviewing", color: "bg-purple-100 dark:bg-purple-900/20" },
  { id: "offered", title: "Offered", color: "bg-green-100 dark:bg-green-900/20" },
  { id: "rejected", title: "Rejected", color: "bg-red-100 dark:bg-red-900/20" },
];

export default function KanbanBoard() {
  const [jobs, setJobs] = useState<TrackedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedJob, setDraggedJob] = useState<TrackedJob | null>(null);

  // Generate a simple user identifier (in production, use proper user auth)
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem("userIdentifier");
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userIdentifier", identifier);
    }
    return identifier;
  };

  const fetchTrackedJobs = useCallback(async () => {
    try {
      setLoading(true);
      const userIdentifier = getUserIdentifier();
      const res = await axios.get(`/api/tracked-jobs?userIdentifier=${userIdentifier}`);
      
      if (res.status === 200) {
        setJobs(res.data);
      }
    } catch (err) {
      console.log("Error fetching tracked jobs:", err);
      toast.error("Failed to load tracked jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateJobStatus = async (jobId: string, trackingId: string, newStatus: string) => {
    try {
      const userIdentifier = getUserIdentifier();
      await axios.post("/api/tracked-jobs", {
        jobId,
        userIdentifier,
        status: newStatus,
      });

      // Update local state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.trackingId === trackingId
            ? { ...job, status: newStatus as TrackedJob["status"], updatedAt: new Date().toISOString() }
            : job
        )
      );

      toast.success(`Job moved to ${newStatus}`);
    } catch (err) {
      console.error("Error updating job status:", err);
      toast.error("Failed to update job status");
    }
  };

  const removeTrackedJob = async (trackingId: string) => {
    try {
      const userIdentifier = getUserIdentifier();
      await axios.delete(`/api/tracked-jobs?trackingId=${trackingId}&userIdentifier=${userIdentifier}`);
      
      setJobs(prevJobs => prevJobs.filter(job => job.trackingId !== trackingId));
      toast.success("Job removed from tracker");
    } catch (err) {
      console.error("Error removing tracked job:", err);
      toast.error("Failed to remove job");
    }
  };

  useEffect(() => {
    fetchTrackedJobs();
  }, [fetchTrackedJobs]);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, job: TrackedJob) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (draggedJob && draggedJob.status !== newStatus) {
      updateJobStatus(draggedJob._id, draggedJob.trackingId, newStatus);
    }
    
    setDraggedJob(null);
  };

  const getJobsByStatus = (status: string) => {
    return jobs.filter(job => job.status === status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {COLUMNS.map((column) => (
        <div
          key={column.id}
          className={`${column.color} rounded-lg p-4 min-h-[500px]`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h3 className="font-semibold text-lg mb-4 text-center">
            {column.title}
            <span className="ml-2 text-sm bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-full">
              {getJobsByStatus(column.id).length}
            </span>
          </h3>
          
          <div className="space-y-3">
            {getJobsByStatus(column.id).map((job) => (
              <Card
                key={job.trackingId}
                className="cursor-move hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                draggable
                onDragStart={(e) => handleDragStart(e, job)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {job.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrackedJob(job.trackingId)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Building2 className="w-3 h-3" />
                      <span className="truncate">{job.company}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{job.type}</span>
                    </div>
                    
                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {job.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{job.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </a>
                      </Button>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(job.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {getJobsByStatus(column.id).length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  Drop jobs here or add from the main page
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
