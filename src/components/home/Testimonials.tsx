import React from "react";

function Testimonials() {
  const TESTIMONIALS = [
    {
      quote:
        "I had given up on natural color — until PlantPure. Three weeks in, my greys are gone, my scalp stopped itching, and my hair feels twice as thick. I'm never going back to a salon.",
      author: "Priya R., verified customer",
    },
    {
      quote:
        "The application is incredibly soothing. It feels more like an upscale spa hair ritual than standard root coverage. My strands are deeply conditioned and radiant.",
      author: "Aanya S., verified customer",
    },
    {
      quote:
        "No chemical smells, zero scalp irritation, and complete stubborn grey coverage. It has completely transformed the texture and vitality of my damaged hair.",
      author: "Marcus K., verified customer",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [TESTIMONIALS.length]);

  return (
    <section
      id="testimonial"
      className="relative overflow-hidden bg-[var(--terracotta)]/10 px-5 py-24 md:px-8 md:py-32"
    >
      {/* Background Aesthetic Decorative Element */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--terracotta)]/5 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center">
        {/* <span className="inline-block text-[11px] font-semibold uppercase italic tracking-[0.3em] text-[var(--terracotta)]">
          Chapter 07 — The Voices
        </span> */}

        {/* Dynamic Frame Height Container */}
        <div className="relative mt-8 min-h-[220px] sm:min-h-[160px] md:min-h-[180px]">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className={`absolute inset-x-0 top-0 transform transition-all duration-1000 ease-in-out ${
                idx === activeIndex
                  ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
                  : "pointer-events-none opacity-0 translate-y-4 scale-95"
              }`}
            >
              <blockquote className="font-serif text-2xl italic leading-relaxed text-foreground sm:text-3xl md:text-4xl">
                "{t.quote}"
              </blockquote>

              <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/60">
                — {t.author}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Indicators */}
        <div className="mt-12 flex items-center justify-center gap-2.5">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === activeIndex
                  ? "w-6 bg-[var(--terracotta)]"
                  : "w-1.5 bg-[var(--terracotta)]/30 hover:bg-[var(--sage)]"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;