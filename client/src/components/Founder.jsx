import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import portrait from '../assets/images/oluwatoyin-akinjise-founder.jpeg';
import { business, whatsappLink } from '../lib/business.js';
import { WhatsAppIcon } from './Icons.jsx';

const { founder } = business;

/** Arched portrait of the founder with a name card. */
export function FounderPortrait({ className = '' }) {
  return (
    <figure className={`relative mx-auto w-full max-w-md ${className}`}>
      <div className="arch absolute -inset-3 border border-gold-500/60 sm:-inset-4" aria-hidden="true" />
      <img
        src={portrait}
        alt={`${founder.name}, ${founder.title} of ${business.name}, wearing coral beads and Asooke`}
        loading="lazy"
        className="arch relative aspect-[4/5] w-full bg-ivory-200 object-cover object-top shadow-soft"
      />
      <figcaption className="absolute -bottom-7 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-2xl bg-wine-800 px-6 py-3.5 text-center shadow-soft ring-1 ring-gold-400/40">
        <span className="block font-display text-lg leading-tight font-semibold text-ivory-50">{founder.name}</span>
        <span className="mt-1 block text-[0.68rem] tracking-[0.3em] text-gold-300 uppercase">{founder.title}</span>
      </figcaption>
    </figure>
  );
}

/** The founder's words, with a script signature. */
export function FounderQuote({ className = '', light = false }) {
  return (
    <blockquote className={`relative pt-7 ${className}`}>
      <span
        className={`pointer-events-none absolute -top-5 -left-1 font-display text-[5.5rem] leading-none ${light ? 'text-gold-400/50' : 'text-gold-300/80'}`}
        aria-hidden="true"
      >
        “
      </span>
      <p className={`relative font-display text-[1.3rem] leading-relaxed italic sm:text-[1.45rem] ${light ? 'text-ivory-50' : 'text-wine-800'}`}>
        {founder.quote}
      </p>
      <footer className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className={`font-script text-[2.4rem] leading-none ${light ? 'text-gold-300' : 'text-gold-600'}`}>{founder.signature}</span>
        <span className={`text-sm tracking-wide ${light ? 'text-ivory-100/70' : 'text-muted'}`}>
          {founder.name}, {founder.title}
        </span>
      </footer>
    </blockquote>
  );
}

/** Home-page section introducing the founder. */
export default function FounderSection() {
  return (
    <section className="on-dark relative overflow-hidden bg-wine-900 bg-lattice py-20 lg:py-28">
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="arch absolute -inset-3 border border-gold-400/50 sm:-inset-4" aria-hidden="true" />
          <img
            src={portrait}
            alt={`${founder.name}, ${founder.title} of ${business.name}`}
            loading="lazy"
            className="arch relative aspect-[4/5] w-full object-cover object-top shadow-2xl"
          />
          <p className="absolute -right-2 -bottom-6 max-w-[12.5rem] rounded-2xl bg-ivory-50 px-4 py-3 text-[0.82rem] leading-snug text-muted shadow-soft sm:-right-10">
            Wearing <span className="font-medium text-wine-800">coral beads & Asooke</span>, the same pieces we offer in store.
          </p>
        </div>

        <div>
          <p className="eyebrow">Meet Madam No Case</p>
          <h2 className="mt-4 text-[2.3rem] font-semibold text-ivory-50 sm:text-5xl">{founder.name}</h2>
          <p className="mt-2 text-sm tracking-[0.3em] text-gold-300 uppercase">{founder.title}</p>
          <FounderQuote light className="mt-12" />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink(`Hello Madam, I'd love your help planning our ceremony.`)} target="_blank" rel="noreferrer" className="btn-gold">
              <WhatsAppIcon /> Chat with Madam
            </a>
            <Link to="/about" className="btn-outline-light">
              Our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
