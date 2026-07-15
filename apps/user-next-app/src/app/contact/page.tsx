import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageContent, PageTitle } from 'shared-ui';
import { Card, CardContent } from 'shared-ui';

interface OfficeInfo {
  label: string;
  value: string;
  isPhone?: boolean;
}

interface Office {
  title: string;
  info: OfficeInfo[];
}

const offices: Office[] = [
  {
    title: 'CÔNG TY TNHH YAMAZAKI MAZAK VIỆT NAM',
    info: [
      {
        label: 'ĐỊA CHỈ',
        value: 'Số 5B/4B Đường Đại Lộ Bình Dương, Tổ 5B, Khu Phố Bình Đức 2, Phường Bình Hòa, Thành phố Hồ Chí Minh, Việt Nam',
      },
      { label: 'MST', value: '0312373825' },
      { label: 'GIỜ LÀM VIỆC', value: 'Từ thứ hai đến thứ sáu, 8h30 sáng – 5h30 chiều' },
      { label: 'ĐIỆN THOẠI', value: '(+84) 274 246 1639', isPhone: true },
    ],
  },
  {
    title: 'VĂN PHÒNG ĐẠI DIỆN TẠI HÀ NỘI',
    info: [
      {
        label: 'ĐỊA CHỈ',
        value: 'Số 19 ngõ 17 phố Nghĩa Đô, phường Nghĩa Đô, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam',
      },
      { label: 'GIỜ LÀM VIỆC', value: 'Từ thứ hai đến thứ sáu, 8h30 sáng – 5h30 chiều' },
      { label: 'ĐIỆN THOẠI', value: '(+84) 24 2223 2211', isPhone: true },
    ],
  },
];

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Liên hệ chúng tôi' },
];

export default function ContactPage() {
  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <PageContent>
        <PageTitle>Liên hệ chúng tôi</PageTitle>

        <div style={{ maxWidth: '800px', marginBottom: '48px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#333', marginBottom: '16px', marginTop: 0 }}>
            Trong những trường hợp cần thiết, kỹ sư của Công ty Mazak sẽ đến tận nhà máy của Quý Khách hàng để xem xét tình
            trạng máy. Đội ngũ kỹ sư chuyên môn của chúng tôi sẽ nhanh chóng xác định lịch sử của máy cũng như cập nhật những
            thông tin kỹ thuật mới nhất và báo cáo dịch vụ của máy.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#333', marginBottom: '16px', marginTop: 0 }}>
            Công ty Mazak Việt nam luôn cam kết với Quý khách hàng về sự hỗ trợ sau bán hàng nhanh chóng và hiệu quả. Quý
            Khách hàng sẽ luôn nhận được sự hỗ trợ từ chúng tôi chỉ qua một cuộc điện thoại đơn giản.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#333', margin: 0 }}>
            Trong giờ hành chính, xin vui lòng liên hệ qua số điện thoại:{' '}
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#ff5901' }}>(+84) 274 246 1639</span>
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#333', margin: 0 }}>
            Hỗ trợ dịch vụ Khu vực miền Trung và miền Nam
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#333', margin: 0 }}>
            (Tiếng Việt và Tiếng Anh)
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {offices.map((office) => (
            <Card key={office.title} style={{ background: '#fafafa', borderRadius: 0 }}>
              <CardContent style={{ padding: '32px' }}>
                <h2
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#000',
                    marginBottom: '16px',
                    marginTop: 0,
                    textTransform: 'uppercase',
                    lineHeight: 1.4,
                  }}
                >
                  {office.title}
                </h2>
                {office.info.map((item) => (
                  <div key={item.label} style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#ff5901',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: item.isPhone ? '16px' : '14px',
                        fontWeight: item.isPhone ? 600 : 400,
                        color: item.isPhone ? '#000' : '#333',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.isPhone ? (
                        <a
                          href={`tel:${item.value.replace(/\s/g, '')}`}
                          style={{ color: '#000', textDecoration: 'none', fontWeight: 600 }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContent>
    </PageWrapper>
  );
}
