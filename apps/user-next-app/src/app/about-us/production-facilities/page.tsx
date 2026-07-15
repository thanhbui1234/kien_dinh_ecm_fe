import Image from 'next/image';
import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageContent, PageTitle } from 'shared-ui';
import { Card } from 'shared-ui';

interface Facility {
  name: string;
  address: string;
  phone: string;
  image: string | null;
}

interface Country {
  name: string;
  facilities: Facility[];
}

interface Region {
  region: string;
  countries: Country[];
}

const facilitiesByRegion: Region[] = [
  {
    region: 'Châu Á',
    countries: [
      {
        name: 'Nhật Bản',
        facilities: [
          {
            name: 'Yamazaki Mazak Corporation',
            address: '480-0197\n1-131 Takeda, Oguchi-cho, Niwa-gun, Aichi-Pref.',
            phone: '+(81)0587-95-1131',
            image: '/images/facilities/oguchi.jpg',
          },
          {
            name: 'Tập đoàn sản xuất Yamazaki Mazak (Minokamo 1)',
            address: '505-0005\n333 Yamazaki, Naka-Hachiya, Hachiya-cho, Minokamo City, Gifu-Pref.',
            phone: '+(81)0574-25-8311',
            image: '/images/facilities/wtg.jpg',
          },
          {
            name: 'Tập đoàn sản xuất Yamazaki Mazak (Minokamo 2)',
            address: '505-0009\n1-2 Yata, Hachiya-cho, Thành phố Minokamo, Gifu-Pref.',
            phone: '+(81)0574-24-1121',
            image: '/images/facilities/minokamo.jpg',
          },
          {
            name: 'Tập đoàn sản xuất Yamazaki Mazak (Inabe)',
            address: '511-0211\n1 Matsunashinden, Inabe-cho, Thành phố Inabe, Mie-Pref.',
            phone: '+(81)0594-84-1300',
            image: '/images/facilities/inabe.jpg',
          },
          {
            name: 'Tập đoàn sản xuất Yamazaki Mazak (Seiko)',
            address: '511-0854\n413 Rengeji, Thành phố Kuwana, Mie-Pref.',
            phone: '+(81)0594-22-3111',
            image: '/images/facilities/seiko.jpg',
          },
        ],
      },
      {
        name: 'Trung Quốc',
        facilities: [
          {
            name: 'Công ty Little Giant (Yinchuan)',
            address: 'No.65, Ning\'an Street, High-tech Industrial Park, Yinchuan, Ningxia, P.R.C. (ZIP:750002)',
            phone: '+(86)951-5672333',
            image: '/images/facilities/little-giant.jpg',
          },
          {
            name: 'Công ty Little Giant (Dalian)',
            address: 'No. 1, Tieshan East Road, Dalian Economic & Technology Development Zone, Liaoning Province, P.R.C. (ZIP:116600)',
            phone: '+(86)411-87963555',
            image: '/images/facilities/liaoning.jpg',
          },
        ],
      },
      {
        name: 'Singapore',
        facilities: [
          {
            name: 'Yamazaki Mazak Singapore Pte. Ltd.',
            address: '21 Joo Koon Circle, Singapore 629053',
            phone: '+(65)6862-1131',
            image: null,
          },
        ],
      },
      {
        name: 'Ấn Độ',
        facilities: [
          {
            name: 'Yamazaki Mazak India Pvt. Ltd.',
            address: 'Plot No. A-100 Midc, Ranjangaon Industrial Area, Village Karegaon, Taluka Shirur, Pune, Maharashtra, India',
            phone: '+(91)2138-695-555',
            image: null,
          },
        ],
      },
    ],
  },
  {
    region: 'Bắc Mỹ',
    countries: [
      {
        name: 'U.S.A.',
        facilities: [
          {
            name: 'Mazak Corporation',
            address: '8025 Production Drive, Florence, KY 41042',
            phone: '+(1)859-342-1700',
            image: null,
          },
        ],
      },
    ],
  },
  {
    region: 'Châu Âu',
    countries: [
      {
        name: 'U.K.',
        facilities: [
          {
            name: 'Yamazaki Mazak Europe Ltd. (Trụ sở châu Âu)',
            address: 'Badgeworth Drive, Worcester WR4 9NF, Vương Quốc Anh',
            phone: '+(44)1905-755755',
            image: null,
          },
        ],
      },
    ],
  },
];

const FacilityImagePlaceholder = () => (
  <div
    style={{
      width: '100%',
      height: '200px',
      background: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    aria-hidden="true"
  >
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  </div>
);

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Trang giới thiệu', href: '/about-us/' },
  { label: 'Cơ sở sản xuất' },
];

export default function ProductionFacilitiesPage() {
  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <PageContent>
        <PageTitle>Cơ sở sản xuất</PageTitle>

        {facilitiesByRegion.map((regionData) => (
          <div key={regionData.region}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 400,
                borderBottom: '2px solid #ff5901',
                paddingBottom: '8px',
                margin: '40px 0 24px',
                color: '#000',
              }}
            >
              {regionData.region}
            </h2>

            {regionData.countries.map((country) => (
              <div key={country.name}>
                <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#ff5901', margin: '24px 0 16px' }}>
                  {country.name}
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {country.facilities.map((facility) => (
                    <Card key={facility.name} style={{ borderRadius: 0, overflow: 'hidden' }}>
                      {facility.image ? (
                        <Image
                          src={facility.image}
                          alt={facility.name}
                          width={400}
                          height={200}
                          style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <FacilityImagePlaceholder />
                      )}
                      <div style={{ padding: '16px' }}>
                        <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', marginTop: 0, color: '#000', lineHeight: 1.4 }}>
                          {facility.name}
                        </p>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#666',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-line',
                            marginBottom: '8px',
                            marginTop: 0,
                          }}
                        >
                          {facility.address}
                        </p>
                        <a
                          href={`tel:${facility.phone.replace(/[\s()]/g, '')}`}
                          style={{ fontSize: '13px', color: '#ff5901', fontWeight: 500, textDecoration: 'none' }}
                        >
                          {facility.phone}
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </PageContent>
    </PageWrapper>
  );
}
