import { Link } from 'react-router-dom';

/** Crowned "M" monogram, after the mark on the business flyer. */
export function Monogram({ className = 'h-12 w-12', light = false }) {
  const ring = light ? '#e4c67f' : '#c49a45';
  const letter = light ? '#fdfaf4' : '#4a0d27';
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`mg-${light ? 'l' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efdca9" />
          <stop offset="1" stopColor="#a67e30" />
        </linearGradient>
      </defs>
      <path d="M22 9.5l4.2 4.6L32 6.5l5.8 7.6L42 9.5l-1.6 8.3H23.6z" fill={`url(#mg-${light ? 'l' : 'd'})`} />
      <circle cx="26.2" cy="9.4" r="1.3" fill="#efdca9" />
      <circle cx="32" cy="6.2" r="1.4" fill="#efdca9" />
      <circle cx="37.8" cy="9.4" r="1.3" fill="#efdca9" />
      <circle cx="32" cy="39" r="19.5" fill="none" stroke={ring} strokeWidth="1.6" />
      <circle cx="32" cy="39" r="16.8" fill="none" stroke={ring} strokeOpacity="0.45" strokeWidth="0.8" />
      <text
        x="32"
        y="47"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="800"
        fontSize="23"
        fill={letter}
      >
        M
      </text>
    </svg>
  );
}

export default function Logo({ light = false, compact = false }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Madam No Case Ventures, home">
      <Monogram light={light} className="h-11 w-11 shrink-0 transition-transform duration-500 group-hover:-rotate-3 sm:h-12 sm:w-12" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.28rem] font-bold tracking-tight sm:text-[1.4rem] ${light ? 'text-ivory-50' : 'text-wine-800'}`}>
          Madam No Case
        </span>
        {!compact && (
          <span className={`mt-1.5 flex items-center gap-2 text-[0.6rem] font-medium tracking-[0.5em] ${light ? 'text-gold-300' : 'text-gold-600'}`}>
            <span className="h-px w-3 bg-current opacity-70" />
            VENTURES
            <span className="h-px w-3 bg-current opacity-70" />
          </span>
        )}
      </span>
    </Link>
  );
}
