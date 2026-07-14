export function StatCard({
  label,
  value,
  accent = 'flow',
}: {
  label: string;
  value: string | number;
  accent?: 'flow' | 'amber' | 'moss' | 'clay';
}) {
  const accentBar: Record<string, string> = {
    flow: 'bg-flow-500',
    amber: 'bg-amber-400',
    moss: 'bg-moss-400',
    clay: 'bg-clay-400',
  };

  return (
    <div className="relative overflow-hidden rounded-xl2 bg-white p-5 shadow-card">
      <div className={`absolute left-0 top-0 h-full w-1 ${accentBar[accent]}`} />
      <p className="text-sm font-medium text-ink/50">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}
