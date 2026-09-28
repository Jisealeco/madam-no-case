import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Ornament from './Ornament.jsx';

/** Burgundy banner at the top of inner pages. */
export default function PageHero({ eyebrow, title, intro, crumb }) {
  return (
    <section className="on-dark relative overflow-hidden bg-wine-900 bg-lattice">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
      <div className="container-x relative py-16 text-center sm:py-20 lg:py-24">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-1.5 text-[0.8rem] tracking-wide text-ivory-100/60">
          <Link to="/" className="hover:text-gold-300">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gold-300">{crumb || title}</span>
        </nav>
        {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
        <h1 className="mt-4 text-[2.5rem] font-semibold text-ivory-50 sm:text-5xl lg:text-[3.6rem]">{title}</h1>
        <Ornament light className="mt-6 justify-center" />
        {intro && <p className="mx-auto mt-6 max-w-2xl text-lg text-ivory-100/80">{intro}</p>}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
    </section>
  );
}
