import Reveal from "../layout/Reveal";

function Ritual() {
  const steps = [
    {
      n: "I",
      title: "Henna Powder – 100g",
      sub: "Scalp conditioning & shine",
      body: "Triple filtered Henna powder is a traditional Ayurvedic ingredient that naturally conditions hair, enhances texture and shine, and helps maintain a healthy scalp with its antifungal and antibacterial properties, supporting stronger and healthier hair growth.",
    },
    {
      n: "II",
      title: "Indigo Powder – 100g",
      sub: "Natural color & volume",
      body: "Helps provide rich natural color and effective grey coverage without chemical dyes, while enhancing the appearance of thicker, fuller, and more voluminous hair.",
    },
    {
      n: "III",
      title: "Hibiscus Oil – 30ml",
      sub: "Deep nourishment & softness",
      body: "Formulated with hibiscus flower extract, black sesame seed oil, fenugreek seed extract, and rose oil. It deeply nourishes the scalp and hair while improving softness, natural shine, and manageability.",
    },
  ];

  return (
    <section
      id="ritual"
      className="relative overflow-hidden bg-[#F8F5F0] px-6 py-32"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--sage)]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--terracotta)]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-24 max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--terracotta)]">
            Chapter 06 — The Ritual
          </span>

          <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
            Three botanical steps.
            <br />
            <span className="italic text-[var(--sage)]">
              One ancient ritual.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-foreground/60">
            A botanical ritual crafted thoughtfully from nature's most effective ingredients.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((s, idx) => (
            <Reveal
              key={s.n}
              delay={idx + 1}
              className="group relative overflow-hidden rounded-[36px] border border-[#E8E0D6] bg-white/80 p-10 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[var(--sage)]"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[var(--sage)]/15 blur-3xl" />
              </div>

              {/* Big Number */}
              <div className="absolute right-8 top-8 font-serif text-[120px] italic leading-none text-[var(--sage)]/8 transition-all duration-700 group-hover:scale-110 group-hover:text-[var(--sage)]/15">
                {s.n}
              </div>

              <div className="relative z-10">
                {/* Step Badge */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sage)]/10 text-lg font-semibold text-[var(--sage)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--sage)] group-hover:text-white">
                  {s.n}
                </div>

                <h3 className="mt-8 font-serif text-3xl transition-all duration-500 group-hover:text-[var(--sage)]">
                  {s.title}
                </h3>

                {s.sub && (
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--terracotta)]">
                    {s.sub}
                  </p>
                )}

                <div className="mt-8 h-px w-full bg-gradient-to-r from-[var(--sage)]/40 to-transparent" />

                <p className="mt-8 text-base leading-relaxed text-foreground/70">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ritual;