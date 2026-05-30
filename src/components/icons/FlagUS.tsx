export default function FlagUS({ className }: { className?: string }) {
  const stripe = 20 / 13;
  return (
    <svg viewBox="0 0 28 20" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="28" height="20" fill="#B22234" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} y={(i * 2 + 1) * stripe} width="28" height={stripe} fill="#FFFFFF" />
      ))}
      <rect width="11.2" height="10.8" fill="#3C3B6E" />
    </svg>
  );
}
