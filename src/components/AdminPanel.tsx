"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Database, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Play
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface SyncStats {
  lastSync: string | null;
  isRunning: boolean;
}

interface SyncResult {
  success: boolean;
  added: number;
  skipped: number;
  errors: number;
}

export default function AdminPanel() {
  const [syncStats, setSyncStats] = useState<SyncStats>({ lastSync: null, isRunning: false });
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    fetchSyncStats();
  }, []);

  const fetchSyncStats = async () => {
    try {
      const response = await axios.get('/api/jobs/sync');
      setSyncStats(response.data);
    } catch (error) {
      console.error('Error fetching sync stats:', error);
    }
  };

  const handleForcSync = async () => {
    try {
      setSyncing(true);
      const response = await axios.post('/api/jobs/sync');
      
      if (response.data.success) {
        setLastSyncResult(response.data.stats);
        toast.success(`Sync completed! Added ${response.data.stats.added} new jobs`);
      } else {
        toast.error(response.data.message || "Sync failed");
      }
      
      await fetchSyncStats();
    } catch (error) {
      console.error('Error syncing jobs:', error);
      toast.error("Failed to sync jobs");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 dark:from-orange-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage job synchronization and view system statistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Sync Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Current Status</span>
                  <Badge className={syncStats.isRunning ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}>
                    {syncStats.isRunning ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Running
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Idle
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Last Sync</span>
                  <span className="text-sm font-medium">
                    {syncStats.lastSync 
                      ? new Date(syncStats.lastSync).toLocaleString()
                      : "Never"
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          {lastSyncResult && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Last Sync Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Added</span>
                    <Badge className="bg-green-100 text-green-700">
                      {lastSyncResult.added}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Skipped</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      {lastSyncResult.skipped}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Errors</span>
                    <Badge className="bg-red-100 text-red-700">
                      {lastSyncResult.errors}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-orange-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleForcSync}
                disabled={syncing || syncStats.isRunning}
                className="w-full"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Sync Now
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={fetchSyncStats}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Job Sync Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Automatic Sync Schedule</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Jobs are automatically synchronized every 4 hours from multiple sources including:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                  <li>Remotive (Remote jobs)</li>
                  <li>GitHub Jobs</li>
                  <li>Adzuna API</li>
                  <li>Workable</li>
                  <li>Stack Overflow</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Cleanup Process</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  External jobs older than 60 days are automatically removed daily at 2:00 AM to keep the database clean.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-200">Note</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Manual sync should only be used when testing or when immediate updates are needed. 
                      The automatic schedule is optimized to avoid rate limiting from external APIs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
