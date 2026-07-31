import { useState, useEffect, useRef, useCallback } from 'react';
import MaskedCard from './MaskedCard';
import { useIsMobile } from '../hooks/useIsMobile';
import { useMaskPositions } from '../hooks/useMaskPositions';
import { useImageWidth } from '../hooks/useImageWidth';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';
import { SECTION2_IMAGE, services } from '../constants';

export default function Section2() {
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

  const imageWidth = useImageWidth(SECTION2_IMAGE, secH);
  const { containerRef: revealRef, getAnimStyle } = useStaggeredReveal(4);

  const setCardRef = useCallback((idx: number) => (el: HTMLElement | null) => {
    cardRefs.current[idx] = el;
  }, []);

  const focalX = isMobile ? 0.65 : 0.8;

  return (
    <section
      id="about"
      ref={(el) => {
        sectionRef.current = el;
        revealRef.current = el;
      }}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2 scroll-mt-16"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
        {/* Card 0 - Top Left */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[0] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={setCardRef(0)}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          style={getAnimStyle(0)}
        >
          <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10">
            Smile Gallery
          </h2>
          <p className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">
            Our cosmetic dental work
          </p>
        </MaskedCard>

        {/* Card 1 - Top Right (spans 2 rows on desktop) */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[1] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={setCardRef(1)}
          className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          style={getAnimStyle(1)}
        >
          <div className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
            If you want a gorgeous smile,<br />
            call us to ask about a smile makeover.
          </div>
          <button className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold z-10 hover:scale-105 transition-transform">
            Call Us
          </button>
        </MaskedCard>

        {/* Card 2 - Bottom Left ("Smile makeover") */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[2] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={setCardRef(2)}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          style={getAnimStyle(2)}
        >
          <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10">
            Smile<br />
            makeover
          </h2>
        </MaskedCard>

        {/* Card 3 - Bottom Full Width (Services) */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[3] || { x: 0, y: 0, sw: 1, sh: 1 }}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={setCardRef(3)}
          className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          style={getAnimStyle(3)}
        >
          <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between ${
                  svc.active ? 'bg-white/90 backdrop-blur-md' : 'bg-white/20 backdrop-blur-xl'
                }`}
              >
                <h3 className={`text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line ${svc.active ? 'text-black' : 'text-white'}`}>
                  {svc.name}
                </h3>
                {svc.num && (
                  <span
                    className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold ${
                      svc.active ? 'border-black text-black' : 'border-white text-white'
                    }`}
                  >
                    {svc.num}
                  </span>
                )}
              </div>
            ))}
          </div>
        </MaskedCard>
      </div>
    </section>
  );
}
