import { Leaf } from "lucide-react";

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

export default FloatingLeaves;