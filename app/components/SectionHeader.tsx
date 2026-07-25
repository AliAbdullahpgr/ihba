interface SectionHeaderProps {
  title: React.ReactNode;
  lede?: string;
  align?: "center" | "left";
  id?: string;
  className?: string;
}

export function SectionHeader({
  title,
  lede,
  align = "center",
  id,
  className = "",
}: SectionHeaderProps) {
  const wrapperClass =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl";
  const ledeClass = align === "center" ? "mx-auto max-w-2xl" : "";

  return (
    <div className={`${wrapperClass} ${className}`}>
      <h2
        id={id}
        className="font-display text-balance text-4xl font-bold tracking-tight text-navy-ink sm:text-5xl"
      >
        {title}
      </h2>
      {lede && (
        <p className={`mt-4 text-base leading-relaxed text-ink/65 sm:text-lg ${ledeClass}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
