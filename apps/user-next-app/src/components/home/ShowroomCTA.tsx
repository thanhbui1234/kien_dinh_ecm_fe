import Link from 'next/link';
import Image from 'next/image';

export default function ShowroomCTA() {
  return (
    <>
      <style>{`
        .showroom-link:hover { opacity: 0.85 !important; }
      `}</style>
      <section
        style={{
          backgroundColor: '#FF5901',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          cursor: 'pointer',
        }}
      >
      <Link
        href="/about-us/support-bases/"
        className="showroom-link"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textDecoration: 'none',
          color: '#fff',
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* Showroom icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            position: 'relative',
            filter: 'brightness(0) invert(1)',
          }}
        >
          <Image
            src="/images/showroom-icon.png"
            alt="Showroom"
            fill
            style={{ objectFit: 'contain' }}
            sizes="64px"
          />
        </div>

        <p
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#fff',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Ghé thăm showroom của chúng tôi
        </p>
      </Link>
    </section>
    </>
  );
}
