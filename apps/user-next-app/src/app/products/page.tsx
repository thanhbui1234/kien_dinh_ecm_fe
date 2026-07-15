'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageWrapper, PageBreadcrumb } from 'shared-ui';
import { Badge } from 'shared-ui';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

const machineToolCategories: Category[] = [
  {
    id: 'integrex',
    name: 'Máy đa chức năng',
    subcategories: [
      'Kích thước đầu kẹp 6" đến 12"',
      'Kích thước đầu kẹp 10" đến 18", Trục phay số 40 và số 50 có thể lựa chọn',
      'Kích thước đầu kẹp 15" đến 32"',
      'Kích thước đầu kẹp Φ610 mm đến Φ2500 mm (dọc)',
      'Gia công bánh răng tích hợp với máy đa chức năng',
    ],
  },
  {
    id: 'five-axis',
    name: 'Trung tâm gia công 5 trục',
    subcategories: ['Loại bàn nghiêng', 'Kiểu trục chính', 'Chức năng cụ thể', 'Cột đôi (với trục W)'],
  },
  {
    id: 'cnc',
    name: 'Máy tiện CNC',
    subcategories: [
      'Máy tiện CNC',
      'Trung tâm tiện phẳng',
      'Máy tiện CNC với 2 trục chính đối xứng trái-phải',
      'Trung tâm gia công tiện CNC đứng',
    ],
  },
  { id: 'vertical', name: 'Trung tâm gia công đứng', subcategories: ['Loại đầu quay', 'Loại bàn quay'] },
  { id: 'horizontal', name: 'Trung tâm gia công ngang', subcategories: [] },
  { id: 'laser', name: 'Máy gia công laser', subcategories: ['Máy cắt laser phẳng', 'Máy cắt laser 3D'] },
];

const automationCategories: Category[] = [
  {
    id: 'automation-machine-tool',
    name: 'Tự động hóa máy công cụ',
    subcategories: ['Hệ thống gia công linh hoạt (FMS)', 'Robot tải/dỡ'],
  },
];

const industryCategories: Category[] = [
  {
    id: 'industry',
    name: 'Theo Ngành',
    subcategories: ['Hàng không vũ trụ', 'Ô tô', 'Y tế', 'Năng lượng', 'Điện tử'],
  },
];

const tabs = [
  { id: 'machine-tools', label: 'Máy công cụ / Máy gia công laser', categories: machineToolCategories },
  { id: 'automation', label: 'Hệ thống tự động hóa', categories: automationCategories },
  { id: 'industries', label: 'Ngành nghề', categories: industryCategories },
];

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Các sản phẩm' },
];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('machine-tools');
  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />

      <div style={{ maxWidth: '1266px', margin: '0 auto', padding: '0 20px 80px' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 400, padding: '40px 0 24px', margin: 0, color: '#000' }}>
          Sản phẩm
        </h1>

        <div
          style={{ borderBottom: '2px solid #e0e0e0', display: 'flex', gap: 0, overflowX: 'auto' }}
          className="scrollbar-hide"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 500 : 400,
                color: activeTab === tab.id ? '#ff5901' : '#555',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #ff5901' : '3px solid transparent',
                marginBottom: '-2px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = '#ff5901';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = '#555';
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTabData?.categories.map((category) => (
          <div key={category.id} id={category.id} style={{ padding: '40px 0', borderBottom: '1px solid #eee' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 400,
                marginBottom: '16px',
                marginTop: 0,
                borderLeft: '4px solid #ff5901',
                paddingLeft: '16px',
                color: '#000',
              }}
            >
              {category.name}
            </h2>

            {category.subcategories.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {category.subcategories.map((sub) => (
                  <Badge
                    key={sub}
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #ddd',
                      color: '#333',
                      borderRadius: '2px',
                      fontSize: '13px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, color 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = '#ff5901';
                      el.style.color = '#ff5901';
                      el.style.backgroundColor = '#fff8f5';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = '#ddd';
                      el.style.color = '#333';
                      el.style.backgroundColor = '#f5f5f5';
                    }}
                  >
                    {sub}
                  </Badge>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Vui lòng liên hệ để biết thêm thông tin.</p>
            )}
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
