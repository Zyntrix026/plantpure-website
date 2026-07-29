import { useState } from "react";
import useReveal from "../layout/useReveal";
import FloatingLeaves from "../layout/FloatingLeaves";
import { Leaf } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { INGREDIENTS } from "../../data/ingredients";

type Ingredient = {
  id: string;
  name: string;
  latin: string;
  origin: string;
  short: string;
  long: string;
  benefits: string[];
};

function Glossary() {
  const [active, setActive] = useState<Ingredient | null>(null);
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="glossary"
      className="relative overflow-hidden bg-foreground px-5 py-24 text-[var(--cream)] md:px-8 md:py-32"
    >
      {/* Background Decoratives */}
      <FloatingLeaves count={8} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--sage)]/10 via-transparent to-transparent opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div
          ref={headRef}
          className="reveal-on-scroll mb-16 text-center md:mb-24"
        >
          {/* <span className="inline-block text-[11px] font-bold uppercase italic tracking-[0.35em] text-[var(--terracotta)]">
            Chapter 08 — The Botanicals
          </span> */}
          <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-[var(--cream)] sm:text-5xl md:text-6xl">
            The PlantPure Glossary
          </h2>
          <div className="mx-auto mt-6 h-[1px] w-12 bg-[var(--sage)]/40" />
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--cream)]/70">
            Every leaf, root, and seed we use — with its natural origin and purpose. 
            Tap any card for the complete story.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INGREDIENTS.map((ing) => (
            <button
              key={ing.id}
              onClick={() => setActive(ing)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:border-[var(--sage)]/50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),_0_0_50px_10px_rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-[var(--sage)]/40"
            >
              {/* Flash/Glow Light Beam Effect */}
              <div className="absolute -inset-full top-0 z-10 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 group-hover:animate-[shine_0.8s_ease-in-out]" />

              {/* Radial gradient glow tracking from bottom-right on hover */}
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[var(--sage)]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div>
                {/* Card Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--sage)]/10 text-[var(--sage)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--sage)]/20">
                    <Leaf className="size-5" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 transition-colors group-hover:text-[var(--terracotta)]">
                    {ing.origin.split(",")[0] || "Botanical"}
                  </span>
                </div>

                {/* Typography Stack */}
                <div className="mt-6">
                  <h3 className="font-serif text-2xl font-medium tracking-wide text-neutral-900 transition-colors duration-300 group-hover:text-black">
                    {ing.name}
                  </h3>
                  <p className="mt-1 text-xs italic tracking-wide text-neutral-500">
                    {ing.latin}
                  </p>
                </div>

                {/* Excerpt */}
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-neutral-600 transition-colors duration-300 group-hover:text-neutral-900">
                  {ing.short}
                </p>
              </div>

              {/* Explicit CTA */}
              <div className="mt-8 flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)] transition-transform duration-300 group-hover:translate-x-2">
                <span>Learn more</span>
                <span className="text-xs font-light">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modernized Detail Dialog Overlay */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl overflow-hidden border-white/10 bg-white p-0 shadow-2xl sm:rounded-3xl">
          {active && (
            <div className="relative text-neutral-900">
              {/* Top Banner Gradient Block */}
              <div className="h-1.5 bg-gradient-to-r from-[var(--sage)] via-[var(--terracotta)] to-[var(--sage)]/50" />

              <div className="p-8 md:p-12">
                <DialogHeader className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--terracotta)]">
                    Origin: {active.origin}
                  </span>
                  <DialogTitle className="font-serif text-4xl font-normal text-neutral-900 md:text-5xl">
                    {active.name}
                  </DialogTitle>
                  <p className="text-sm italic tracking-wide text-neutral-500">
                    {active.latin}
                  </p>
                </DialogHeader>

                <hr className="my-8 border-neutral-200" />

                {/* Two Column Layout on Larger Screens */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
                  {/* Detailed Description */}
                  <div className="md:col-span-3">
                    <p className="text-base leading-relaxed text-neutral-700 md:leading-loose">
                      {active.long}
                    </p>
                  </div>

                  {/* Highlights Box */}
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 md:col-span-2">
                    <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Key benefits
                    </div>
                    <ul className="space-y-3.5">
                      {active.benefits.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm leading-snug text-neutral-800"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--sage)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Glossary;