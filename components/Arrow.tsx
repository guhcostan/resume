export function Arrow({ direction = "up-right", className = "" }: { direction?: "up-right" | "down-right" | "down" | "right"; className?: string }) {
  const rotation = { "up-right": 0, "down-right": 90, down: 135, right: 45 }[direction];
  return (
    <svg className={`arrow ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ rotate: `${rotation}deg` }}>
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
