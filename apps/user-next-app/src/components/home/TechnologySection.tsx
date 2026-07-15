import Link from 'next/link';
import Image from 'next/image';

export default function TechnologySection() {
  return (
    <>
      <style>{`
        .tech-link:hover { color: #ff5901 !important; }
        .tech-link:hover svg { color: #ff5901 !important; }
        @media (max-width: 768px) {
          .tech-content-col { padding: 60px 32px !important; max-width: 100% !important; }
        }
      `}</style>
      <section
        style={{
          position: 'relative',
          minHeight: '520px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {/* Full-width background image */}
        <Image
          src="/images/technology/bg-technology.jpg"
          alt="Mazak Technology"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center right' }}
          sizes="100vw"
        />

        {/* Gradient overlay — darker on left for text readability, fades out on right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.70) 40%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        {/* Text content — left side */}
        <div
          className="tech-content-col"
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 60px 80px 80px',
            maxWidth: '640px',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.55)',
              margin: '0 0 12px 0',
            }}
          >
            Công nghệ của Mazak tiếp tục thay đổi thế giới
          </p>

          <h2
            style={{
              fontSize: '36px',
              fontWeight: 400,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: '0 0 16px 0',
            }}
          >
            Công nghệ &amp; Giải pháp
          </h2>

          <div
            style={{
              width: '40px',
              height: '3px',
              backgroundColor: '#ff5901',
              marginBottom: '24px',
            }}
          />

          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.8,
              margin: '0 0 32px 0',
              maxWidth: '480px',
            }}
          >
            Đổi mới hoạt động sản xuất bằng máy công cụ. Điều này được hỗ trợ bởi công nghệ tiên tiến
            của Mazak. Máy công cụ của Mazak tiếp tục phát triển nhờ nhiều công nghệ như tích hợp quy
            trình bằng Máy đa chức năng 5 trục, gia công bánh răng, gia công mài và tia laser. Mazak cung
            cấp các sản phẩm và giải pháp có thể hỗ trợ nhiều quy trình gia công chi tiết.
          </p>

          <Link
            href="/technology/"
            className="tech-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1.5px solid currentColor',
                flexShrink: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Công nghệ &amp; Giải pháp
          </Link>
        </div>

        {/* Spacer to push image to right */}
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }} />
      </section>
    </>
  );
}
