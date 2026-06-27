import { Leaf } from "lucide-react";
import hibiscusVideoAsset from "../../assets/about.mp4";
function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-5 pb-20 pt-12 md:px-8 md:pt-20"
    >
      <FloatingLeaves count={10} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="animate-fade-up">
          <span className="mb-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase italic tracking-[0.3em] text-[var(--terracotta)]">
            <Leaf className="size-3 animate-leaf-sway" strokeWidth={1.5} />
            Chapter 01 — Devised in Japan
          </span>
          <h1 className="text-balance font-serif text-5xl leading-[0.98] md:text-7xl lg:text-[5.5rem]">
            Nature's <span className="italic text-[var(--sage)]">Color.</span>
            <br />
            Professional
            <br />
            <span className="italic text-[var(--sage)]">Coverage.</span> Healthy
            Shine.
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-gray-700">
            A formulation devised in Japan, perfected in India — PlantPure is
            botanical hair colour and oil ritual that delivers salon-grade
            results without a single drop of chemistry.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="inline-flex items-center gap-3 rounded-full bg-foreground px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-background shadow-xl shadow-foreground/10 transition-colors hover:bg-[#bad655]"
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
        <div className="relative animate-fade-up">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl ">
            <video
              src={hibiscusVideoAsset}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-md">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute inset-0 rounded-full bg-[var(--sage)] animate-soft-pulse" />
                <span className="relative size-1.5 rounded-full bg-[var(--sage)]" />
              </span>
              Live botanicals
            </div>
          </div>
          <div className="absolute -bottom-6 -left-4 hidden max-w-[260px] rounded-2xl bg-[#bad655] p-6 text-[var(--cream)] shadow-2xl shadow-foreground/20 md:block lg:-left-8 lg:p-7">
            <p className="font-serif text-base italic leading-snug">
              "Covers my greys, calmed my scalp, gave me back the bounce."
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] opacity-80">
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