import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CtaBand from '../components/CtaBand.jsx';
import { WhatsAppIcon } from '../components/Icons.jsx';
import PageHero from '../components/PageHero.jsx';
import { CardSkeletons } from '../components/States.jsx';
import { assetUrl } from '../lib/api.js';
import { whatsappLink } from '../lib/business.js';
import { iconFor } from '../lib/services.js';
import useServices from '../lib/useServices.js';

function ServiceCard({ service, index }) {
  const Icon = iconFor(service.slug);
  return (
    <article
      id={service.slug}
      className="group relative flex scroll-mt-32 flex-col overflow-hidden rounded-[1.6rem] bg-white p-7 shadow-card ring-1 ring-gold-500/15 transition duration-500 hover:-translate-y-1 hover:shadow-soft target:ring-2 target:ring-gold-500 sm:p-8"
    >
      <span className="pointer-events-none absolute -top-5 -right-1 font-display text-[6.5rem] leading-none font-bold text-ivory-200/70 transition group-hover:text-gold-100" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      {service.image ? (
        <img src={assetUrl(service.image)} alt="" className="relative -mx-7 -mt-7 mb-6 aspect-[16/9] w-[calc(100%+3.5rem)] max-w-none object-cover sm:-mx-8 sm:-mt-8 sm:w-[calc(100%+4rem)]" />
      ) : (
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-wine-800 text-gold-300 shadow-soft">
          <Icon className="h-6 w-6" strokeWidth={1.6} />
        </span>
      )}

      <h2 className="relative mt-6 text-[1.55rem] font-semibold">{service.title}</h2>
      <p className="relative mt-3 text-muted">{service.description || service.summary}</p>

      {service.items?.length > 0 && (
        <ul className="relative mt-5 flex flex-wrap gap-2">
          {service.items.map((item) => (
            <li key={item} className="rounded-full bg-ivory-100 px-3 py-1 text-[0.82rem] text-wine-700 ring-1 ring-gold-500/20">
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
        <Link
          to={`/contact?service=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center gap-2 font-medium text-wine-800 underline decoration-gold-500/60 decoration-2 underline-offset-[6px] transition hover:decoration-wine-800"
        >
          Enquire <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={whatsappLink(`Hello Madam No Case, I'd like to ask about your ${service.title} service.`)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[0.95rem] text-[#1a7c43] hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function Services() {
  const { services, loading } = useServices();
  const { hash } = useLocation();

  // Scroll to a service when arriving from a /services#slug link, once cards have rendered.
  useEffect(() => {
    if (!hash || !services.length) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, services.length]);

  return (
    <>
      <PageHero
        eyebrow="What we offer"
        title="Our Services"
        intro="Eleven services for traditional ceremonies, weddings and celebrations: sales, rentals and made-to-order pieces, all from one trusted house."
      />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {loading && !services.length ? (
            <CardSkeletons count={6} className="h-80" />
          ) : (
            <>
              {services.map((service, i) => (
                <ServiceCard key={service.slug} service={service} index={i} />
              ))}
              <article className="on-dark flex flex-col justify-center rounded-[1.6rem] bg-wine-800 bg-lattice p-8 text-center">
                <p className="eyebrow justify-center">Not sure where to start?</p>
                <h2 className="mt-4 text-[1.7rem] font-semibold text-ivory-50">Tell us your date, we'll guide you</h2>
                <p className="mt-3 text-ivory-100/75">Many families book several services together. We'll help you put the right package together.</p>
                <a href={whatsappLink('Hello Madam No Case, I need help planning my ceremony. Our date is ...')} target="_blank" rel="noreferrer" className="btn-gold mt-7 self-center">
                  <WhatsAppIcon /> Chat with us
                </a>
              </article>
            </>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
