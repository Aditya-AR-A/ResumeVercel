// A static, theme-aware background avoids a continuous WebGL render loop and
// remains available on low-power devices and with reduced motion enabled.
export default function VantaFog({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return <div aria-hidden="true" className={`ambient-background pointer-events-none ${className}`}>{children}</div>;
}
