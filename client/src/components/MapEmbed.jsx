import { MapPin } from 'lucide-react';
import { business, mapsEmbed, mapsLink } from '../lib/business.js';

/** Google Map of the store, with a styled fallback underneath in case the map can't load. */
export default function MapEmbed({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-ivory-200 ${className}`}>
      <div className="bg-lattice absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-wine-800 text-gold-300">
          <MapPin className="h-6 w-6" />
        </span>
        <p className="max-w-xs font-display text-lg text-wine-800">{business.address}</p>
        <a href={mapsLink} target="_blank" rel="noreferrer" className="text-sm font-medium text-gold-700 underline underline-offset-4">
          Open in Google Maps
        </a>
      </div>
      <iframe
        title="Map showing Akure Road, Ondo Town"
        src={mapsEmbed}
        className="relative block h-full w-full grayscale-[35%] sepia-[15%]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
