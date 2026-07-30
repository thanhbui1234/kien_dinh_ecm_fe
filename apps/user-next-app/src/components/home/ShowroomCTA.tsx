import Link from 'next/link';
import { Store } from 'lucide-react';

export default function ShowroomCTA() {
  return (
    <>
      <style>{`
        .showroom-link:hover { opacity: 0.85 !important; }
      `}</style>
      <section
        style={{
          backgroundColor: '#5E8DD1',
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
        href="/about-us"
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
        <Store size={64} strokeWidth={1.5} color="#fff" aria-hidden="true" />

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
