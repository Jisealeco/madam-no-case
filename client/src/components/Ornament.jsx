/** Gold hairline divider with a small lozenge, used between headings and body copy. */
export default function Ornament({ className = '', light = false }) {
  const color = light ? 'text-gold-300' : 'text-gold-500';
  return (
    <div className={`flex items-center gap-3 ${color} ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
      <svg viewBox="0 0 24 12" className="h-3 w-6 fill-current">
        <path d="M12 0l4 6-4 6-4-6z" />
        <circle cx="2.5" cy="6" r="1.4" />
        <circle cx="21.5" cy="6" r="1.4" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}
