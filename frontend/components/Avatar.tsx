export function Avatar({ name, color, size = 32 }: { name: string; color: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.38 }}
      title={name}
    >
      {initials}
    </div>
  );
}
