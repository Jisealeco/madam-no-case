import Ornament from './Ornament.jsx';

export default function SectionHeading({ eyebrow, title, intro, align = 'center', light = false, className = '' }) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-2xl ${light ? 'on-dark' : ''} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`mt-4 text-[2.1rem] font-semibold sm:text-[2.65rem] ${light ? 'text-ivory-50' : ''}`}>{title}</h2>
      <Ornament light={light} className={`mt-5 ${centered ? 'justify-center' : ''}`} />
      {intro && <p className={`mt-5 text-lg ${light ? 'text-ivory-100/80' : 'text-muted'}`}>{intro}</p>}
    </div>
  );
}
