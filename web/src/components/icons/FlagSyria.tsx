/** Syrian independence flag — green, white (3 red stars in one row), black */
const STAR =
  "M0,-1.15 0.34,-0.35 1.1,-0.35 0.43,0.13 0.68,1 0,0.52 -0.68,1 -0.43,0.13 -1.1,-0.35 -0.34,-0.35Z";

export default function FlagSyria({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="28" height="6.67" y="0" fill="#007229" />
      <rect width="28" height="6.66" y="6.67" fill="#FFFFFF" />
      <rect width="28" height="6.67" y="13.33" fill="#000000" />
      <g fill="#CE1126">
        <g transform="translate(7 10) scale(1.25)">
          <path d={STAR} />
        </g>
        <g transform="translate(14 10) scale(1.25)">
          <path d={STAR} />
        </g>
        <g transform="translate(21 10) scale(1.25)">
          <path d={STAR} />
        </g>
      </g>
    </svg>
  );
}
