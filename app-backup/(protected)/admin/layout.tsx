'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { useAuth } from '@/hooks/auth-modules';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const {logout} = useAuth()

  useEffect(() => {
    // Check authentication
    // const isAdmin = localStorage.getItem('isAdmin') === 'true';
    // if (!isAdmin) {
    //   router.push('/admin/login');
    //   return;
    // }
    // setIsAuthenticated(true);
    // setLoading(false);
  }, [router]);

  const handleLogout = () => {
    logout()
  };

  // if (loading || isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden flex">
      {isAuthenticated && <AdminSidebar onLogout={handleLogout} />}
      <main className="flex-1 max-h-svh overflow-auto">
        {children}
      </main>
    </div>
  );
}