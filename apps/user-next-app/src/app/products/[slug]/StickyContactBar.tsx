'use client';

import StickyContactBar from '@/components/ui/StickyContactBar';
import { useTranslations } from 'next-intl';

interface Props {
  productId: string;
  productName: string;
  hasPrice: boolean;
  bottomSectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyContactBar_Product({
  productId,
  productName,
  hasPrice,
  bottomSectionRef,
}: Props) {
  const t = useTranslations();
  const ctaLabel = hasPrice ? t('common.contact_consult') : t('common.get_quote');

  return (
    <StickyContactBar
      entityLabel={t('products.breadcrumb_products')}
      entityName={productName}
      ctaLabel={ctaLabel}
      ctaHref={`/contact/?productId=${productId}`}
      bottomSectionRef={bottomSectionRef}
    />
  );
}
