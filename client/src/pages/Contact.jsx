import { Mail, MapPin, Phone } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ContactForm from '../components/ContactForm.jsx';
import { WhatsAppIcon } from '../components/Icons.jsx';
import PageHero from '../components/PageHero.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import { business, mapsLink, whatsappLink } from '../lib/business.js';
import useServices from '../lib/useServices.js';

const channels = [
  { icon: Phone, label: 'Call us', value: business.phoneDisplay, href: business.phoneHref },
  { icon: WhatsAppIcon, label: 'WhatsApp', value: 'Chat with us now', href: whatsappLink(), external: true },
  { icon: Mail, label: 'Email', value: business.email, href: `mailto:${business.email}` },
  { icon: MapPin, label: 'Visit the store', value: business.address, href: mapsLink, external: true },
];

export default function Contact() {
  const { services } = useServices();
  const [params] = useSearchParams();
  const preselected = params.get('service') || '';

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        intro="Tell us about your ceremony or what you are looking for. Call or WhatsApp for the fastest response, or send the form below."
      />

      <section className="bg-paper py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <p className="eyebrow">Reach us directly</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">We'd love to hear about your day</h2>
            <ul className="mt-8 space-y-3.5">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-gold-500/15 transition hover:-translate-y-0.5 hover:ring-gold-500/50 sm:p-5"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-wine-800 text-gold-300 transition group-hover:bg-gold-400 group-hover:text-wine-900">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.72rem] font-medium tracking-[0.24em] text-gold-600 uppercase">{label}</span>
                      <span className="block break-words text-[1.02rem] text-ink">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* key resets the form's default service if the query string changes */}
            <ContactForm key={preselected} services={services} defaultService={preselected} />
          </div>
        </div>
      </section>

      <MapEmbed className="h-[24rem]" />
    </>
  );
}
