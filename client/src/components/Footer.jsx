import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { business, mapsLink, whatsappLink } from '../lib/business.js';
import { navLinks } from './Header.jsx';
import { WhatsAppIcon } from './Icons.jsx';
import Logo from './Logo.jsx';

const footerServices = [
  'Alaga Ijoko & Alaga Iduro',
  'Decorations',
  'Asooke: old & new',
  'Beads & Jewelry',
  'Attire Rental',
  'Cakes & Bridal Accessories',
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-wine-950 bg-lattice text-ivory-100/75">
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600" />
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20">
        <div className="col-span-2 lg:col-span-1">
          <Logo light />
          <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed">{business.tagline}.</p>
          <p className="mt-4 font-script text-[1.9rem] leading-none text-gold-300">{business.secondaryTagline}</p>
        </div>

        <div>
          <h3 className="font-sans text-xs font-medium tracking-[0.3em] text-gold-300 uppercase">Explore</h3>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-medium tracking-[0.3em] text-gold-300 uppercase">Services</h3>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            {footerServices.map((s) => (
              <li key={s}>
                <Link to="/services" className="transition hover:text-gold-300">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h3 className="font-sans text-xs font-medium tracking-[0.3em] text-gold-300 uppercase">Visit or reach us</h3>
          <ul className="mt-5 space-y-4 text-[0.95rem]">
            <li>
              <a href={business.phoneHref} className="flex items-start gap-3 transition hover:text-gold-300">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-gold-400" /> {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-gold-300">
                <WhatsAppIcon className="mt-1 h-4 w-4 shrink-0 text-gold-400" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="flex items-start gap-3 break-all transition hover:text-gold-300">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-gold-400" /> {business.email}
              </a>
            </li>
            <li>
              <a href={mapsLink} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-gold-300">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-400" /> {business.address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-300/10">
        <div className="container-x flex flex-col gap-3 py-6 text-[0.82rem] text-ivory-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Ondo Town, Ondo State, Nigeria</span>
            <Link to="/admin" className="transition hover:text-gold-300">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
