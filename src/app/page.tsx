"use client";

import { useState, useEffect, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import JobAnalytics from "@/components/JobAnalytics";
import VirtualJobGrid from "@/components/VirtualJobGrid";
import { useVirtualScrollConfig } from "@/hooks/useVirtualScrollConfig";

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
import { toast } from "sonner";
import axios from "axios";
import { X, Filter, Plus, Briefcase, Heart } from "lucide-react";

const warmOrange = "text-orange-600 dark:text-orange-400";
const modernCard = "border border-orange-100 dark:border-orange-900/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-orange-200 dark:hover:border-orange-800";
const softGlassCard = "bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-orange-100/50 dark:border-orange-900/20";

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

  // Use favorites hook
  const { favorites, isFavorited, toggleFavorite } = useFavorites();

  // Use responsive virtual scroll configuration
  const virtualScrollConfig = useVirtualScrollConfig();

  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get("/api/jobs", {
        params: {
          type: filters.type,
          location: filters.location,
          tag: filters.tag,
        },
      });
      if (res.status === 200) {
        setFilteredJobs(res.data);
      } else {
        toast.error("Failed to fetch jobs");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch jobs");
    }
  }, [filters.type, filters.location, filters.tag]);

  const handleSubmit = async () => {
    setLoading(true);
    if (!title || !company || !link || !description) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }
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

      if (res.data.success) {
        toast.success("Job submitted successfully");
        await fetchJobs();
        setTitle("");
        setCompany("");
        setLocation("Remote");
        setLink("");
        setDescription("");
        setType("Full Time");
        setTags([]);
        setDialogOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit job");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t: string) => t !== tagToRemove));
  };

  const resetFilters = () => {
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

  return (
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
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 dark:from-orange-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
                Opportunities Await
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                Discover, share, and connect with meaningful career opportunities in a supportive community.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Navigation to tracker */}
              <Button
                variant="outline"
                onClick={() => window.location.href = '/tracker'}
                className="rounded-full px-6 py-2 text-sm flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <Briefcase className="h-4 w-4" />
                Job Tracker
              </Button>

              {/* View toggle buttons */}
              <div className="flex gap-2 p-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Button
                  variant={!showFavorites ? "default" : "ghost"}
                  onClick={() => setShowFavorites(false)}
                  className="rounded-full px-6 py-2 text-sm"
                >
                  All Jobs
                </Button>
                <Button
                  variant={showFavorites ? "default" : "ghost"}
                  onClick={() => setShowFavorites(true)}
                  className="rounded-full px-6 py-2 text-sm flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Favorites ({favorites.length})
                </Button>
              </div>

              {/* Modern filter button */}
              {!showFavorites && (
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full ${softGlassCard} border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group`}
                >
                  <Filter className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover:rotate-180 transition-transform duration-300" />
                  <span className="font-medium">Filter Jobs</span>
                  {(filters.type || filters.location || filters.tag) && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  )}
                </Button>
              )}
              
              {/* Modern add job button */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:via-rose-600 hover:to-amber-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="h-5 w-5" />
                    Share Opportunity
                  </Button>
                </DialogTrigger>
                <DialogContent className={`sm:max-w-2xl ${softGlassCard} border-orange-200 dark:border-orange-800 rounded-3xl`}>
                  <DialogHeader>
                    <DialogTitle className={`text-2xl font-bold ${warmOrange} flex items-center gap-3`}>
                      <Briefcase className="h-6 w-6" />
                      Share a New Opportunity
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Job Title *"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        className="rounded-xl"
                      />
                      <Input
                        placeholder="Company *"
                        value={company}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <Input
                      placeholder="Job Link *"
                      value={link}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                      className="rounded-xl"
                    />
                    <Textarea
                      placeholder="Job Description"
                      value={description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                      className="rounded-xl min-h-[100px]"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="On-site">On-site</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full Time">Full Time</SelectItem>
                          <SelectItem value="Part Time">Part Time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag (press Enter)"
                        value={tag}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTag(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        className="rounded-xl"
                      />
                      <Button onClick={addTag} variant="outline" className="rounded-xl px-6">
                        Add
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((t: string, index: number) => (
                          <Badge
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 rounded-full flex items-center gap-2"
                          >
                            {t}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeTag(t)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button 
                      onClick={handleSubmit} 
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-medium py-3"
                    >
                      {loading ? "Submitting..." : "Share Opportunity"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters section */}
          {showFilters && !showFavorites && (
            <Card className={`mb-8 ${modernCard} ${softGlassCard} rounded-2xl`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <Select
                    value={filters.type}
                    onValueChange={(value: string) =>
                      setFilters({ ...filters, type: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Time">Full Time</SelectItem>
                      <SelectItem value="Part Time">Part Time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Filter by Location"
                    value={filters.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="rounded-xl"
                  />
                  <Input
                    placeholder="Filter by Tag"
                    value={filters.tag}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFilters({ ...filters, tag: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={resetFilters} variant="outline" className="rounded-xl">
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics Dashboard */}
          {!showFavorites && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 dark:from-orange-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
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
  );
}
