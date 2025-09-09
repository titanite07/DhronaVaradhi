"use client";

import { useMemo } from "react";
import { JobCard } from "@/components/JobCard";
import VirtualScrollList from "@/components/VirtualScrollList";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  link: string;
  description: string;
  type: string;
  tags: string[];
  createdAt: string;
}

interface VirtualJobGridProps {
  jobs: Job[];
  isFavorited: (jobId: string) => boolean;
  onToggleFavorite: (job: Job) => void;
  containerHeight?: number;
  itemsPerRow?: number;
  itemHeight?: number;
}

export default function VirtualJobGrid({
  jobs,
  isFavorited,
  onToggleFavorite,
  containerHeight = 800,
  itemsPerRow = 3,
  itemHeight = 320,
}: VirtualJobGridProps) {

  const jobRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < jobs.length; i += itemsPerRow) {
      rows.push(jobs.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [jobs, itemsPerRow]);

  const renderJobRow = (row: Job[], index: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-4">
      {row.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          isFavorited={isFavorited(job._id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      {}
      {row.length < itemsPerRow &&
        Array.from({ length: itemsPerRow - row.length }).map((_, emptyIndex) => (
          <div key={`empty-${index}-${emptyIndex}`} />
        ))}
    </div>
  );

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/50 dark:to-rose-900/50 flex items-center justify-center">
            <svg className="h-10 w-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10a2 2 0 11-4 0 2 2 0 014 0zM12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No opportunities found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search filters or check back later for new opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <VirtualScrollList
      items={jobRows}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderJobRow}
      className="w-full"
      overscan={2}
    />
  );
}
