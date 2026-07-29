import React from "react";
import { Leaf } from "lucide-react";
import hibiscusVideoAsset from "../../assets/Hero.mp4";

function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden custom-container pb-16 pt-10 md:pb-24 md:pt-16"
    >
      <FloatingLeaves count={10} />

      <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        
        {/* Left Column - Content */}
        <div className="animate-fade-up">
          {/* <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--terracotta)] md:mb-6">
            <Leaf className="size-3 animate-leaf-sway" strokeWidth={1.5} />
            Chapter 01 — Devised in Japan
          </span> */}

          <h1 className="text-balance font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-[5.25rem] lg:leading-[1]">
            Nature's <span className="font-serif text-[var(--sage)]">Color.</span>
            <br />
            Professional
            <br />
            <span className="font-serif text-[var(--sage)]">Coverage.</span> Healthy
            Shine.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-gray-700 sm:text-lg md:mt-8">
            A formulation devised in Japan, perfected in India — PlantPure is a
            botanical hair color and oil ritual that delivers salon-grade
            results without a single harmful chemical.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10">
            <a
              href="#shop"
              className="inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-background shadow-xl shadow-foreground/10 transition-all hover:bg-[#bad655] hover:text-foreground sm:px-9 sm:py-4"
            >
              Shop the Collection
            </a>
            <a
              href="#story"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] underline-offset-4 hover:underline"
            >
              Read Our Story
            </a>
          </div>
        </div>

        {/* Right Column - Responsive Video Container */}
        <div className="relative animate-fade-up">
          <div className="relative h-[450px] w-full overflow-hidden rounded-3xl sm:h-[550px] md:h-[620px]">
            <video
              src={hibiscusVideoAsset}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

            {/* Live Botanicals Tag */}
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-md sm:left-5 sm:top-5">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute inset-0 rounded-full bg-[var(--sage)] animate-soft-pulse" />
                <span className="relative size-1.5 rounded-full bg-[var(--sage)]" />
              </span>
              Live Botanicals
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="mt-4 rounded-2xl bg-[#bad655] p-5 text-gray-900 shadow-xl md:absolute md:-bottom-6 md:-left-4 md:mt-0 md:max-w-[260px] md:p-6 lg:-left-8 lg:p-7">
            <p className="font-serif text-sm leading-snug sm:text-base">
              "Covers my greys, calmed my scalp, and gave me back the bounce."
            </p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80 sm:mt-3">
              — Aiko M., Japan
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function FloatingLeaves({ count = 9 }: { count?: number }) {
  const leaves = Array.from({ length: count });
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {leaves.map((_, i) => {
        const left = (i * 97) % 100;
        const delay = (i * 1.7) % 14;
        const duration = 12 + (i % 5) * 2;
        const size = 14 + (i % 4) * 6;
        const top = (i * 53) % 100;
        return (
          <Leaf
            key={i}
            strokeWidth={1.2}
            className="absolute text-[var(--sage)]/30 animate-leaf-float"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `-${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default Hero;