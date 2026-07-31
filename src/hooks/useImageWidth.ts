import { useState, useEffect } from 'react';

export function useImageWidth(src: string, sectionHeight: number) {
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    if (!src || sectionHeight <= 0) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const renderWidth = img.naturalWidth * (sectionHeight / img.naturalHeight);
      setImageWidth(renderWidth);
    };
  }, [src, sectionHeight]);

  return imageWidth;
}
