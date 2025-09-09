import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, MapPin, Building2, Tag, Calendar } from "lucide-react";

interface AnalyticsData {
  totalJobs: number;
  recentJobs: number;
  jobsByType: Array<{ _id: string; count: number }>;
  jobsByLocation: Array<{ _id: string; count: number }>;
  topCompanies: Array<{ _id: string; count: number }>;
  popularTags: Array<{ _id: string; count: number }>;
}

export default function JobAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
  const res = await axios.get<AnalyticsData>("/api/analytics");
  setAnalytics(res.data as AnalyticsData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Total Opportunities
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {analytics.totalJobs}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-300">
              This Week
            </CardTitle>
            <Calendar className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-800 dark:text-rose-200">
              {analytics.recentJobs}
            </div>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              New opportunities
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Companies
            </CardTitle>
            <Building2 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
              {analytics.topCompanies.length}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Hiring now
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Locations
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {analytics.jobsByLocation.length}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Available markets
            </p>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Job Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.jobsByType.map((type) => (
              <div key={type._id} className="flex justify-between items-center">
                <span className="text-sm font-medium">{type._id}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {type.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              Top Companies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.topCompanies.slice(0, 5).map((company) => (
              <div key={company._id} className="flex justify-between items-center">
                <span className="text-sm font-medium">{company._id}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {company.count} jobs
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-500" />
              Popular Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.popularTags.slice(0, 5).map((tag) => (
              <div key={tag._id} className="flex justify-between items-center">
                <span className="text-sm font-medium">{tag._id}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {tag.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
