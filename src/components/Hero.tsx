import { useState, useEffect, useRef, useCallback } from 'react';
import MaskedCard from './MaskedCard';
import { useIsMobile } from '../hooks/useIsMobile';
import { useMaskPositions } from '../hooks/useMaskPositions';
import { useImageWidth } from '../hooks/useImageWidth';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';
import { HERO_IMAGE, featureBars } from '../constants';

export default function Section1() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const isMobile = useIsMobile();
  const positions = useMaskPositions(sectionRef, cardRefs, 4);

  const [secH, setSecH] = useState(0);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => setSecH(entry.contentRect.height));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const imageWidth = useImageWidth(HERO_IMAGE, secH);
  const { containerRef: revealRef, getAnimStyle } = useStaggeredReveal(4);

  const setCardRef = useCallback((idx: number) => (el: HTMLElement | null) => {
    cardRefs.current[idx] = el;
  }, []);

  const focalX = isMobile ? 0.7 : 0.8;

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        revealRef.current = el;
      }}
      className="h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      {/* 3 Feature Bars */}
      {featureBars.map((label, i) => (
        <MaskedCard
          key={label}
          bgImage={HERO_IMAGE}
          position={positions[i] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={setCardRef(i)}
          className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative"
          style={getAnimStyle(i)}
        >
          <span className="flex items-center justify-center h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
            {label}
          </span>
        </MaskedCard>
      ))}

      {/* Main Hero Card */}
      <MaskedCard
        bgImage={HERO_IMAGE}
        position={positions[3] || { x: 0, y: 0, sw: 1, sh: 1 }}
        imageWidth={imageWidth}
        focalX={focalX}
        cardRef={setCardRef(3)}
        className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
        style={getAnimStyle(3)}
      >
        {/* Top-left text */}
        <div className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
          We wish to provide professional dental services<br />
          that match the current technologies
        </div>

        {/* Bottom-left block */}
        <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
          <span className="block text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">
            Trusted Dentist in West New York
          </span>
          <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">
            Dental<br />
            Care
          </h1>
        </div>

        {/* Right side CTA button */}
        <div className="absolute top-0 bottom-0 right-4 md:right-8 flex items-center z-10">
          <button className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform">
            Free Consultation
          </button>
        </div>
      </MaskedCard>
    </section>
  );
}
