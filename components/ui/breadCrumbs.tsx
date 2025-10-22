'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Route label mapping for better readability
  const routeLabels: Record<string, string> = {
    admin: 'Dashboard',
    programs: 'Programs',
    upload: 'Bulk Upload',
    new: 'Add Program',
    edit: 'Edit Program',
    users: 'Users',
    enquiries: 'Enquiries',
    settings: 'Settings'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Split pathname and filter empty strings
    const segments = pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Get label from mapping or format the segment
      const label = routeLabels[segment] || 
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on the root admin page
  if (pathname === '/admin') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {/* Home/Dashboard link */}
      {/* <Link 
        href="/admin"
        className="flex items-center hover:text-gray-900 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link> */}

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0; 
        
        return (
          <div key={crumb.href} className="flex items-center space-x-2">
            {!isFirst && <ChevronRight className="h-4 w-4 text-gray-400" />}
            
            {isLast ? (
              <span className="font-medium text-gray-900">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-gray-900 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}