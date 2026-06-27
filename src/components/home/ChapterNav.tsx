import { useEffect, useState } from "react";

function ChapterNav() {
  const chapters = [
    { id: "hero", num: "01", label: "Devised in Japan" },
    { id: "chapters", num: "02", label: "Japan, 2014" },
    { id: "story", num: "05", label: "The Promise" },
    { id: "ritual", num: "06", label: "The Ritual" },
    { id: "testimonial", num: "07", label: "The Voices" },
    { id: "glossary", num: "08", label: "Botanicals" },
    { id: "shop", num: "09", label: "Apothecary" },
  ];
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <nav
      aria-label="Chapters"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {chapters.map((c) => {
        const isActive = active === c.id;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="group relative flex items-center justify-end gap-3"
          >
            <span
              className={`whitespace-nowrap rounded-full bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-md transition-all duration-300 ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {c.num} · {c.label}
            </span>
            <span
              className={`block rounded-full border transition-all duration-300 ${
                isActive
                  ? "size-3 border-[var(--terracotta)] bg-[var(--terracotta)]"
                  : "size-2 border-foreground/40 bg-transparent group-hover:border-[var(--terracotta)]"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

export default ChapterNav;