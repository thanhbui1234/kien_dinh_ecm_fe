'use client';

import StickyContactBar from '@/components/ui/StickyContactBar';

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
  const ctaLabel = hasPrice ? 'Liên hệ tư vấn' : 'Báo giá ngay';

  return (
    <StickyContactBar
      entityLabel="Sản phẩm"
      entityName={productName}
      ctaLabel={ctaLabel}
      ctaHref={`/contact/?productId=${productId}`}
      bottomSectionRef={bottomSectionRef}
    />
  );
}
