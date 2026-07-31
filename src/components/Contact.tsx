import type { RefObject } from 'react';
import { useStaggeredReveal } from '../hooks/useStaggeredReveal';

const contactInfo = [
  { label: 'Phone', value: '(201) 555-0123' },
  { label: 'Email', value: 'hello@dentalhealth.com' },
  { label: 'Address', value: '4808 Bergenline Ave,\nWest New York, NJ' },
];

const inputClass =
  'w-full px-4 py-3 md:px-5 md:py-4 bg-neutral-100 rounded-xl text-sm md:text-base text-black placeholder-neutral-400 outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all';

export default function Contact() {
  const { containerRef: revealRef, getAnimStyle } = useStaggeredReveal(3);

  return (
    <section
      ref={revealRef as RefObject<HTMLElement>}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          {/* Heading card */}
          <div
            className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
            style={getAnimStyle(0)}
          >
            <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">
              Contact<br />
              Us
            </h2>
            <p className="text-xs md:text-sm font-semibold text-black">
              We're here to help your smile
            </p>
          </div>

          {/* Info card */}
          <div
            className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex-1 min-h-[200px] md:min-h-0 flex flex-col justify-between"
            style={getAnimStyle(1)}
          >
            {contactInfo.map((info, i) => (
              <div key={info.label} className={i > 0 ? 'pt-4 md:pt-5 border-t border-black/10' : ''}>
                <p className="text-xs md:text-sm font-semibold text-black/50 mb-1">
                  {info.label}
                </p>
                <p className="text-base md:text-xl font-bold text-black whitespace-pre-line leading-5 md:leading-6">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - Form */}
        <div
          className="rounded-xl md:rounded-2xl bg-white border border-neutral-200 p-5 md:p-7 min-h-[420px] md:min-h-0"
          style={getAnimStyle(2)}
        >
          <form className="flex flex-col h-full gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="contact-name" className="block text-xs md:text-sm font-semibold text-black mb-2">
                Name
              </label>
              <input id="contact-name" type="text" placeholder="Your full name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs md:text-sm font-semibold text-black mb-2">
                Email
              </label>
              <input id="contact-email" type="email" placeholder="you@example.com" className={inputClass} />
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <label htmlFor="contact-message" className="block text-xs md:text-sm font-semibold text-black mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Tell us about your dental needs"
                className={`${inputClass} flex-1 min-h-[120px] resize-none`}
              />
            </div>
            <button
              type="submit"
              className="self-start px-6 py-3 md:px-8 md:py-4 bg-black rounded-full text-white text-sm md:text-base font-bold hover:bg-neutral-800 hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
