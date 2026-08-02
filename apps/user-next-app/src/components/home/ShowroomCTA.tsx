import Link from 'next/link';
import { Store } from 'lucide-react';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/dictionary';
import { type Locale, COOKIE_NAME } from '@/lib/locale';

export default async function ShowroomCTA() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get(COOKIE_NAME)?.value ?? 'vi') as Locale;
  const dict = getDictionary(locale);

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
          {dict.home.showroom_cta}
        </p>
      </Link>
    </section>
    </>
  );
}
