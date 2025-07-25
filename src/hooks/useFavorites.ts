import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

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

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Job[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Generate a simple user identifier (in production, use proper user auth)
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem("userIdentifier");
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userIdentifier", identifier);
    }
    return identifier;
  };

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const userIdentifier = getUserIdentifier();
      const res = await axios.get(`/api/favorites?userIdentifier=${userIdentifier}`);
      
      if (res.status === 200) {
        setFavorites(res.data);
        setFavoriteIds(new Set(res.data.map((job: Job) => job._id)));
      }
    } catch (err) {
      console.log("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = async (job: Job) => {
    try {
      const userIdentifier = getUserIdentifier();
      const isFavorited = favoriteIds.has(job._id);
      const action = isFavorited ? "remove" : "add";

      const res = await axios.post("/api/favorites", {
        jobId: job._id,
        userIdentifier,
        action,
      });

      if (res.data.success) {
        if (action === "add") {
          setFavorites(prev => [job, ...prev]);
          setFavoriteIds(prev => new Set([...prev, job._id]));
          toast.success("Job added to favorites! ❤️");
        } else {
          setFavorites(prev => prev.filter(fav => fav._id !== job._id));
          setFavoriteIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(job._id);
            return newSet;
          });
          toast.success("Job removed from favorites");
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error managing favorites";
      toast.error(errorMessage);
    }
  };

  const isFavorited = (jobId: string) => favoriteIds.has(jobId);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    favoriteIds,
    loading,
    toggleFavorite,
    isFavorited,
    refetchFavorites: fetchFavorites,
  };
};
