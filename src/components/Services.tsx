import type { RefObject } from 'react';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';
import { SECTION3_IMG1, SECTION3_IMG2, SECTION3_BG } from '../constants';

export default function Section3() {
  const { containerRef: revealRef, getAnimStyle } = useStaggeredReveal(4);

  return (
    <section
      ref={revealRef as RefObject<HTMLElement>}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          {/* Heading Card */}
          <div
            className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
            style={getAnimStyle(0)}
          >
            <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">
              Implant<br />
              Dentistry
            </h2>
            <p className="text-xs md:text-sm font-semibold text-black">
              Restore Missing Teeth
            </p>
          </div>

          {/* Two Image Cards */}
          <div className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0" style={getAnimStyle(1)}>
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <img src={SECTION3_IMG1} alt="Dental implant procedure" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <img src={SECTION3_IMG2} alt="Dental restoration" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Consultation Card */}
          <div
            className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0"
            style={getAnimStyle(2)}
          >
            <div>
              <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
                Consultation
              </p>
              <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">
                Dental<br />
                Restoration<br />
                Services
              </h3>
            </div>
            <button className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform">
              Book Online
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Single tall image card */}
        <div
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0"
          style={getAnimStyle(3)}
        >
          <img src={SECTION3_BG} alt="Smiling patient" className="w-full h-full object-cover" />

          {/* Overlay container */}
          <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
            {/* Overlay Card 1 (white) */}
            <div className="flex-1 bg-white rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
              <h4 className="text-lg md:text-2xl font-bold text-black leading-5 md:leading-7">
                The Process<br />
                of Installing<br />
                Implants
              </h4>
              <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="rotate-[-45deg]">
                  <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            {/* Overlay Card 2 (glass) */}
            <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
              <h4 className="text-lg md:text-2xl font-bold text-white leading-5 md:leading-7">
                Caring<br />
                for Dental<br />
                Implants
              </h4>
              <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="rotate-[-45deg] text-white">
                  <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
