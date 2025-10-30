"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

export default function UserSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/b2b" },
    { name: "Enquiries", icon: Mail, href: "/b2b/enquiries" },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-indigo-500 to-purple-500 text-white flex flex-col justify-between">
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-white/20">
          <div className="h-10 w-10 bg-white/20 flex items-center justify-center rounded-lg font-bold text-lg">
            B
          </div>
          <h1 className="text-lg font-bold">B2B Panel</h1>
        </div>

        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-indigo-500 rounded-l-full"
                    : "hover:bg-white/20"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-indigo-500" : "text-white"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/20">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-sm font-medium text-white hover:bg-white/20 px-4 py-2 rounded-lg transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
