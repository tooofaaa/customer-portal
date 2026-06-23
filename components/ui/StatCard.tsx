interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  accent = "#6366f1",
  description,
}: StatCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(99,102,241,0.1)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 30px rgba(99,102,241,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 20px rgba(0,0,0,0.06)";
      }}
    >
      {/* Decorative top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#94a3b8" }}
        >
          {title}
        </p>
        {icon && (
          <div
            className="p-2 rounded-xl"
            style={{
              background: `${accent}15`,
              color: accent,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <p
        className="text-3xl font-bold tracking-tight"
        style={{ color: "#0f172a" }}
      >
        {value}
      </p>

      {description && (
        <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>
          {description}
        </p>
      )}
    </div>
  );
}
