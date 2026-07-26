/**
 * Section opener. The label sits above a hairline rule and the title runs
 * beneath it — a masthead rather than a centred heading, which is what keeps
 * the page reading as an editorial layout.
 */
interface SectionHeaderProps {
  title: React.ReactNode;
  label?: string;
  lede?: string;
  id?: string;
  className?: string;
}

export function SectionHeader({
  title,
  label,
  lede,
  id,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={className}>
      {label && (
        <>
          <p className="eyebrow text-ink/50">{label}</p>
          <hr className="rule mt-4" />
        </>
      )}
      <h2
        id={id}
        className={`display-xl text-balance max-w-[26ch] text-3xl text-navy-ink sm:text-4xl ${
          label ? "mt-8" : ""
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/65">
          {lede}
        </p>
      )}
    </div>
  );
}
