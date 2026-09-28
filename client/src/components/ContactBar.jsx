import { Phone } from 'lucide-react';
import { business, whatsappLink } from '../lib/business.js';
import { WhatsAppIcon } from './Icons.jsx';

/**
 * Always-visible ways to reach the business: a floating WhatsApp button on
 * larger screens, and a sticky Call / WhatsApp bar on phones.
 */
export default function ContactBar() {
  return (
    <>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group fixed right-6 bottom-6 z-30 hidden items-center gap-3 rounded-full bg-[#1f8f4e] py-3 pr-5 pl-3 text-white shadow-[0_18px_40px_-12px_rgb(31_143_78/0.6)] transition hover:-translate-y-1 md:flex"
      >
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white/15">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/20 [animation-duration:2.4s]" />
          <WhatsAppIcon className="h-6 w-6" />
        </span>
        <span className="text-[0.95rem] font-medium">Chat with us</span>
      </a>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold-300/30 bg-wine-900/97 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2.5">
          <a href={business.phoneHref} className="btn-gold !py-3 text-[0.95rem]">
            <Phone className="h-4 w-4" /> Call now
          </a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-whatsapp !py-3 text-[0.95rem]">
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
