import Image from 'next/image';
import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageContent, PageTitle } from 'shared-ui';

interface HistoryEvent {
  year: string;
  text: string;
}

interface HistoryPeriod {
  period: string;
  events: HistoryEvent[];
  images: string[];
}

const historyPeriods: HistoryPeriod[] = [
  {
    period: '1919 - 1950',
    events: [
      { year: '1919', text: 'Yamazaki Sadakichi thành lập Công ty Yamazaki tại Nagoya và bắt đầu sản xuất máy dệt chiếu cói.' },
      { year: '1923', text: 'Thành lập nhà máy mới tại Atsuta, Nagoya.' },
      { year: '1927', text: 'Bắt đầu sản xuất máy công cụ bao gồm Máy tiện và Máy phay.' },
      { year: '1928', text: 'Phát triển máy công cụ thương mại đầu tiên.' },
      { year: '1934', text: 'Phát triển máy tiện lăn đầu tiên.' },
    ],
    images: ['/images/history/chairman-assembly.png', '/images/history/first-lathe.png'],
  },
  {
    period: '1951 - 1970',
    events: [
      { year: '1959', text: 'Bắt đầu sản xuất máy tiện tốc độ cao, độ chính xác cao (dòng LA, LB, LC và LD).' },
      { year: '1961', text: 'Mở rộng ra thị trường nước ngoài. Xuất khẩu 3 dòng LD sang Indonesia. Nhà máy Oguchi bắt đầu hoạt động.' },
      { year: '1962', text: 'Xuất khẩu lần đầu tiên của năm.' },
    ],
    images: ['/images/history/mazak-early.png', '/images/history/mt1000.png'],
  },
  {
    period: '1971 - 1990',
    events: [
      { year: '1971', text: 'Phát triển máy tiện điều khiển thích ứng đầu tiên, MTC-1500R-AC, tại Nhật Bản.' },
      { year: '1974', text: 'Hoàn thành Yamazaki Machinery Corporation tại Greater Cincinnati, Mỹ.' },
      { year: '1975', text: 'Thành lập Yamazaki Machinery Europe NV tại Leuven, Bỉ.' },
    ],
    images: ['/images/history/btc5.png', '/images/history/p58-mc.png'],
  },
  {
    period: '1991 - 2000',
    events: [
      {
        year: '1991',
        text: 'Yamazaki Machinery UK nhận Giải thưởng Công ty tốt nhất thế giới trong lĩnh vực máy công cụ từ Viện Hàn lâm Khoa học Hoàng gia Thụy Điển.',
      },
      { year: '1992', text: '"Queen\'s Award for Export Achievement" được trao cho Yamazaki Mazak Vương quốc Anh Ltd.' },
    ],
    images: ['/images/history/yms30.png', '/images/history/mazatrol-t1.jpg'],
  },
  {
    period: '2001 - 2010',
    events: [
      { year: '2001', text: 'Thành lập Yamazaki Mazak Taiwan Corp. Teruyuki Yamazaki được bổ nhiệm làm Chủ tịch kiêm Tổng giám đốc điều hành.' },
      { year: '2009', text: 'Mazak iSMART Factory™ - Nhà máy thông minh được đưa vào vận hành tại Nhật Bản.' },
    ],
    images: ['/images/history/quickturn10.jpg'],
  },
  {
    period: '2011 - 2020',
    events: [
      { year: '2014', text: 'Khai trương Trung tâm Công nghệ Việt Nam tại TP. Hồ Chí Minh.' },
      { year: '2016', text: 'Thành lập CÔNG TY TNHH YAMAZAKI MAZAK VIỆT NAM.' },
      { year: '2018', text: 'Kỷ niệm 100 năm thành lập Yamazaki Mazak Corporation.' },
    ],
    images: [],
  },
  {
    period: '2021 - Hiện tại',
    events: [
      { year: '2021', text: 'Ra mắt dòng máy INTEGREX i NEO series mới nhất.' },
      { year: '2024', text: 'Mở rộng hệ thống hỗ trợ và dịch vụ khách hàng tại Việt Nam.' },
    ],
    images: [],
  },
];

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Trang giới thiệu', href: '/about-us/' },
  { label: 'Lịch sử công ty' },
];

export default function CompanyHistoryPage() {
  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <PageContent>
        <PageTitle>Lịch sử công ty</PageTitle>

        <div>
          {historyPeriods.map((period) => (
            <div key={period.period} style={{ marginBottom: '8px' }}>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 400,
                  background: '#f5f5f5',
                  padding: '16px 20px',
                  borderLeft: '4px solid #ff5901',
                  margin: 0,
                  color: '#000',
                }}
              >
                {period.period}
              </h3>

              <div style={{ padding: '24px 0 24px 24px' }}>
                {period.events.map((event, idx) => (
                  <div
                    key={`${event.year}-${idx}`}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '8px 0',
                      borderBottom: '1px dotted #ddd',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#ff5901',
                        width: '60px',
                        flexShrink: 0,
                        paddingTop: '2px',
                      }}
                    >
                      {event.year}
                    </span>
                    <span style={{ fontSize: '14px', color: '#333', lineHeight: 1.7 }}>
                      {event.text}
                    </span>
                  </div>
                ))}

                {period.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {period.images.map((src) => (
                      <Image
                        key={src}
                        src={src}
                        alt={`Ảnh lịch sử ${period.period}`}
                        width={235}
                        height={160}
                        style={{ width: '235px', height: '160px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageContent>
    </PageWrapper>
  );
}
