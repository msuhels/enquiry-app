"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Mail, LogOut } from "lucide-react";

export default function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Programs", icon: BookOpen, href: "/admin/programs" },
    { name: "B2B Partner", icon: Users, href: "/admin/b2b" },
    { name: "Enquiries", icon: Mail, href: "/admin/enquiries" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#F97316] text-white flex flex-col justify-between">
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-white/20">
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>

        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-[#3a3886] shadow-lg"
                    : "hover:bg-white/20"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-[#3a3886]" : "text-white"
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
          className="flex items-center gap-3 text-sm font-medium text-white hover:bg-[#F97316]/20 px-4 py-2 rounded-lg transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
