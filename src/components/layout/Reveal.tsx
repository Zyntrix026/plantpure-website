import useReveal from "./useReveal";

function Reveal({
  children,
  delay = 0,
  className = "",
  as: As = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useReveal<HTMLDivElement>();
  const staggerClass = delay ? `stagger-${delay}` : "";
  return (
    <As
      ref={ref as never}
      className={`reveal-on-scroll ${staggerClass} ${className}`}
    >
      {children}
    </As>
  );
}

export default Reveal;