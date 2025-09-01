"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import KanbanBoard from "@/components/KanbanBoard";

interface UserData {
  email: string;
  name: string;
  isAuthenticated: boolean;
  loginTime: string;
}

export default function TrackerPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem("userAuth");
      const authToken = localStorage.getItem("authToken");

      if (!authData || !authToken) {
        toast.error("Please login to access tracker");
        router.push("/login");
        return;
      }

      try {
        const user = JSON.parse(authData);
        setUserData(user);

        // Set auth cookie for middleware
        document.cookie = `authToken=${authToken}; path=/; max-age=86400`; // 24 hours

        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 dark:from-orange-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
            My Job Application Tracker
          </h1>
        </div>
        <KanbanBoard />
      </main>
    </div>
  );
}

