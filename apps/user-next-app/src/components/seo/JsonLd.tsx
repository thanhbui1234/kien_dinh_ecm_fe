import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: "Công Ty Cổ Phần Thanh Bằng",
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    telephone: "+84943676869",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Xuân Trường",
      addressRegion: "Nam Định",
      postalCode: "420000",
      addressCountry: "VN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [
      SITE_URL,
    ],
    description:
      "Công Ty Cổ Phần Thanh Bằng chuyên sản xuất máy móc, máy công cụ CNC, phụ tùng và dụng cụ cắt gọt chính hãng tại Việt Nam.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
