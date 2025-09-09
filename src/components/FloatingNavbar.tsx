"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Home, 
  BarChart3, 
  User, 
  LogIn, 
  UserPlus,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  authOnly?: boolean;
}

export default function FloatingNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  
  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="w-4 h-4" />,
      requiresAuth: true,
    },
    {
      href: "/tracker",
      label: "Tracker",
      icon: <Briefcase className="w-4 h-4" />,
      requiresAuth: true,
    },
    {
      href: "/login",
      label: "Login",
      icon: <LogIn className="w-4 h-4" />,
      authOnly: false,
    },
    {
      href: "/signup",
      label: "Sign Up",
      icon: <UserPlus className="w-4 h-4" />,
      authOnly: false,
    },
  ];

  
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('userAuth');
      const authToken = localStorage.getItem('authToken');
      
      if (authData && authToken) {
        try {
          const user = JSON.parse(authData);
          setIsAuthenticated(true);
          setUserName(user.name || user.email?.split('@')[0] || 'User');
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    
    
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAuthenticated(false);
    setUserName("");
    toast.success("Logged out successfully");
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const getVisibleNavItems = () => {
    return navItems.filter(item => {
      if (item.requiresAuth && !isAuthenticated) return false;
      if (item.authOnly === false && isAuthenticated && (item.href === '/login' || item.href === '/signup')) return false;
      return true;
    });
  };

  
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {}
      <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-orange-100 dark:border-orange-900/50' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl border border-orange-200/50 dark:border-orange-800/30'
      } rounded-full px-6 py-3`}>
        <div className="flex items-center space-x-6">
          {}
          <Link href="/" className="flex items-center space-x-2 mr-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent hidden md:block">
              DhronaVaradhi
            </span>
          </Link>

          {}
          <div className="hidden md:flex items-center space-x-1">
            {getVisibleNavItems().map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : "text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {}
          <div className="hidden md:flex items-center space-x-2 ml-4 pl-4 border-l border-orange-200 dark:border-orange-800">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </nav>

      {}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-orange-900/50 p-6">
            {}
            <div className="space-y-3">
              {getVisibleNavItems().map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>

            {}
            <div className="mt-6 pt-6 border-t border-orange-100 dark:border-orange-800">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Logged in</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400">
                      <LogIn className="w-4 h-4 mr-3" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white">
                      <UserPlus className="w-4 h-4 mr-3" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      <div className="h-20" />
    </>
  );
}

