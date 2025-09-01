import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Building2, Clock, Heart, Briefcase, Tag, Plus } from "lucide-react";
import { toast } from "sonner";

interface Job {
  _id: string;
  title: string;
  company: string;
  link: string;
  description: string;
  type: string;
  location: string;
  tags: string[];
  createdAt: string;
}

interface JobCardProps {
  job: Job;
  isFavorited?: boolean;
  onToggleFavorite?: (job: Job) => Promise<void> | void;
  onTrackJob?: (job: Job) => Promise<void> | void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isFavorited = false, onToggleFavorite, onTrackJob }) => {
  const [preview, setPreview] = useState<{
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  }>({});

  const [isTracking, setIsTracking] = useState(false);

  
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem("userIdentifier");
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userIdentifier", identifier);
    }
    return identifier;
  };

  const handleTrackJob = async () => {
    try {
      setIsTracking(true);
      const userIdentifier = getUserIdentifier();
      
      await axios.post("/api/tracked-jobs", {
        jobId: job._id,
        userIdentifier,
        status: "saved",
      });

      toast.success("Job added to tracker!");
      onTrackJob?.(job);
    } catch (err) {
      console.error("Error tracking job:", err);
      toast.error("Failed to add job to tracker");
    } finally {
      setIsTracking(false);
    }
  };

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await axios.get(`https://api.microlink.io`, {
          params: {
            url: job.link,
          },
        });

        setPreview(res.data.data);
      } catch (err) {
        console.log(err);
        console.log("No preview available");
      }
    };

    fetchPreview();
  }, [job.link]);

  return (
    <Card
      key={job._id}
      className="group relative flex flex-col justify-between h-full max-h-[500px] p-6 rounded-3xl border border-orange-100 dark:border-orange-900/50 bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-orange-200 dark:hover:border-orange-800 overflow-hidden"
    >
      
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-rose-50/20 dark:from-orange-900/10 dark:to-rose-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
              <Building2 className="h-4 w-4 text-orange-500" />
              <p className="text-sm font-medium">{job.company}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 text-rose-500" />
              <p className="text-sm">{job.location}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/50 dark:to-rose-900/50 hover:from-orange-200 hover:to-rose-200 dark:hover:from-orange-800/70 dark:hover:to-rose-800/70 transition-all duration-300 group/link"
            >
              <ExternalLink className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover/link:scale-110 transition-transform duration-300" />
            </a>
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="h-3 w-3" />
              <span>New</span>
            </div>
          </div>
        </div>

        {preview.title && (
          <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 p-4 my-4 bg-gradient-to-r from-orange-50/50 to-rose-50/50 dark:from-orange-900/20 dark:to-rose-900/20 backdrop-blur-sm max-h-[200px] overflow-hidden">
            {preview.image && (
              <Image
                src={preview.image}
                alt="preview"
                width={400}
                height={120}
                className="w-full h-24 object-cover rounded-xl mb-3 shadow-md"
              />
            )}
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 line-clamp-1">{preview.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {preview.description}
            </p>
          </div>
        )}

        <CardContent className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 px-0 mb-4 leading-relaxed min-h-[60px]">
          {job.description}
        </CardContent>
      </div>

      <CardFooter className="flex flex-wrap gap-2 mt-auto px-0 relative z-10">
        <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-300 px-4 py-2 rounded-full text-xs font-medium border-0 shadow-sm">
          <Briefcase className="h-3 w-3 mr-1" />
          {job.type}
        </Badge>
        <Badge className="bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 dark:from-rose-900/50 dark:to-rose-800/50 dark:text-rose-300 px-4 py-2 rounded-full text-xs font-medium border-0 shadow-sm">
          <MapPin className="h-3 w-3 mr-1" />
          {job.location}
        </Badge>
        {job.tags.map((t, i) => (
          <Badge
            key={i}
            className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/50 dark:to-amber-800/50 dark:text-amber-300 px-4 py-2 rounded-full text-xs font-medium border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Tag className="h-3 w-3 mr-1" />
            {t}
          </Badge>
        ))}
      </CardFooter>
      
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
      
        <Button
          size="sm"
          variant="outline"
          className="p-2 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-800"
          onClick={handleTrackJob}
          disabled={isTracking}
          title="Add to job tracker"
        >
          <Plus className={`h-4 w-4 text-orange-500 transition-all duration-300 ${isTracking ? 'animate-spin' : ''}`} />
        </Button>
        
      
        <button 
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorited 
              ? 'bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 dark:hover:bg-rose-800/70' 
              : 'bg-white/80 dark:bg-gray-800/80 hover:bg-rose-50 dark:hover:bg-rose-900/20'
          }`}
          onClick={() => onToggleFavorite?.(job)}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-300 ${
              isFavorited 
                ? 'text-rose-500 fill-current' 
                : 'text-rose-500 hover:fill-current'
            }`} 
          />
        </button>
      </div>
    </Card>
  );
};
