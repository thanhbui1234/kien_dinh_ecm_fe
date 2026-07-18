'use client';

import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface ProductViewTrackerProps {
  productId: string;
}

export default function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Prevent double firing in React 18 Strict Mode
    if (hasTriggered.current) return;

    const STORAGE_KEY = `viewed_prod_${productId}`;
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const now = Date.now();

    const lastViewed = localStorage.getItem(STORAGE_KEY);

    if (lastViewed) {
      const lastViewedTime = parseInt(lastViewed, 10);
      if (now - lastViewedTime < TWELVE_HOURS_MS) {
        return;
      }
    }

    const triggerViewCount = async () => {
      try {
        hasTriggered.current = true;
        // Sử dụng API SDK có sẵn của dự án
        await api.products.incrementViewCount(productId);
        localStorage.setItem(STORAGE_KEY, now.toString());
      } catch (error) {
        // Gỡ cờ để lần mount sau (nếu user thử lại) có thể chạy lại
        hasTriggered.current = false;
        console.error('Đã xảy ra lỗi khi cập nhật view count:', error);
      }
    };

    triggerViewCount();
  }, [productId]);

  return null;
}
