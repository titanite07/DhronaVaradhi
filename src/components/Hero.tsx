import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-gray-900 dark:to-neutral-900">
      
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_50%,theme(colors.orange.200),transparent_70%),radial-gradient(circle_at_80%_20%,theme(colors.rose.200),transparent_70%),radial-gradient(circle_at_40%_80%,theme(colors.amber.200),transparent_70%)] dark:bg-[radial-gradient(circle_at_20%_50%,theme(colors.orange.900),transparent_70%),radial-gradient(circle_at_80%_20%,theme(colors.rose.900),transparent_70%),radial-gradient(circle_at_40%_80%,theme(colors.amber.900),transparent_70%)] animate-pulse [animation-duration:4s]"></div>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,theme(colors.gray.400)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[radial-gradient(circle,theme(colors.gray.600)_1px,transparent_1px)] animate-pulse [animation-duration:6s]"></div>
      </div>

      
      <div className="container relative mx-auto px-6 py-20 md:py-28 lg:py-36 flex flex-col items-center">
      
        <div className="hidden lg:block absolute right-10 top-16 w-16 h-16 rounded-full bg-gradient-to-br from-orange-300/60 to-rose-300/60 dark:from-orange-700/60 dark:to-rose-700/60 backdrop-blur-sm border border-orange-200/30 dark:border-orange-700/30 animate-bounce [animation-duration:3s] hover:scale-110 transition-transform duration-300"></div>
        <div className="hidden lg:block absolute left-20 top-32 w-12 h-12 rounded-full bg-gradient-to-br from-rose-300/50 to-amber-300/50 dark:from-rose-700/50 dark:to-amber-700/50 backdrop-blur-sm border border-rose-200/30 dark:border-rose-700/30 animate-bounce [animation-delay:1000ms] [animation-duration:4s] hover:scale-110 transition-transform duration-300"></div>
        <div className="hidden lg:block absolute right-32 bottom-32 w-20 h-20 rounded-full bg-gradient-to-br from-amber-300/40 to-orange-300/40 dark:from-amber-700/40 dark:to-orange-700/40 backdrop-blur-sm border border-amber-200/30 dark:border-amber-700/30 animate-bounce [animation-delay:2000ms] [animation-duration:5s] hover:scale-110 transition-transform duration-300"></div>

      
        <div className="flex items-center gap-6 mb-8 flex-wrap justify-center">
          <Badge
            variant="outline"
            className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg px-4 py-2 text-sm font-medium border-orange-200/60 dark:border-orange-800/60 flex items-center gap-2 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 hover:border-orange-300/80 dark:hover:border-orange-700/80 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
          >
            <Heart className="w-4 h-4 text-rose-500 group-hover:scale-110 group-hover:text-rose-600 transition-all duration-300" />
            Built with care
          </Badge>
          <Badge
            variant="outline"
            className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg px-4 py-2 text-sm font-medium border-amber-200/60 dark:border-amber-800/60 flex items-center gap-2 hover:bg-amber-50/80 dark:hover:bg-amber-900/20 hover:border-amber-300/80 dark:hover:border-amber-700/80 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
          >
            <Users className="w-4 h-4 text-amber-600 group-hover:scale-110 group-hover:text-amber-700 transition-all duration-300" />
            Community-first
          </Badge>
          <Badge
            variant="outline"
            className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg px-4 py-2 text-sm font-medium border-rose-200/60 dark:border-rose-800/60 flex items-center gap-2 hover:bg-rose-50/80 dark:hover:bg-rose-900/20 hover:border-rose-300/80 dark:hover:border-rose-700/80 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
          >
            <Sparkles className="w-4 h-4 text-orange-500 group-hover:scale-110 group-hover:text-orange-600 transition-all duration-300" />
            Always free
          </Badge>
        </div>

      
        <h1 className="text-4xl md:text-6xl font-bold text-center max-w-5xl mb-8 leading-tight">
          <span className="block bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 dark:from-orange-400 dark:via-rose-400 dark:to-amber-400 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x">
            Find Your Next
          </span>
          <span className="block text-gray-800 dark:text-gray-100 mt-2 hover:scale-105 transition-transform duration-500 cursor-default">
            Great Opportunity
          </span>
        </h1>

      
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mb-12 leading-relaxed hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300">
          A warm community where opportunities are shared, connections are made, and everyone grows together. 
          <br className="hidden md:block" />
          <span className="font-medium bg-gradient-to-r from-orange-600 to-rose-600 dark:from-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
            Because the best jobs come from the best people.
          </span>
        </p>

      
        <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400 flex-wrap justify-center">
          <div className="group flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-default">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm group-hover:shadow-green-300/50 transition-shadow duration-300"></div>
            <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Live opportunities</span>
          </div>
          <div className="group flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-default">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse [animation-delay:500ms] shadow-sm group-hover:shadow-orange-300/50 transition-shadow duration-300"></div>
            <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Growing community</span>
          </div>
          <div className="group flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-default">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse [animation-delay:1000ms] shadow-sm group-hover:shadow-rose-300/50 transition-shadow duration-300"></div>
            <span className="group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">Verified links</span>
          </div>
        </div>
      </div>
    </section>
  );
}
