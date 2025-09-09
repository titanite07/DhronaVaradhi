"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Briefcase, 
  Heart, 
  TrendingUp, 
  Calendar
} from "lucide-react";
import Link from "next/link";
import JobAnalytics from "@/components/JobAnalytics";
import { useFavorites } from "@/hooks/useFavorites";

interface UserData {
  email: string;
  name: string;
  isAuthenticated: boolean;
  loginTime: string;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { favorites } = useFavorites();

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('userAuth');
      const authToken = localStorage.getItem('authToken');
      
      if (!authData || !authToken) {
        toast.error("Please login to access dashboard");
        router.push('/login');
        return;
      }
      
      try {
        const user = JSON.parse(authData);
        setUserData(user);
        
        
        document.cookie = `authToken=${authToken}; path=/; max-age=86400`; 
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome back, {userData.name}! 
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s what&apos;s happening with your job search today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-orange-100 dark:border-orange-900/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saved Jobs</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{favorites.length}</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 dark:border-orange-900/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">12</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 dark:border-orange-900/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">3</p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 dark:border-orange-900/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">25%</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Job Market Analytics</h3>
          <JobAnalytics />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recommended for You</h3>
            <Link href="/">
              <Button variant="outline" className="border-orange-200 hover:bg-orange-50 text-orange-600">
                View All Jobs
              </Button>
            </Link>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Visit the main jobs page to see personalized recommendations
            </p>
            <Link href="/">
              <Button className="mt-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

