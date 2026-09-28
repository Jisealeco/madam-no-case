import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { business } from '../lib/business.js';
import Logo from './Logo.jsx';

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-ivory-50/92 shadow-[0_1px_0_rgb(196_154_69/0.3)] backdrop-blur-md' : 'bg-ivory-50'
      }`}
    >
      <div className="hidden bg-wine-900 text-[0.8rem] text-ivory-100/85 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <p className="tracking-wide">
            <span className="text-gold-300">✦</span>&nbsp; {business.secondaryTagline}: Ondo Town, Ondo State
          </p>
          <div className="flex items-center gap-6">
            <a href={business.phoneHref} className="transition hover:text-gold-300">
              {business.phoneDisplay}
            </a>
            <a href={`mailto:${business.email}`} className="transition hover:text-gold-300">
              {business.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative px-3.5 py-2 text-[0.95rem] tracking-wide transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold-500 after:transition-transform after:duration-300 ${
                  isActive ? 'text-wine-800 after:scale-x-100' : 'text-ink/75 after:scale-x-0 hover:text-wine-800 hover:after:scale-x-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={business.phoneHref} className="btn-primary hidden !px-5 !py-2.5 text-sm lg:inline-flex">
            <Phone className="h-4 w-4" /> Call Us
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-wine-800/15 text-wine-800 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[4.5rem] bottom-0 md:top-[6.75rem] z-40 overflow-y-auto bg-wine-900 bg-lattice transition-all duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="container-x flex flex-col py-8" aria-label="Mobile">
          {navLinks.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
              className={({ isActive }) =>
                `flex items-center justify-between border-b border-gold-300/15 py-4 font-display text-2xl transition-all duration-300 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                } ${isActive ? 'text-gold-300' : 'text-ivory-50'}`
              }
            >
              {link.label}
              <span className="text-sm text-gold-400/60">0{i + 1}</span>
            </NavLink>
          ))}
          <div className="mt-10 space-y-2 text-ivory-100/80">
            <p className="font-script text-3xl text-gold-300">{business.secondaryTagline}</p>
            <p className="text-sm">{business.address}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
