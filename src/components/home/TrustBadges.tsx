import { Droplet, Heart, Leaf, Sparkles } from "lucide-react";

function TrustBadges() {
  const items = [
    { icon: Leaf, label: "100% Vegan" },
    { icon: Heart, label: "Cruelty-Free" },
    { icon: Droplet, label: "Sulfate-Free" },
    { icon: Sparkles, label: "Paraben-Free" },
  ];
  return (
    <section className="relative border-t border-border/60 bg-gradient-to-b from-transparent to-[var(--sage)]/[0.02] px-5 py-24 md:px-8">
      {/* Structural layout wrapper */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-10 md:grid-cols-4">
          {items.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative flex size-20 items-center justify-center rounded-3xl border border-foreground/10 bg-white/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105 group-hover:border-[var(--sage)]/40 group-hover:bg-white group-hover:shadow-[0_20px_35px_-10px_rgba(var(--sage-rgb,0,0,0),0.1)]">
                {/* Subtle internal abstract geometric flare inside the box on hover */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-transparent to-[var(--sage)]/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <Icon
                  className="size-6 text-[var(--sage)] transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.25}
                />
              </div>

              <span className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                {label}
              </span>

              <div className="mt-2 h-[1px] w-0 bg-[var(--terracotta)]/60 transition-all duration-500 ease-out group-hover:w-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustBadges;