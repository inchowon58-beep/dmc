interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: "indigo" | "emerald";
}

export default function FilterChip({
  label,
  active,
  onClick,
  disabled,
  variant = "indigo",
}: FilterChipProps) {
  const activeStyles =
    variant === "emerald"
      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
      : "border-indigo-600 bg-indigo-600 text-white shadow-sm";

  const focusRing =
    variant === "emerald" ? "focus-visible:ring-emerald-500" : "focus-visible:ring-indigo-500";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        `focus-visible:outline-none focus-visible:ring-2 ${focusRing} focus-visible:ring-offset-2`,
        "disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? activeStyles
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
