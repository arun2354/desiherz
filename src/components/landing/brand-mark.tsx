/** Two interlocking rings — the brand mark: two becoming one. */
export function BrandMark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 100 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="32" cy="31" r="22" stroke="#d9a760" strokeWidth="6" />
      <circle cx="68" cy="31" r="22" stroke="#d9a760" strokeWidth="6" />
    </svg>
  );
}
