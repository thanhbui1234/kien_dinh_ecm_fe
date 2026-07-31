'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function RouteHistoryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPathRef = useRef<string | null>(null);

  useEffect(() => {
    const search = searchParams?.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;

    if (currentPathRef.current && currentPathRef.current !== fullPath) {
      sessionStorage.setItem('app_prev_path', currentPathRef.current);
    }
    currentPathRef.current = fullPath;
  }, [pathname, searchParams]);

  return null;
}
