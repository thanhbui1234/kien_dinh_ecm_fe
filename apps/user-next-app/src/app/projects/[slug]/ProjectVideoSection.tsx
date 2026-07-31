'use client';

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

interface ProjectVideoSectionProps {
  videoUrls?: string[];
}

export default function ProjectVideoSection({ videoUrls }: ProjectVideoSectionProps) {
  if (!videoUrls || videoUrls.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-gray-100">
      {/* Section Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-bold text-[#5e8dd1] uppercase tracking-[0.22em] block mb-2">
          TRẢI NGHIỆM THỰC TẾ
        </span>
        <h2 className="text-[24px] md:text-[30px] font-light text-[#111] m-0">
          Video Thực Tế Dự Án
        </h2>
        <div className="mt-3 w-12 h-[3px] bg-[#5e8dd1] mx-auto rounded-full" />
      </div>

      {/* Hero Showcase Video Player Grid */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {videoUrls.map((url, idx) => {
          const youtubeId = getYoutubeId(url);
          return (
            <div
              key={idx}
              className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-gray-100/10 group"
            >
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&controls=1&rel=0&enablejsapi=1`}
                  title={`Video thực tế dự án ${idx + 1}`}
                  className="w-full h-full border-0 relative z-20"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video src={url} controls className="w-full h-full object-contain relative z-20" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
