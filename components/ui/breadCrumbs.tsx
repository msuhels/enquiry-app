'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  disabledItemIndex?: number;
}

export default function Breadcrumbs({ disabledItemIndex }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Route label mapping for better readability
  const routeLabels: Record<string, string> = {
    admin: 'Dashboard',
    programs: 'Programs',
    users: 'Vendors',
    enquiries: 'Enquiries',
    settings: 'Settings',
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label =
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Hide breadcrumbs on root admin page
  if (pathname === '/admin') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-lg text-gray-600 mb-6">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isDisabled = index === disabledItemIndex;

        return (
          <div key={crumb.href} className="flex items-center space-x-2">
            {index !== 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}

            {isLast || isDisabled ? (
              <span
                className={`font-medium ${
                  isDisabled ? 'text-gray-400' : 'text-gray-900'
                }`}
              >
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