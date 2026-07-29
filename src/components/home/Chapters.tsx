import Reveal from "../layout/Reveal";

function Chapters() {
  const chapters = [
    {
      num: "02",
      title: "Japan, 2014",
      body: "A formulation devised in Japan, perfected over a decade in salons across Shibuya and Ginza.",
    },
    {
      num: "03",
      title: "5,000 Women",
      body: "Successfully transitioned from chemical colouring to 100% natural — without sacrificing coverage or shine.",
    },
    {
      num: "04",
      title: "Proudly Crafted in India",
      body: "Brought home to Indian soil — to the henna fields of Rajasthan and the hibiscus gardens of Kerala.",
    },
  ];
  return (
    <section
      id="chapters"
      className="border-y border-border bg-[var(--cream)] px-5 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3 md:gap-14">
        {chapters.map((c, idx) => (
          <Reveal
            key={c.num}
            delay={idx + 1}
            className="border-l-2 border-[var(--sage)]/30 pl-6"
          >
            {/* <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--terracotta)]">
              Chapter {c.num}
            </div> */}
            <h3 className="mt-3 font-serif text-2xl italic leading-tight md:text-3xl">
              {c.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              {c.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Chapters;
// function Reveal({
//   children,
//   delay = 0,
//   className = "",
//   as: As = "div",
// }: {
//   children: React.ReactNode;
//   delay?: number;
//   className?: string;
//   as?: "div" | "section" | "article" | "li";
// }) {
//   const ref = useReveal<HTMLDivElement>();
//   const staggerClass = delay ? `stagger-${delay}` : "";
//   return (
//     <As
//       ref={ref as never}
//       className={`reveal-on-scroll ${staggerClass} ${className}`}
//     >
//       {children}
//     </As>
//   );
// }