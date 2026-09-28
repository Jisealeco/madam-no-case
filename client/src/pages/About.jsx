import { ArrowRight, Gem, HeartHandshake, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import CtaBand from '../components/CtaBand.jsx';
import { FounderPortrait, FounderQuote } from '../components/Founder.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { business } from '../lib/business.js';
import { iconFor } from '../lib/services.js';
import useServices from '../lib/useServices.js';

const values = [
  {
    icon: Gem,
    title: 'Quality products',
    text: 'Asooke, beads, jewelry and accessories chosen with care, with both classic old pieces and fresh new designs.',
  },
  {
    icon: HeartHandshake,
    title: 'Excellent service',
    text: 'Friendly, attentive help from your first question to your big day. Call, WhatsApp or visit the store.',
  },
  {
    icon: Landmark,
    title: 'Tradition, done right',
    text: 'From the Alaga to the proposal letter, we understand the rites and help every part of the ceremony flow.',
  },
];

export default function About() {
  const { services } = useServices();

  return (
    <>
      <PageHero eyebrow="Our story" title="About Madam No Case" intro={business.tagline} />

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <FounderPortrait />
          <div>
            <SectionHeading align="left" eyebrow="Meet the founder" title="No case, no wahala: just beautiful celebrations" />
            <FounderQuote className="mt-8" />
            <div className="mt-8 space-y-5 text-[1.05rem] text-muted">
              <p>
                Founded by <strong className="font-medium text-wine-800">{business.founder.name}</strong>,{' '}
                <strong className="font-medium text-wine-800">{business.name}</strong> is a one-stop shop in Ondo Town for
                everything traditional, bridal and celebratory. We bring together the people, the fabrics, the finishing
                touches and the décor that make a Yoruba introduction, engagement or wedding feel complete.
              </p>
              <p>
                Families come to us for an Alaga Ijoko or Alaga Iduro to anchor their ceremony, for Asooke and beads (old and
                new), for attire to rent, for bridal baskets, fans, veils and ribbons, and for the proposal and acceptance
                letters that open the day. We also make cakes and style event spaces.
              </p>
              <p>
                Our promise is simple and printed on everything we do:{' '}
                <span className="font-script text-2xl whitespace-nowrap text-wine-700">{business.secondaryTagline}</span>.
              </p>
            </div>
            <Link to="/contact" className="btn-primary mt-9">
              Talk to us about your event <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ivory-100 py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What we stand for" title="Why families choose us" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[1.6rem] bg-white p-8 text-center shadow-card ring-1 ring-gold-500/15">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b from-gold-200 to-gold-400 text-wine-800">
                  <Icon className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory-50 py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Under one roof" title="Everything we offer" />
          <ul className="mx-auto mt-12 grid max-w-5xl gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = iconFor(service.slug);
              return (
                <li key={service.slug}>
                  <Link to={`/services#${service.slug}`} className="group flex items-center gap-3.5 rounded-xl py-2 transition hover:text-wine-700">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ivory-100 text-wine-700 ring-1 ring-gold-500/30 transition group-hover:bg-wine-800 group-hover:text-gold-300">
                      <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.7} />
                    </span>
                    <span className="font-display text-lg">{service.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
