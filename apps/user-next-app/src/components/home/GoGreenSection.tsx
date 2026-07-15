import Link from 'next/link';
import Image from 'next/image';

const MazakWordmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="21"
    viewBox="0 0 148 39.58"
    aria-label="Mazak"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <g transform="translate(0 0)">
      <path d="M32.487,14.224,41.6,0h9.265V39.58H43.5V10.887L38.51,18.135a3.591,3.591,0,0,1-6.024-3.911" transform="translate(-11.28)" fill="#ff5901" />
      <path d="M71.174,43.892h8.782l-.022-6.558H72.6V29.616h9.783V43.892h7.54V19.333c0-3.491-1.805-6.7-5.833-6.7H66.2l-.02,6.719h16.2v3.87H70.992c-3.046,0-5.755,3.207-5.755,4.992V38.761c0,2.783,3.591,5.131,5.937,5.131" transform="translate(-23.061 -4.466)" fill="#ff5901" />
      <path d="M114.45,37.461l14.229-17.173c2.476-2.78,1.936-7.655-3.694-7.655H105.912v6.729h14.437l-13.41,16.059h0c-3.369,3.982-.54,8.452,3.268,8.452h18.945l-.01-6.426Z" transform="translate(-37.27 -4.466)" fill="#ff5901" />
      <path d="M213.936,39.58,201.274,22.662,212.006,8.168h-8.723l-9.045,12.207V0H186.53v39.57h7.708V25.47L204.8,39.58Z" transform="translate(-65.936)" fill="#ff5901" />
      <path d="M28.646,31.057a3.593,3.593,0,0,0-3.591,3.591v15.91h7.183V34.648a3.593,3.593,0,0,0-3.591-3.591" transform="translate(-8.857 -10.979)" fill="#ff5901" />
      <path d="M18.373,14.224,9.266,0H0V39.58H7.357V10.887l4.992,7.247a3.591,3.591,0,0,0,6.024-3.911" fill="#ff5901" />
      <path d="M150.307,43.892h8.784l-.021-6.558h-7.339V29.616h9.781V43.892h7.539V19.333c0-3.491-1.8-6.7-5.833-6.7H145.336l-.023,6.719h16.2v3.87H150.1c-3.046,0-5.753,3.207-5.753,4.992V38.761c0,2.783,3.589,5.131,5.935,5.131" transform="translate(-51.034 -4.466)" fill="#ff5901" />
    </g>
  </svg>
);

export default function GoGreenSection() {
  return (
    <>
      <style>{`
        .gogreen-btn:hover { background-color: rgba(255,255,255,0.25) !important; }
      `}</style>
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '520px',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <Image
          src="/images/technology/go-green-bg.jpg"
          alt="Mazak Go Green"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 80px',
            zIndex: 1,
          }}
        >
          {/* Mazak + Go GREEN heading */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <MazakWordmark />
            <span
              style={{
                fontSize: '44px',
                fontWeight: 700,
                color: '#3bb54a',
                lineHeight: 1,
              }}
            >
              Go GREEN
            </span>
          </div>

          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8,
              maxWidth: '520px',
              marginBottom: '32px',
            }}
          >
            Yamazaki Mazak sẽ nỗ lực giải quyết các vấn đề môi trường quan trọng đang được đặt ra trong
            bối cảnh toàn cầu. Chúng tôi sẽ đóng góp vào một xã hội bền vững bằng cách cân bằng giữa
            sản xuất thân thiện với con người và sản xuất thân thiện với môi trường.
          </p>

          <div>
            <Link
              href="/about-us/environment/"
              className="gogreen-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.5)',
                padding: '10px 28px',
                borderRadius: '40px',
                transition: 'background-color 0.2s ease',
              }}
            >
              Đọc thêm
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
