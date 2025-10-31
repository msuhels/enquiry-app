"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth-modules";
import UserSidebar from "@/components/vendor-sidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser]  = useState("")

   const [isWelcome, setIsWelcome] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const showedWelcome = localStorage.getItem("showedWelcome");
      setIsWelcome(showedWelcome);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/admin/users/getAuthUser");
      const data = await res.json();
      return data;
    };

    const fetchUserRole = async () => {
      const data = await fetchUser();
      if (data) {
        setUserRole(data.userDetails.role);
        setUser(data.userDetails)
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchUserRole();
  }, [isAuthenticated]);

  useEffect(() => {
    if (userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "user") {
      router.push("/b2b");
      setIsLoading(false);
    }
  }, [userRole]);

  const handleLogout = () => {
    logout();
     if (typeof window !== "undefined") {
      localStorage.removeItem("showedWelcome");
    }
  };

    useEffect(() => {
    if (!isLoading && isWelcome === "false" && typeof window !== "undefined") {
      setTimeout(() => {
        setIsWelcome("true");
        localStorage.setItem("showedWelcome", "true");
      }, 3000);
    }
  }, [isLoading, isWelcome]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-hidden flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden flex">
      {isWelcome === "false" && <WelcomePopup user={user} />}
      <UserSidebar onLogout={handleLogout} />
      <main className="flex-1 max-h-svh overflow-auto">{children}</main>
    </div>
  );
}

//@ts-ignore
function WelcomePopup({ user }) {
  return (
    <div className="absolute inset-0 bg-[#F97316] text-white z-50 flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full rounded-3xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl  font-light tracking-wide">
            <span className="font-bold"> Hello {user?.full_name}</span>
          </h2>
          <h1 className="text-2xl  font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100">
            Welcome to Free Education in Italy Course Finder
          </h1>
        </div>
      </div>
    </div>
  );
}
