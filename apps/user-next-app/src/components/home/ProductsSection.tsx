"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { SectionHeading } from "shared-ui";
import { Button } from "shared-ui";
import { Product } from "shared-api";
import { getStoredLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/dictionary";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface ProductsSectionProps {
  products?: Product[];
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE_EXPO } },
};

export default function ProductsSection({ products = [] }: ProductsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const [dict, setDict] = useState(() => getDictionary('vi'));
  useEffect(() => {
    setDict(getDictionary(getStoredLocale()));
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">
        <m.div
          className="mb-12"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
        >
          <SectionHeading>{dict.common.featured_products}</SectionHeading>
        </m.div>

        <m.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 mb-14 rounded-2xl"
          variants={container}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={isInView ? "visible" : "hidden"}
        >
          {products.map((product) => (
            <m.div key={product.id} variants={item}>
              <ProductCard product={product} dict={dict} />
            </m.div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-10 text-zinc-500">
              {dict.home.featured_products_loading}
            </div>
          )}
        </m.div>

        <div className="flex justify-center">
          <Button asChild className="rounded-full bg-[#111] hover:bg-[#333] px-14 py-3 text-sm font-medium h-auto">
            <Link href="/products/">{dict.home.all_products}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  dict,
}: {
  product: Product;
  dict: ReturnType<typeof getDictionary>;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden no-underline rounded-2xl bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.16)]"
    >
      <div className="relative w-full h-[210px] mb-5">
        <div className="absolute inset-0 scale-75 rounded-full bg-[#5e8dd1] opacity-[0.07] blur-3xl" />
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="relative object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="line-clamp-2 text-[15px] font-medium leading-[1.4] text-[#111] transition-colors duration-200 ease-in-out group-hover:text-[#5e8dd1]">
          {product.name}
        </span>
        <span className="text-[13px] text-zinc-500">
          {product.price ? currencyFormatter.format(product.price) : dict.home.price_on_request}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wide text-[#111] transition-colors duration-200 ease-in-out group-hover:text-[#5e8dd1]">
          {dict.home.view_product_detail}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
