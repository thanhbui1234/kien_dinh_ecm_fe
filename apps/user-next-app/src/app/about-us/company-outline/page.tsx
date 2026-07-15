import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageTitle } from 'shared-ui';

interface CompanyInfo {
  label: string;
  value: string;
}

const companyInfo: CompanyInfo[] = [
  { label: 'Trụ sở chính toàn cầu', value: 'Yamazaki Mazak Corporation' },
  { label: 'Trụ sở chính', value: '1-131 Takeda, Oguchi-cho, Niwa-gun, Aichi-Pref., Nhật Bản' },
  { label: 'Thành lập', value: '1919' },
  {
    label: 'Đại diện',
    value: 'Chủ tịch hội đồng quản trị / Tomohisa Yamazaki; Tổng giám đốc / Takashi Yamazaki',
  },
  { label: 'Nhân viên', value: '8.800 (toàn bộ các nhóm) tính đến tháng 12/2025' },
  {
    label: 'Sản phẩm',
    value:
      'Máy phức hợp đa chức năng, Máy đa chức năng, Trung tâm gia công 5 trục, Máy tiện CNC, Hệ thống CNC, Trung tâm gia công đứng, Trung tâm gia công ngang, Máy gia công laser, FMS (Hệ thống sản xuất linh hoạt), Hệ thống CAD/CAM, Phần mềm hỗ trợ sản xuất',
  },
];

interface RegionGroup {
  region: string;
  companies: string[];
}

const groupCompanies: RegionGroup[] = [
  {
    region: 'Nhật Bản',
    companies: ['Yamazaki Mazak Corporation', 'Yamazaki Mazak Manufacturing Corporation'],
  },
  {
    region: 'Châu Á',
    companies: [
      'Yamazaki Mazak China Co., Ltd.',
      'Yamazaki Mazak Singapore Pte. Ltd.',
      'Yamazaki Mazak India Pvt. Ltd.',
      'Yamazaki Mazak Korea Co., Ltd.',
      'Yamazaki Mazak Vietnam Co., Ltd.',
    ],
  },
  { region: 'Bắc Mỹ', companies: ['Mazak Corporation (USA)', 'Yamazaki Mazak Canada Inc.'] },
  { region: 'Trung và Nam Mỹ', companies: ['Mazak México S.A. de C.V.', 'Mazak do Brasil Ltda.'] },
  {
    region: 'Châu Âu',
    companies: [
      'Yamazaki Mazak Europe Ltd. (UK)',
      'Yamazaki Mazak Deutschland GmbH',
      'Yamazaki Mazak France S.A.S.',
      'Yamazaki Mazak Iberia S.A.U.',
    ],
  },
];

const sectionH2Style: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 400,
  margin: '48px 0 24px',
  borderBottom: '1px solid #e0e0e0',
  paddingBottom: '12px',
  color: '#000',
};

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Trang giới thiệu', href: '/about-us/' },
  { label: 'Sơ lược về công ty' },
];

export default function CompanyOutlinePage() {
  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <div className="page-content">
        <PageTitle>Sơ lược về công ty</PageTitle>

        <table className="info-table" aria-label="Thông tin công ty">
          <tbody>
            {companyInfo.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={sectionH2Style}>Các công ty thuộc tập đoàn</h2>

        {groupCompanies.map((group) => (
          <div key={group.region}>
            <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#ff5901', margin: '24px 0 8px' }}>
              {group.region}
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '24px', fontSize: '14px', color: '#333', lineHeight: 2, margin: 0 }}>
              {group.companies.map((company) => (
                <li key={company}>{company}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2 style={sectionH2Style}>Cơ sở sản xuất</h2>
        <p style={{ fontSize: '14px', color: '#333', lineHeight: 1.8, margin: 0 }}>
          Có 11 cơ sở sản xuất trên toàn thế giới (Nhật Bản: 5, Mỹ: 1, Anh: 1, Singapore: 1, Trung Quốc: 2, Ấn Độ: 1)
        </p>

        <h2 style={sectionH2Style}>Cơ sở hỗ trợ</h2>
        <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#333', margin: 0 }}>
          Có 85 cơ sở hỗ trợ trên toàn thế giới (Trung tâm công nghệ: 37, Trung tâm kỹ thuật: 48)
        </h3>
      </div>
    </PageWrapper>
  );
}
