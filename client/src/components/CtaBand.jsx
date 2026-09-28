import { Phone } from 'lucide-react';
import { business, whatsappLink } from '../lib/business.js';
import { WhatsAppIcon } from './Icons.jsx';
import { Monogram } from './Logo.jsx';

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-wine-800 bg-lattice">
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-gold-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-wine-500/40 blur-3xl" />
      <div className="container-x relative flex flex-col items-center py-20 text-center lg:py-24">
        <Monogram light className="h-16 w-16" />
        <p className="mt-6 font-script text-[2.6rem] leading-tight text-gold-300 sm:text-6xl">{business.closingLine}</p>
        <p className="mt-5 max-w-xl text-lg text-ivory-100/80">
          Planning an introduction, engagement or wedding? Tell us your date and what you need, and we will get everything ready.
        </p>
        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-whatsapp">
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
          <a href={business.phoneHref} className="btn-outline-light">
            <Phone className="h-4 w-4" /> {business.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
