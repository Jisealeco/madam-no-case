import { ImageOff } from 'lucide-react';
import { assetUrl } from '../lib/api.js';
import { whatsappLink } from '../lib/business.js';
import { AVAILABILITY, formatPrice } from '../lib/services.js';
import { WhatsAppIcon } from './Icons.jsx';

export default function ProductCard({ product }) {
  const status = AVAILABILITY[product.availability] || AVAILABILITY.available;
  const enquiry = whatsappLink(
    `Hello Madam No Case, I'm interested in the "${product.name}"${product.price != null ? ` (${formatPrice(product.price)})` : ''}. Is it available?`
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.4rem] bg-white shadow-card ring-1 ring-gold-500/15 transition duration-500 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100">
        {product.image ? (
          <img
            src={assetUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center text-gold-500">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[0.72rem] font-medium tracking-wide ring-1 backdrop-blur ${status.tone}`}>
          {status.label}
        </span>
        {product.featured && (
          <span className="absolute top-4 right-4 rounded-full bg-wine-800/90 px-3 py-1 text-[0.7rem] font-medium tracking-[0.18em] text-gold-200 uppercase">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[0.7rem] font-medium tracking-[0.26em] text-gold-600 uppercase">{product.category}</p>
        <h3 className="mt-2 text-[1.3rem] font-semibold">{product.name}</h3>
        {product.description && <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-muted">{product.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className={`font-display text-lg ${product.price != null ? 'font-semibold text-wine-800' : 'text-[0.95rem] text-muted italic'}`}>
            {formatPrice(product.price)}
          </p>
          <a
            href={enquiry}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#1f8f4e]/30 px-4 py-2 text-sm font-medium text-[#1a7c43] transition hover:bg-[#1f8f4e] hover:text-white"
            aria-label={`Ask about ${product.name} on WhatsApp`}
          >
            <WhatsAppIcon className="h-4 w-4" /> Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
