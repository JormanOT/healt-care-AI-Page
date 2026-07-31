import type { ReactNode } from 'react';
import type { MaskPosition } from '../hooks/useMaskPositions';

interface MaskedCardProps {
  bgImage: string;
  position: MaskPosition;
  imageWidth: number;
  focalX: number;
  className?: string;
  children?: ReactNode;
  cardRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

export default function MaskedCard({ bgImage, position, imageWidth, focalX, className = '', children, cardRef, style }: MaskedCardProps) {
  const overflow = imageWidth > position.sw ? imageWidth - position.sw : 0;
  const focalOffset = overflow * focalX;

  const bgStyle: React.CSSProperties = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: `auto ${position.sh}px`,
    backgroundPosition: `${-(position.x + focalOffset)}px ${-position.y}px`,
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div ref={cardRef} className={className} style={{ ...bgStyle, ...style }}>
      {children}
    </div>
  );
}
