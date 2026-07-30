import { useEffect, useRef, useState } from 'react';

// Returns a stable blob-preview URL for each pending File/Blob in `items`,
// without regenerating or leaking object URLs on every render.
// Note: pending items are typed as `File` but may actually be a plain Blob
// at runtime (browser-image-compression returns a Blob despite its .d.ts
// claiming Promise<File>), so we key the cache by identity via `typeof`
// rather than `instanceof File`.
export function useObjectUrlCache(items: (string | File)[]) {
  const cache = useRef(new Map<File, string>());
  // Populating `cache` (a ref) doesn't trigger a re-render on its own, so the
  // very first render after a new pending file appears would resolve to an
  // empty src with nothing to ever re-render it. Bump this to force one.
  const [, forceRender] = useState(0);

  useEffect(() => {
    const current = new Set(items.filter((i): i is File => typeof i !== 'string'));
    let changed = false;
    for (const [file, url] of cache.current) {
      if (!current.has(file)) {
        URL.revokeObjectURL(url);
        cache.current.delete(file);
        changed = true;
      }
    }
    for (const file of current) {
      if (!cache.current.has(file)) {
        cache.current.set(file, URL.createObjectURL(file));
        changed = true;
      }
    }
    if (changed) forceRender((n) => n + 1);
  }, [items]);

  return (item: string | File) => (typeof item === 'string' ? item : cache.current.get(item) || '');
}
