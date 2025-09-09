import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  MapPin, 
  Building2, 
  Heart, 
  Briefcase, 
  Tag, 
  Plus, 
  MessageCircle,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
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
  source?: string;
  views?: number;
  salary?: string;
  isExternal?: boolean;
  featured?: boolean;
}

interface JobCardProps {
  job: Job;
  isFavorited?: boolean;
  onToggleFavorite?: (job: Job) => Promise<void> | void;
  onTrackJob?: (job: Job) => Promise<void> | void;
  onShowComments?: (job: Job) => void;
  showCommentButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  isFavorited = false, 
  onToggleFavorite, 
  onTrackJob,
  onShowComments,
  showCommentButton = true
}) => {
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
      className="group relative flex flex-col justify-between h-full min-h-[480px] p-6 rounded-3xl border border-orange-100 dark:border-orange-900/50 bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-orange-200 dark:hover:border-orange-800 overflow-hidden mb-6"
    >
      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-orange-50/20 via-transparent to-rose-50/20 dark:from-orange-900/10 dark:to-rose-900/10 group-hover:opacity-100"></div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl font-bold text-gray-800 transition-colors duration-300 dark:text-gray-100 line-clamp-2 group-hover:text-orange-700 dark:group-hover:text-orange-300">
                {job.title}
              </CardTitle>
              {job.featured && (
                <Badge className="px-2 py-1 text-xs font-medium text-yellow-700 border-0 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 dark:text-yellow-300">
                  ⭐ Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-1 text-gray-600 dark:text-gray-300">
              <Building2 className="w-4 h-4 text-orange-500" />
              <p className="text-sm font-medium">{job.company}</p>
              {job.source && job.source !== "User Submitted" && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {job.source}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                <p className="text-sm">{job.location}</p>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <p className="text-sm">{job.salary}</p>
                </div>
              )}
              {job.views && job.views > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-gray-400" />
                  <p className="text-xs">{job.views}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 transition-all duration-300 rounded-full bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/50 dark:to-rose-900/50 hover:from-orange-200 hover:to-rose-200 dark:hover:from-orange-800/70 dark:hover:to-rose-800/70 group/link"
            >
              <ExternalLink className="w-5 h-5 text-orange-600 transition-transform duration-300 dark:text-orange-400 group-hover/link:scale-110" />
            </a>
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {preview.title && (
          <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 p-4 my-4 bg-gradient-to-r from-orange-50/50 to-rose-50/50 dark:from-orange-900/20 dark:to-rose-900/20 backdrop-blur-sm max-h-[200px] overflow-hidden">
            {preview.image && preview.image.length > 0 && (
              <Image
                src={preview.image}
                alt="preview"
                width={400}
                height={120}
                className="object-cover w-full h-24 mb-3 shadow-md rounded-xl"
              />
            )}
            <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{preview.title}</h4>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
              {preview.description}
            </p>
          </div>
        )}

        <CardContent className="flex-grow px-0 mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3">
          {job.description}
        </CardContent>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          <Badge className="px-4 py-2 text-xs font-medium text-orange-700 border-0 rounded-full shadow-sm bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-300">
            <Briefcase className="w-3 h-3 mr-1" />
            {job.type}
          </Badge>
          <Badge className="px-4 py-2 text-xs font-medium border-0 rounded-full shadow-sm bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 dark:from-rose-900/50 dark:to-rose-800/50 dark:text-rose-300">
            <MapPin className="w-3 h-3 mr-1" />
            {job.location}
          </Badge>
          {job.tags.map((t, i) => (
            <Badge
              key={i}
              className="px-4 py-2 text-xs font-medium transition-shadow duration-300 border-0 rounded-full shadow-sm bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/50 dark:to-amber-800/50 dark:text-amber-300 hover:shadow-md"
            >
              <Tag className="w-3 h-3 mr-1" />
              {t}
            </Badge>
          ))}
        </div>
      </div>

      <CardFooter className="absolute z-20 flex flex-col gap-2 transition-all duration-300 opacity-0 bottom-4 right-4 group-hover:opacity-100">
        {}
        <Button
          size="sm"
          variant="outline"
          className="p-2 border-orange-200 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:border-orange-800"
          onClick={handleTrackJob}
          disabled={isTracking}
          title="Add to job tracker"
        >
          <Plus className={`h-4 w-4 text-orange-500 transition-all duration-300 ${isTracking ? 'animate-spin' : ''}`} />
        </Button>
        
        {}
        {showCommentButton && (
          <Button
            size="sm"
            variant="outline"
            className="p-2 border-blue-200 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-800"
            onClick={() => onShowComments?.(job)}
            title="View comments"
          >
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </Button>
        )}
        
        {}
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
      </CardFooter>
    </Card>
  );
};
