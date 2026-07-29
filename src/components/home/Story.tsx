import hibiscusVideoAsset from "../../assets/about.mp4";
function Story() {
  return (
    <section
      id="story"
      className="bg-foreground px-5 py-24 text-[var(--cream)] md:px-8 "
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2 md:gap-20">
        <div className="relative overflow-hidden rounded-3xl">
          <video
            src={hibiscusVideoAsset}
            autoPlay
            muted
            loop
            playsInline
            className="aspect-square w-full object-cover animate-ken-burns"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-foreground/50 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-md">
            <span className="relative grid size-2 place-items-center">
              <span className="absolute inset-0 rounded-full bg-[var(--terracotta)] animate-soft-pulse" />
              <span className="relative size-1.5 rounded-full bg-[var(--terracotta)]" />
            </span>
            Hibiscus extraction
          </div>
        </div>
        <div className="space-y-7">
          {/* <span className="text-[11px] font-semibold uppercase italic tracking-[0.3em] text-[var(--sage)]">
            Chapter 05 — The Promise
          </span> */}
          <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
            No PPD. No ammonia. No compromise.
          </h2>
          <p className="text-base leading-loose text-[var(--cream)]/75">
            Every commercial hair dye on the shelf carries the same quiet
            villains — paraphenylenediamine, heavy metals, ammonia. We refused
            them all. Our colouring kit is three ingredients, three powders,
            zero chemistry: <em>henna, indigo, hibiscus oil.</em>
          </p>
          <p className="text-base leading-loose text-[var(--cream)]/75">
            It covers greys. It stops the fall. It thickens the strand. It
            brings back the bounce. That is the entire story — and the only
            promise we make.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6">
            <Stat value="5,000+" label="Women Transitioned" />
            <Stat value="0%" label="PPD / ammonia" />
            <Stat value="10" label="Years perfected" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl italic text-[var(--sage)]">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] opacity-60">
        {label}
      </div>
    </div>
  );
}

export default Story;