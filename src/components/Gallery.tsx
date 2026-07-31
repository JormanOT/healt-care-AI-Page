import type { RefObject } from 'react';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';
import { galleryImages } from '../constants';

export default function Gallery() {
  const { containerRef: revealRef, getAnimStyle } = useStaggeredReveal(6);

  return (
    <section
      ref={revealRef as RefObject<HTMLElement>}
      id="gallery"
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2 scroll-mt-16"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
        {/* Heading card */}
        <div
          className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between min-h-[140px] md:min-h-0"
          style={getAnimStyle(0)}
        >
          <h2 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] text-black">
            Gallery
          </h2>
          <p className="text-xs md:text-sm font-semibold text-black">
            Real results from our clinic
          </p>
        </div>

        {/* Image cards */}
        {galleryImages.map((img, i) => (
          <div
            key={img.src}
            className="group rounded-xl md:rounded-2xl overflow-hidden relative min-h-[180px] md:min-h-0"
            style={getAnimStyle(i + 1)}
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-white/90 backdrop-blur-md text-black text-xs md:text-sm font-semibold px-4 py-2 rounded-full">
              {img.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
