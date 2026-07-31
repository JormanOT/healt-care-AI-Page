import type { RefObject } from 'react';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';
import { SECTION3_IMG1 } from '../constants';

const contactInfo = [
  { label: 'Phone', value: '(201) 555-0123' },
  { label: 'Email', value: 'hello@dentalhealth.com' },
  { label: 'Address', value: '4808 Bergenline Ave,\nWest New York, NJ' },
];

const inputClass =
  'w-full px-4 py-2.5 md:py-3 bg-white border border-neutral-200 rounded-xl text-sm md:text-base text-black placeholder-neutral-400 outline-none focus:ring-2 focus:ring-black/10 transition-all';

export default function Contact() {
  const { containerRef: revealRef, getAnimStyle } = useStaggeredReveal(3);

  return (
    <section
      ref={revealRef as RefObject<HTMLElement>}
      id="contact"
      className="min-h-[80vh] md:h-[80vh] w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2 scroll-mt-16"
    >
      <div className="flex-1 min-h-0 relative rounded-xl md:rounded-2xl overflow-hidden">
        <img src={SECTION3_IMG1} alt="" className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute inset-0 z-10 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2 p-1.5 md:p-2">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            {/* Heading card */}
            <div
              className="rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-md p-4 md:p-6 flex flex-col justify-between flex-[1.1] min-h-[150px] md:min-h-0"
              style={getAnimStyle(0)}
            >
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.9] text-black">
                Contact<br />
                Us
              </h2>
              <p className="text-xs md:text-sm font-semibold text-black">
                We're here to help your smile
              </p>
            </div>

            {/* Info card */}
            <div
              className="rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-xl p-4 md:p-6 flex-1 min-h-[200px] md:min-h-0 flex flex-col justify-center gap-3 md:gap-4"
              style={getAnimStyle(1)}
            >
              {contactInfo.map((info, i) => (
                <div key={info.label} className={i > 0 ? 'pt-3 md:pt-4 border-t border-white/20' : ''}>
                  <p className="text-xs md:text-sm font-semibold text-white/60 mb-0.5">
                    {info.label}
                  </p>
                  <p className="text-base md:text-lg font-bold text-white whitespace-pre-line leading-5 md:leading-6">
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Form */}
          <div
            className="rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-md p-4 md:p-6 min-h-[380px] md:min-h-0"
            style={getAnimStyle(2)}
          >
            <form className="flex flex-col h-full gap-3 md:gap-3.5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="contact-name" className="block text-xs md:text-sm font-semibold text-black mb-1.5">
                  Name
                </label>
                <input id="contact-name" type="text" placeholder="Your full name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs md:text-sm font-semibold text-black mb-1.5">
                  Email
                </label>
                <input id="contact-email" type="email" placeholder="you@example.com" className={inputClass} />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <label htmlFor="contact-message" className="block text-xs md:text-sm font-semibold text-black mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  placeholder="Tell us about your dental needs"
                  className={`${inputClass} flex-1 min-h-[90px] resize-none`}
                />
              </div>
              <button
                type="submit"
                className="self-start px-6 py-3 md:px-8 md:py-3.5 bg-black rounded-full text-white text-sm md:text-base font-bold hover:bg-neutral-800 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
