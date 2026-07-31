import { useState, useEffect, useRef, useCallback, type ReactNode, type RefObject } from 'react';

/* ──────────── IMAGE URLS ──────────── */

const HERO_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_113640_ccf3cf97-d447-425b-a134-d7b09fc743fc.png&w=1280&q=85';

const SECTION2_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114219_414dfe80-f15c-4e25-bf52-b13721f4bd88.png&w=1280&q=85';

const SECTION3_IMG1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85';

const SECTION3_IMG2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115237_fc519057-6e87-4abf-999a-9610b8b085b4.png&w=1280&q=85';

const SECTION3_BG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85';

/* ──────────── DATA CONSTANTS ──────────── */

const featureBars = ['Advanced Dentistry', 'High Quality Equipment', 'Friendly Staff'];

const services = [
  { name: 'Dental\nVeneers', num: '01', active: true },
  { name: 'Dental\nCrowns', num: '02', active: false },
  { name: 'Teeth\nWhitening', num: '03', active: false },
  { name: 'Dental\nImplants', num: null, active: false },
];

/* ──────────── HOOKS ──────────── */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

function useMaskPositions(
  sectionRef: RefObject<HTMLElement | null>,
  cardRefs: RefObject<(HTMLElement | null)[]>,
  cardCount: number
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const sectionScrollTop = window.scrollY + sectionRect.top;
    const sectionScrollLeft = window.scrollX + sectionRect.left;

    const newPositions: MaskPosition[] = [];
    for (let i = 0; i < cardCount; i++) {
      const card = cards?.[i];
      if (!card) {
        newPositions.push({ x: 0, y: 0, sw: sectionRect.width, sh: sectionRect.height });
        continue;
      }
      const cardRect = card.getBoundingClientRect();
      newPositions.push({
        x: window.scrollX + cardRect.left - sectionScrollLeft,
        y: window.scrollY + cardRect.top - sectionScrollTop,
        sw: sectionRect.width,
        sh: sectionRect.height,
      });
    }
    setPositions(newPositions);
  }, [sectionRef, cardRefs, cardCount]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(section);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [sectionRef, measure]);

  return positions;
}

function useImageWidth(src: string, sectionHeight: number) {
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

function useStaggeredReveal(count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, count]);

  const getAnimStyle = useCallback(
    (index: number) => ({
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
    }),
    [visible]
  );

  return { containerRef, getAnimStyle };
}

/* ──────────── MaskedCard COMPONENT ──────────── */

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

function MaskedCard({ bgImage, position, imageWidth, focalX, className = '', children, cardRef, style }: MaskedCardProps) {
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

/* ──────────── SPLASH SCREEN ──────────── */

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000;
    const steps = 100;
    const stepTime = duration / steps;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const step = Math.min(Math.floor(elapsed / stepTime), steps);
      setCount(step);

      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => setExiting(true), 200);
        setTimeout(() => onComplete(), 900);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-opacity duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none text-black">
        {count}
      </span>
    </div>
  );
}

/* ──────────── NAVBAR ──────────── */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = ['Home', 'Services', 'About', 'Gallery', 'Contact'];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md">
        <div className="flex flex-col">
          <div className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none">
            Dental
          </div>
          <div className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2">
            Health
          </div>
          <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2">
            quality healthcare
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <button className="px-6 py-3 bg-white rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-200">
            Menu
          </button>
          <span className="text-sm font-semibold text-black">Dental Emergency</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center relative"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-none ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col justify-center h-full px-8 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link}
                href="#"
                className={`text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  mobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: mobileOpen ? `${100 + i * 60}ms` : '0ms' }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                }}
              >
                {link}
              </a>
            ))}
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 px-8 py-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              mobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: mobileOpen ? '450ms' : '0ms' }}
          >
            <p className="text-sm font-semibold text-black mb-4">Dental Emergency</p>
            <button className="w-full px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────────── SECTION 1 - HERO ──────────── */

function Section1() {
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

        {/* Bottom-right text */}
        <div className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10">
          Free Consultation
        </div>
      </MaskedCard>
    </section>
  );
}

/* ──────────── SECTION 2 - SMILE GALLERY ──────────── */

function Section2() {
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
      ref={(el) => {
        sectionRef.current = el;
        revealRef.current = el;
      }}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
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

/* ──────────── SECTION 3 - IMPLANT DENTISTRY ──────────── */

function Section3() {
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

/* ──────────── APP ──────────── */

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <div className="bg-white">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Navbar />
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  );
}
