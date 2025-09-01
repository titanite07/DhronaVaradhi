"use client";

import { useState, useEffect, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import JobAnalytics from "@/components/JobAnalytics";
import VirtualJobGrid from "@/components/VirtualJobGrid";
import { useVirtualScrollConfig } from "@/hooks/useVirtualScrollConfig";
import Hero from "@/components/Hero";
import Docker from "@/components/Docker";
import FeatureShowcase from "@/components/FeatureShowcase";

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
      setFilteredJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to fetch jobs");
    }
  }, [filters]);

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
    <>
      <Hero />
      <Docker />
      <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_50%,theme(colors.orange.200),transparent_50%),radial-gradient(circle_at_80%_20%,theme(colors.rose.200),transparent_50%),radial-gradient(circle_at_40%_80%,theme(colors.amber.200),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_50%,theme(colors.orange.900),transparent_50%),radial-gradient(circle_at_80%_20%,theme(colors.rose.900),transparent_50%),radial-gradient(circle_at_40%_80%,theme(colors.amber.900),transparent_50%)]"></div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,theme(colors.gray.400)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[radial-gradient(circle,theme(colors.gray.600)_1px,transparent_1px)]"></div>
        </div>

        <div className="relative z-10 p-6 pb-20 sm:p-8 lg:p-12">
          <div className="max-w-8xl mx-auto">
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
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/tracker'}
                  className="rounded-full px-6 py-2 text-sm flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <Briefcase className="h-4 w-4" />
                  Job Tracker
                </Button>

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

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button

