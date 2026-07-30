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
      <defs>
        <linearGradient
          id="rings-grad"
          x1="0"
          y1="0"
          x2="100"
          y2="62"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b76e79" />
          <stop offset="0.55" stopColor="#dfc48d" />
          <stop offset="1" stopColor="#b76e79" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="31" r="22" stroke="url(#rings-grad)" strokeWidth="6" />
      <circle cx="68" cy="31" r="22" stroke="url(#rings-grad)" strokeWidth="6" />
    </svg>
  );
}
