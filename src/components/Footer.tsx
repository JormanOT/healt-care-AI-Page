const footerLinks = ['Home', 'Services', 'About', 'Gallery', 'Contact'];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none">
              Dental
            </div>
            <div className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2">
              Health
            </div>
            <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2 text-white/60">
              quality healthcare
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Contact info */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <a
              href="tel:+12015550123"
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200"
            >
              (201) 555-0123
            </a>
            <a
              href="mailto:hello@dentalhealth.com"
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200"
            >
              hello@dentalhealth.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 md:mt-14 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Dental Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
