"use client";

import { Category } from "shared-api";
import LayoutB from "./categories/LayoutB";

interface CategoriesSectionProps {
  categories?: Category[];
}

export default function CategoriesSection({ categories = [] }: CategoriesSectionProps) {
  return <LayoutB categories={categories} />;
}
