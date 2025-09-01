"use client";

import { useState, useEffect, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import JobAnalytics from "@/components/JobAnalytics";
import VirtualJobGrid from "@/components/VirtualJobGrid";
import { useVirtualScrollConfig } from "@/hooks/useVirtualScrollConfig";
import Hero from "@/components/Hero";
import Docker from "@/components/Docker";
import FeatureShowcase from "@/components/FeatureShowcase";
import { toast } from "sonner";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { X, Filter, Plus, Briefcase, Heart } from "lucide-react";

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

export default function Home() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Remote");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Full Time");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    tag: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { favorites, isFavorited, toggleFavorite } = useFavorites();
  const virtualScrollConfig = useVirtualScrollConfig();

  const fetchJobs = useCallback(async () => {
    console.log("Fetching jobs with filters:", filters);
    try {
      const res = await axios.get("/api/jobs", {
        params: {
          type: filters.type,
          location: filters.location,
          tag: filters.tag,
        },
      });
      console.log("Jobs API response:", res.status, res.data);
      console.log("API returned data type:", typeof res.data, "Length:", res.data?.length);
      
      if (res.status === 200) {
        console.log("Setting filtered jobs to:", res.data);
        setFilteredJobs(res.data);
        console.log("Set filtered jobs:", res.data.length, "jobs");
        
        // Force a re-render debug
        setTimeout(() => {
          console.log("After state update - filteredJobs should be updated");
        }, 100);
      } else {
        toast.error("Failed to fetch jobs");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to fetch jobs");
    }
  }, [filters]);

  const handleSubmit = async () => {
    if (!title || !company || !link) {
      toast.error("Title, company, and link are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/jobs", {
        title,
        company,
        location,
        link,
        description,
        type,
        tags,
      });

      if (res.status === 200) {
        toast.success("Job posted successfully!");
        setTitle("");
        setCompany("");
        setLocation("Remote");
        setLink("");
        setDescription("");
        setType("Full Time");
        setTags([]);
        setDialogOpen(false);
        fetchJobs(); // Refresh the jobs list
      }
    } catch (err) {
      console.error("Error posting job:", err);
      toast.error("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const applyFilters = () => {
    fetchJobs();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      location: "",
      tag: "",
    });
    setShowFilters(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const currentJobs = showFavorites ? favorites : filteredJobs;
  
  // Debug logging
  console.log("Current jobs state:", {
    showFavorites,
    favoritesCount: favorites.length,
    filteredJobsCount: filteredJobs.length,
    currentJobsCount: currentJobs.length,
    filters,
    actualCurrentJobs: currentJobs
  });
  
  // Also log when filteredJobs array changes
  useEffect(() => {
    console.log("Filtered Jobs array updated:", {
      filteredJobsLength: filteredJobs.length,
      sampleJob: filteredJobs[0],
      allFilteredJobs: filteredJobs
    });
  }, [filteredJobs]);

  return (
    <>
      <Hero />
      <Docker />
      <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
        {/* Warm, comforting gradient background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_50%,theme(colors.orange.200),transparent_50%),radial-gradient(circle_at_80%_20%,theme(colors.rose.200),transparent_50%),radial-gradient(circle_at_40%_80%,theme(colors.amber.200),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_50%,theme(colors.orange.900),transparent_50%),radial-gradient(circle_at_80%_20%,theme(colors.rose.900),transparent_50%),radial-gradient(circle_at_40%_80%,theme(colors.amber.900),transparent_50%)]"></div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,theme(colors.gray.400)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[radial-gradient(circle,theme(colors.gray.600)_1px,transparent_1px)]"></div>
        </div>

      {/* Main content */}
      <div className="relative z-10 p-6 pb-20 sm:p-8 lg:p-12">
        <div className="max-w-8xl mx-auto">
          {/* Header section with modern glass morphism */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                  DhronaVaradhi
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Discover amazing opportunities shared by our community
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowFavorites(!showFavorites)}
                variant={showFavorites ? "default" : "outline"}
                className="rounded-full transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Heart className="h-4 w-4 mr-2" />
                {showFavorites ? "Show All Jobs" : "View Favorites"}
                {!showFavorites && favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                    {favorites.length}
                  </Badge>
                )}
              </Button>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="rounded-full transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Share Opportunity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                      Share a New Opportunity
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Job Title *
                        </label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Senior Frontend Developer"
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company *
                        </label>
                        <Input
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. TechCorp"
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Location
                        </label>
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Remote, San Francisco"
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Job Type
                        </label>
                        <Select value={type} onValueChange={setType}>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full Time">Full Time</SelectItem>
                            <SelectItem value="Part Time">Part Time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Freelance">Freelance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Application Link *
                      </label>
                      <Input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://example.com/apply"
                        className="rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Job Description
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the role and requirements..."
                        rows={4}
                        className="rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          placeholder="Add a tag (e.g. React, Remote)"
                          className="rounded-lg"
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                          className="rounded-lg"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((t, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => removeTag(t)}
                          >
                            {t} <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
                      size="lg"
                    >
                      {loading ? "Posting..." : "Post Job Opportunity"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters section */}
          {showFilters && (
            <Card className="mb-8 border-none shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Filter Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Job Type
                    </label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) =>
                        setFilters({ ...filters, type: value })
                      }
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <Input
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                      placeholder="Filter by location"
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tag</label>
                    <Input
                      value={filters.tag}
                      onChange={(e) =>
                        setFilters({ ...filters, tag: e.target.value })
                      }
                      placeholder="Filter by tag"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={applyFilters}
                    className="rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="rounded-lg"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics section */}
          {!showFavorites && filteredJobs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                Job Market Insights
              </h2>
              <JobAnalytics />
            </div>
          )}

          {/* Virtual Jobs grid */}
          <VirtualJobGrid
            jobs={currentJobs}
            isFavorited={isFavorited}
            onToggleFavorite={toggleFavorite}
            containerHeight={virtualScrollConfig.containerHeight}
            itemsPerRow={virtualScrollConfig.itemsPerRow}
            itemHeight={virtualScrollConfig.itemHeight}
          />

          {currentJobs.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/50 dark:to-rose-900/50 flex items-center justify-center">
                  {showFavorites ? (
                    <Heart className="h-10 w-10 text-rose-500" />
                  ) : (
                    <Briefcase className="h-10 w-10 text-orange-500" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {showFavorites ? "No favorites yet" : "No opportunities found"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {showFavorites 
                    ? "Start favoriting jobs you're interested in!"
                    : "Be the first to share an opportunity with the community!"
                  }
                </p>
                {!showFavorites && (
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-8 py-3"
                  >
                    Share the First Job
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <FeatureShowcase />
    </>
  );
}
