import { Leaf } from "lucide-react";

function Marquee() {
  const phrases = [
    "100% Natural",
    "No PPD",
    "No Ammonia",
    "Devised in Japan",
    "Proudly Crafted in India",
    "Henna · Indigo · Hibiscus",
    "Cruelty-Free",
    "Vegan",
    "5,000+ Women Transitioned",
  ];
  const loop = [...phrases, ...phrases];
  return (
    <div className="border-y border-border bg-foreground py-5 text-[var(--cream)] overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {loop.map((p, i) => (
          <span
            key={i}
            className="mx-8 inline-flex items-center gap-8 font-serif text-xl italic"
          >
            {p}
            <Leaf className="size-3 text-[var(--sage)]" strokeWidth={1.5} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;