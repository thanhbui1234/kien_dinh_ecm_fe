import Link from 'next/link';
import ContactForm from './ContactForm';
import { api } from '@/lib/api';

export const metadata = {
  title: 'Liên hệ | Thanh Bằng',
  description: 'Liên hệ với Thanh Bằng để được tư vấn và báo giá sản phẩm, dịch vụ máy công cụ CNC.',
  alternates: { canonical: 'https://thanhbang.com/contact/' },
  openGraph: {
    title: 'Liên hệ | Thanh Bằng',
    description: 'Liên hệ với Thanh Bằng để được tư vấn và báo giá sản phẩm, dịch vụ máy công cụ CNC.',
    url: 'https://thanhbang.com/contact/',
    siteName: 'Thanh Bằng',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string; jobId?: string }>;
}) {
  const params = await searchParams;
  const productId = params.productId;
  const jobId = params.jobId;

  let productName = undefined;
  if (productId) {
    try {
      const product = await api.products.getProductDetail(productId);
      if (product) {
        productName = product.name;
      }
    } catch (e) {
      console.error('Failed to fetch product for contact page', e);
    }
  }

  let jobTitle = undefined;
  if (jobId) {
    try {
      const job = await api.jobs.getJobDetail(jobId);
      if (job) {
        jobTitle = job.title;
      }
    } catch (e) {
      console.error('Failed to fetch job for contact page', e);
    }
  }

  const defaultMessage = jobTitle
    ? `Xin chào, tôi muốn ứng tuyển vị trí: ${jobTitle}.`
    : undefined;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h1 className="text-[32px] md:text-[40px] font-light text-[#111] leading-tight m-0 mb-4">
                Liên hệ với<br />
                <span className="font-medium text-[#ff5901]">chúng tôi</span>
              </h1>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về sản phẩm và dịch vụ. Hãy để lại thông tin, đội ngũ tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
            </div>

            <div className="flex flex-col gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {/* Hotline */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#ff5901]/10 rounded-2xl flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5901" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="pt-1">
                  <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 m-0 mb-1">Hotline tư vấn</p>
                  <a href="tel:0374864110" className="text-[20px] font-semibold text-[#111] hover:text-[#ff5901] transition-colors no-underline">
                    0374 864 110
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100" />

              {/* Zalo */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0068FF]/10 rounded-2xl flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0068FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
                <div className="pt-1">
                  <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 m-0 mb-1">Chat Zalo</p>
                  <a href="https://zalo.me/0374864110" target="_blank" rel="noopener noreferrer" className="text-[16px] font-medium text-[#111] hover:text-[#0068FF] transition-colors no-underline">
                    Zalo: 0374 864 110
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100" />

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="pt-1">
                  <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 m-0 mb-1">Email</p>
                  <a href="mailto:info@kiendinhecm.com" className="text-[16px] font-medium text-[#111] hover:text-[#ff5901] transition-colors no-underline">
                    info@kiendinhecm.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-[24px] font-semibold text-[#111] mb-8">
                Gửi yêu cầu báo giá / Tư vấn
              </h2>
              <ContactForm productId={productId} productName={productName} jobId={jobId} jobTitle={jobTitle} defaultMessage={defaultMessage} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
