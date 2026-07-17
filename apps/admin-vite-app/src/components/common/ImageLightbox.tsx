import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ImageLightboxProps {
  open: boolean;
  index: number;
  slides: { src: string }[];
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export function ImageLightbox({ open, index, slides, onClose, onIndexChange }: ImageLightboxProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={slides}
      index={index}
      on={{ view: onIndexChange ? ({ index: i }) => onIndexChange(i) : undefined }}
    />
  );
}
