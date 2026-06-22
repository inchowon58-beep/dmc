interface SectionHeaderProps {
  id?: string;
  badge: string;
  title: string;
  description: string;
  accent: "indigo" | "emerald";
}

export default function SectionHeader({
  id,
  badge,
  title,
  description,
  accent,
}: SectionHeaderProps) {
  const badgeColor =
    accent === "emerald" ? "text-emerald-600" : "text-indigo-600";

  return (
    <header className="mb-5">
      <p className={`text-sm font-medium ${badgeColor}`}>{badge}</p>
      <h2
        id={id}
        className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
      >
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </header>
  );
}
