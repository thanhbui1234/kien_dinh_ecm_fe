'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from 'shared-api';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api';
import { cn } from 'shared-ui';

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string;
  categoryId: string;
}

interface Props {
  categories: Category[];
}

export default function SearchInput({ categories }: Props) {
  const t = useTranslations('products');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(searchParams.get('search') ?? '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // skip fetch on mount if value was pre-filled from URL — don't auto-open dropdown
  const skipInitialFetch = useRef(!!searchParams.get('search'));
  const debouncedValue = useDebounce(value, 300);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  // fetch suggestions when debounced value changes
  useEffect(() => {
    const q = debouncedValue.trim();
    if (!q) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // first render after URL-init: don't open dropdown, just keep the text
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setIsLoading(true);
    setActiveIndex(-1);

    api.products
      .getProducts({ search: q, limit: '6' })
      .then((res) => {
        setSuggestions((res?.items ?? []) as Suggestion[]);
        setIsOpen(true);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [debouncedValue]);

  // close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  function submitSearch(q: string) {
    if (!q.trim()) return;
    setIsOpen(false);
    const qs = new URLSearchParams();
    const category = searchParams.get('category');
    if (category) qs.set('category', category);
    qs.set('search', q.trim());
    startTransition(() => { router.push(`/products/?${qs.toString()}`); });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        router.push(`/products/${suggestions[activeIndex].slug}`);
        setIsOpen(false);
      } else {
        submitSearch(value);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  function handleClear() {
    setValue('');
    setSuggestions([]);
    setIsOpen(false);
    const qs = new URLSearchParams(searchParams.toString());
    qs.delete('search');
    qs.delete('page');
    startTransition(() => { router.push(`/products/${qs.toString() ? `?${qs.toString()}` : ''}`); });
    inputRef.current?.focus();
  }

  const showDropdown = isOpen && (isLoading || suggestions.length > 0 || (debouncedValue.trim() && !isLoading));

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <label htmlFor="product-search" className="sr-only">{t('search_label')}</label>

      <div className="relative flex items-center">
        {/* left icon */}
        <span className="pointer-events-none absolute left-4 text-gray-400" aria-hidden>
          {isLoading || isPending ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="animate-spin" stroke="#5e8dd1" strokeWidth="2">
              <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
              <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          )}
        </span>

        <input
          ref={inputRef}
          id="product-search"
          type="search"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder={t('search_placeholder')}
          aria-label={t('search_label')}
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          className={cn(
            'w-full h-11 pl-11 pr-20 rounded-xl border bg-white text-[14px] text-[#111]',
            'placeholder:text-gray-400 outline-none transition-all duration-200',
            'border-gray-200 hover:border-gray-300',
            'focus:border-[#5e8dd1] focus:ring-2 focus:ring-[#5e8dd1]/15',
            '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
            showDropdown && 'rounded-b-none border-b-transparent'
          )}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={t('search_clear')}
              className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => submitSearch(value)}
            disabled={!value.trim()}
            aria-label={t('search_submit_hint')}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#5e8dd1] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#4a7bc0] transition-all duration-150"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-[#5e8dd1]/30 border-t-gray-200 rounded-b-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {isLoading ? (
            <div className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin shrink-0" stroke="#5e8dd1" strokeWidth="2">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
              </svg>
              {t('search_loading')}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] text-gray-400 m-0">{t('search_no_results')}</p>
            </div>
          ) : (
            <ul role="listbox" className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
              {suggestions.map((item, i) => (
                <li key={item.id} role="option" aria-selected={i === activeIndex}>
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 no-underline transition-colors duration-100',
                      i === activeIndex ? 'bg-[#f0f5fb]' : 'hover:bg-gray-50'
                    )}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(-1)}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f8f8f8] overflow-hidden flex items-center justify-center">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-contain p-1 mix-blend-multiply"
                        />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                          <rect x="2" y="3" width="20" height="14" rx="2" />
                          <path d="M8 21h8M12 17v4" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-[#111] m-0 truncate">{item.name}</p>
                      {categoryMap[item.categoryId] && (
                        <p className="text-[11px] text-[#5e8dd1] m-0 truncate font-medium uppercase tracking-wide mt-0.5">
                          {categoryMap[item.categoryId]}
                        </p>
                      )}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-gray-300">
                      <path d="M2.33 7H11.67M11.67 7L7.58 3M11.67 7L7.58 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}

              {/* footer hint */}
              <li className="px-4 py-2 bg-gray-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => submitSearch(value)}
                  className="text-[12px] text-[#5e8dd1] hover:underline font-medium"
                >
                  {t('search_submit_hint')} &ldquo;{value}&rdquo;
                </button>
                <span className="text-[11px] text-gray-300 font-mono">↵</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
