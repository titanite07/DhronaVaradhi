import { 
  Heart, 
  MessageCircle, 
  Bell, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Calendar,
  BookmarkPlus,
  Share2,
  Star,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "planned" | "development" | "beta" | "live";
  category: "community" | "productivity" | "ai" | "security";
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, status, category }) => {
  const statusColors = {
    planned: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    development: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    beta: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    live: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
  };

  const categoryColors = {
    community: "border-l-rose-400",
    productivity: "border-l-blue-400", 
    ai: "border-l-purple-400",
    security: "border-l-green-400"
  };

  return (
    <Card className={`h-full border-l-4 ${categoryColors[category]} bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
              {icon}
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Badge className={`text-xs ${statusColors[status]} border-0`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default function FeatureShowcase() {
  const features: FeatureCardProps[] = [
    // Community Features
    {
      icon: <Heart className="h-5 w-5 text-rose-500" />,
      title: "Job Favorites & Wishlist",
      description: "Save interesting opportunities for later and build your dream job wishlist with smart recommendations.",
      status: "planned",
      category: "community"
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-blue-500" />,
      title: "Community Comments",
      description: "Discuss opportunities, share insights, and get advice from the community on specific job postings.",
      status: "development",
      category: "community"
    },
    {
      icon: <Users className="h-5 w-5 text-indigo-500" />,
      title: "Referral Network",
      description: "Connect with people who work at companies you&apos;re interested in and get warm introductions.",
      status: "planned",
      category: "community"
    },
    {
      icon: <Share2 className="h-5 w-5 text-green-500" />,
      title: "Social Sharing",
      description: "Share job opportunities across social platforms and track which posts generate the most engagement.",
      status: "beta",
      category: "community"
    },

    // Productivity Features
    {
      icon: <Bell className="h-5 w-5 text-amber-500" />,
      title: "Smart Notifications",
      description: "Get personalized alerts for jobs matching your skills, salary expectations, and career goals.",
      status: "development",
      category: "productivity"
    },
    {
      icon: <BookmarkPlus className="h-5 w-5 text-purple-500" />,
      title: "Application Tracker",
      description: "Track your job applications, interview schedules, and follow-ups all in one organized dashboard.",
      status: "planned",
      category: "productivity"
    },
    {
      icon: <Calendar className="h-5 w-5 text-orange-500" />,
      title: "Interview Scheduler",
      description: "Coordinate interviews directly through the platform with calendar integration and reminder system.",
      status: "planned",
      category: "productivity"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      title: "Market Analytics",
      description: "See salary trends, skill demand analytics, and company hiring patterns to make informed decisions.",
      status: "development",
      category: "productivity"
    },

    // AI Features
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "AI Job Matching",
      description: "Advanced AI algorithms that learn your preferences and automatically surface the most relevant opportunities.",
      status: "beta",
      category: "ai"
    },
    {
      icon: <Target className="h-5 w-5 text-red-500" />,
      title: "Resume Optimization",
      description: "AI-powered suggestions to optimize your resume for specific job postings and ATS systems.",
      status: "planned",
      category: "ai"
    },
    {
      icon: <Star className="h-5 w-5 text-indigo-600" />,
      title: "Skill Gap Analysis",
      description: "Identify missing skills for your dream jobs and get personalized learning recommendations.",
      status: "development",
      category: "ai"
    },

    // Security Features
    {
      icon: <Shield className="h-5 w-5 text-green-600" />,
      title: "Verified Companies",
      description: "Company verification system to ensure all job postings are from legitimate, trusted employers.",
      status: "live",
      category: "security"
    }
  ];

  const groupedFeatures = {
    community: features.filter(f => f.category === "community"),
    productivity: features.filter(f => f.category === "productivity"), 
    ai: features.filter(f => f.category === "ai"),
    security: features.filter(f => f.category === "security")
  };

  return (
    <div className="py-16 bg-gradient-to-br from-orange-50/50 via-rose-50/30 to-amber-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 dark:from-orange-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent">
            Upcoming Features & Roadmap
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We&apos;re constantly evolving to make job searching more human, connected, and effective. 
            Here&apos;s what we&apos;re building to support your career journey.
          </p>
        </div>

        <div className="space-y-12">
          {/* Community Features */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-rose-400 to-rose-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Community & Connection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedFeatures.community.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </section>

          {/* Productivity Features */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Productivity & Organization</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedFeatures.productivity.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </section>

          {/* AI Features */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI-Powered Intelligence</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedFeatures.ai.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </section>

          {/* Security Features */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Trust & Security</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {groupedFeatures.security.map((feature, index) => (
                <div key={index} className="max-w-md mx-auto w-full">
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/20 dark:to-rose-900/20 rounded-3xl backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Help Shape Our Future
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Have ideas for features that would make your job search better? We&apos;d love to hear from you! 
            Your feedback drives our development roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full cursor-pointer transition-colors">
              Suggest a Feature
            </Badge>
            <Badge className="bg-white dark:bg-gray-800 text-orange-500 dark:text-orange-400 border border-orange-200 dark:border-orange-800 px-6 py-3 rounded-full cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
              Join Beta Testing
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
