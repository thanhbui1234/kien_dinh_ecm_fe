'use client';

import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';

interface LightboxModalProps {
  open: boolean;
  close: () => void;
  slides: any[];
  index: number;
  onView: (index: number) => void;
  videoTitle?: string;
}

export default function LightboxModal({ open, close, slides, index, onView, videoTitle }: LightboxModalProps) {
  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides}
      index={index}
      plugins={[Thumbnails, Zoom, Counter]}
      on={{ view: ({ index: newIndex }) => onView(newIndex) }}
      thumbnails={{
        position: 'bottom',
        width: 72,
        height: 52,
        border: 2,
        borderRadius: 8,
        padding: 2,
        gap: 6,
        showToggle: true,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 2,
      }}
      counter={{
        container: { style: { top: 12, left: 16 } },
      }}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(10px)' },
      }}
      render={{
        slide: ({ slide }: any) => {
          if (slide.youtubeId === undefined) return undefined;
          return slide.youtubeId ? (
            <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 md:p-10">
              <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${slide.youtubeId}?autoplay=0&controls=1&rel=0&enablejsapi=1`}
                  title={videoTitle || 'Video'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 md:p-10">
              <video src={slide.directUrl} controls className="max-w-4xl w-full max-h-full rounded-xl shadow-2xl" />
            </div>
          );
        },
      }}
    />
  );
}
