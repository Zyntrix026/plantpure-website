import React from "react";
import { ArrowRight, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground  pt-10 pb-10 text-white/90  md:pt-14">
      {/* ─── LUXURY ORGANIC BACKGROUND BLURS ─── */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-[var(--sage)]/5 blur-[140px]" />
        <div className="absolute right-[-5%] bottom-[-15%] h-[600px] w-[600px] rounded-full bg-[var(--terracotta)]/[0.03] blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.01),transparent_60%)]" />
      </div>

      <div className="relative custom-container">
        
        {/* ─── TOP SECTION: BALANCED GRID ARCHITECTURE ─── */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 pb-16 sm:grid-cols-2 lg:grid-cols-12 items-start">
          
          {/* COLUMN 1: BRAND IDENTIFIER (Large Span) */}
          <div className="space-y-6 lg:col-span-5 md:pr-6">
            <div className="inline-block">
              <img
                src="/logo.png"
                alt="PlantPure Naturals"
                width={190}
                height={60}
                loading="lazy"
                className=" w-[100px] "
              />
            </div>

            <p className="max-w-xs font-serif text-2xl italic leading-relaxed text-white/90">
              Devised in Japan. <br />
              <span className="text-white/50 text-xs font-sans not-italic tracking-[0.25em] uppercase block mt-2">
                Proudly Crafted in India.
              </span>
            </p>

            <p className="max-w-sm text-sm leading-relaxed tracking-wide text-white/90">
              Honoring botanical wisdom to deliver professional, chemical-free
              permanent hair coverage, healthier strands, and a naturally
              elevated self-care ritual.
            </p>

            {/* Premium Pill Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["Ammonia Free", "Botanical Blend", "Salon Inspired"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* COLUMN 2: NAVIGATION LINKS */}
          <div className="lg:col-span-2">
            <h5 className="relative mb-6 text-[12px] font-bold uppercase tracking-[0.25em] text-white/40 after:absolute after:bottom-[-8px] after:left-0 after:h-[1px] after:w-8 after:bg-[var(--terracotta)]/40">
              Explore
            </h5>
            <ul className="space-y-4 text-sm font-normal">
              {[
                { label: "Our Story", href: "/about" },
                { label: "Blogs", href: "/blogs" },
                { label: "Products", href: "/products" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center text-white/90 transition-all duration-300 hover:underline decoration-[var(--terracotta)] underline-offset-4"
                  >
                    <span className="mr-0 max-w-0 opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:max-w-[14px] group-hover:opacity-100 text-[var(--terracotta)] font-normal no-underline inline-block">
                      —
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: EDITORIAL NEWSLETTER */}
          <div className="lg:col-span-3">
            <h5 className="relative mb-6 text-[12px] font-bold uppercase tracking-[0.25em] text-white/40 after:absolute after:bottom-[-8px] after:left-0 after:h-[1px] after:w-8 after:bg-[var(--terracotta)]/40">
              The Circle
            </h5>
            <p className="mb-5 text-sm leading-relaxed text-white/90 tracking-wide">
              Subscribe to unlock early botanical updates, masterclasses, and seasonal hair wellness rituals.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center border-b border-white/10 py-2 transition-colors duration-300 focus-within:border-[var(--terracotta)]/50"
            >
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="w-full bg-transparent pr-10 text-xs text-white/90 outline-none placeholder:text-white/30 tracking-widest font-bold"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 flex -translate-y-1/2 p-1.5 text-white/50 transition-colors hover:text-[var(--terracotta)]"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Premium Minimal Social Icons Layout */}
            <div className="mt-6 flex gap-4 text-white/50">
              {[
                { icon: <Instagram size={16} strokeWidth={1.5} />, href: "#instagram", label: "Instagram" },
                { icon: <Facebook size={16} strokeWidth={1.5} />, href: "#facebook", label: "Facebook" },
                { icon: <Youtube size={16} strokeWidth={1.5} />, href: "#youtube", label: "Youtube" },
              ].map((soc, idx) => (
                <a 
                  key={idx} 
                  href={soc.href} 
                  className="p-2 border border-white/5 rounded-full bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/90 transition-all duration-300" 
                  aria-label={soc.label}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 4: STUDIO CONTACT DETAILS */}
          <div className="lg:col-span-2">
            <h5 className="relative mb-6 text-[12px] font-bold uppercase tracking-[0.25em] text-white/40 after:absolute after:bottom-[-8px] after:left-0 after:h-[1px] after:w-8 after:bg-[var(--terracotta)]/40">
              Studio
            </h5>
            <div className="space-y-4 text-xs tracking-wide text-white/90 font-semibold uppercase">
              <a href="indiacraftworld@gmail.com" className="flex items-center gap-3 group normal-case font-medium text-sm hover:underline decoration-[var(--terracotta)] underline-offset-4">
                <Mail size={15} strokeWidth={1.5} className="text-white/40 shrink-0" />
                <span className="break-all">indiacraftworld@gmail.com</span>
              </a>
              <a href="tel:+919810999976" className="flex items-center gap-3 group font-medium text-sm hover:underline decoration-[var(--terracotta)] underline-offset-4">
                <Phone size={15} strokeWidth={1.5} className="text-white/40 shrink-0" />
                <span>+91-9810999976</span>
              </a>
              {/* <div className="flex items-start gap-3 lowercase normal-case font-medium text-sm text-white/90">
                <MapPin size={15} strokeWidth={1.5} className="text-white/40 mt-0.5 shrink-0" />
                <span className="leading-relaxed">India · Botanical Hair Wellness Lab</span>
              </div> */}
            </div>
          </div>

        </div>

        {/* ─── BOTTOM SECTION: METADATA & COPYRIGHT ─── */}
        <div className="flex flex-col gap-6 border-t border-white/5 pt-10 sm:flex-row sm:items-center sm:justify-between text-white/50">
          <div className="tracking-[0.15em] text-sm font-normal text-white/90">
            © 2026 PlantPure Naturals. Pure. Powerful. Naturally Beautiful.
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "Refund Policy", href: "/refund-policy" },
            ].map((metaLink) => (
              <Link
                key={metaLink.label} 
                to={metaLink.href} 
                className="text-white/90 transition-all text-sm font-normal duration-300 hover:underline decoration-[var(--terracotta)] underline-offset-4"
              >
                {metaLink.label}
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </footer>
  );
}

export default Footer;