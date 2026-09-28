import { ArrowRight, ArrowUpRight, Check, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import eventDecoration from '../assets/images/event-decoration-conjugal-bliss.jpeg';
import walkingStick from '../assets/images/grooms-walking-stick-gold.jpeg';
import CtaBand from '../components/CtaBand.jsx';
import FounderSection from '../components/Founder.jsx';
import { WhatsAppIcon } from '../components/Icons.jsx';
import Ornament from '../components/Ornament.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { CardSkeletons, EmptyState } from '../components/States.jsx';
import { assetUrl } from '../lib/api.js';
import MapEmbed from '../components/MapEmbed.jsx';
import { business, mapsLink, whatsappLink } from '../lib/business.js';
import { iconFor } from '../lib/services.js';
import useApi from '../lib/useApi.js';
import useServices from '../lib/useServices.js';

const marqueeItems = [
  'Alaga Ijoko',
  'Alaga Iduro',
  'Decorations',
  'Asooke',
  'Jewelry & Watches',
  'Beads',
  'Bridal Materials',
  'Proposal Letters',
  'Attire Rental',
  'Cakes',
  'Bridal Accessories',
];

function Hero() {
  return (
    <section className="bg-paper relative overflow-hidden">
      <div className="container-x grid items-center gap-14 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pt-16 lg:pb-24">
        <div className="animate-fade-up">
          <p className="eyebrow">Ondo Town · Traditional · Bridal · Events</p>
          <h1 className="mt-6 text-[2.55rem] leading-[1.06] font-semibold sm:text-[3.4rem] lg:text-[3.85rem] xl:text-[4.2rem]">
            Your one&#8209;stop shop for <em className="font-medium text-gold-600">traditional,</em> bridal & event essentials
          </h1>
          <p className="mt-5 font-script text-[2.1rem] leading-none text-wine-600 sm:text-[2.5rem]">{business.secondaryTagline}</p>
          <p className="mt-6 max-w-xl text-lg text-muted">
            From Alaga Ijoko and Alaga Iduro to Asooke, beads, attire rental, décor and cakes: everything for your
            introduction, engagement and wedding, under one roof.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn-primary">
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
            <a href={business.phoneHref} className="btn-outline">
              <Phone className="h-4 w-4" /> {business.phoneDisplay}
            </a>
          </div>

          <dl className="mt-11 grid max-w-lg grid-cols-3 divide-x divide-gold-500/30 border-y border-gold-500/30 py-5">
            {[
              ['11', 'services'],
              ['Sales', '& rentals'],
              ['Old', '& new pieces'],
            ].map(([big, small]) => (
              <div key={small} className="px-3 text-center first:pl-0 last:pr-0">
                <dt className="font-display text-2xl font-semibold text-wine-800 sm:text-[1.7rem]">{big}</dt>
                <dd className="text-[0.8rem] tracking-wide text-muted">{small}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[29rem] animate-fade-up [animation-delay:150ms] lg:mr-0">
          <div className="arch absolute -inset-3 border border-gold-500/60 sm:-inset-4" aria-hidden="true" />
          <div className="arch relative aspect-[4/5] overflow-hidden bg-ivory-200 shadow-soft">
            <img
              src={eventDecoration}
              alt="Lilac-wrapped eru iyawo engagement items arranged on gold stands under a 'Conjugal Bliss' backdrop"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine-950/55 via-transparent to-transparent" />
            <p className="absolute right-6 bottom-6 text-right text-[0.68rem] tracking-[0.32em] text-ivory-50/90 uppercase">
              Eru Iyawo · Décor by us
            </p>
          </div>

          <div className="absolute -bottom-8 left-0 w-32 rotate-[-4deg] rounded-2xl bg-ivory-50 p-2 shadow-soft ring-1 ring-gold-500/30 sm:-left-10 sm:w-40">
            <img src={walkingStick} alt="Gold-headed groom's walking stick" className="aspect-[3/4] w-full rounded-xl object-cover object-top" />
            <p className="px-1 pt-2 pb-1 text-center font-display text-[0.8rem] text-wine-800 italic">Groom's walking stick</p>
          </div>

          <div className="absolute top-10 right-0 rounded-2xl bg-wine-800 px-4 py-3 text-ivory-50 shadow-soft sm:-right-8">
            <p className="font-script text-2xl leading-none text-gold-300">Bridal</p>
            <p className="mt-1 text-[0.7rem] tracking-[0.25em] uppercase">Essentials</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="overflow-hidden border-y border-gold-500/40 bg-wine-900 py-4" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <span key={i} className="flex items-center font-display text-lg text-ivory-100 italic">
            <span className="px-6">{item}</span>
            <span className="text-sm text-gold-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesList() {
  const { services, loading } = useServices();

  return (
    <section className="bg-ivory-50 py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Our services"
            title="Everything for your big day, under one roof"
            intro="One trusted house for the ceremony, the look and the celebration. Pick a single item or let us handle it all."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services" className="btn-primary">
              Explore services <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Make an enquiry
            </Link>
          </div>
        </div>

        <ol className="divide-y divide-gold-500/25 border-y border-gold-500/25">
          {loading && !services.length
            ? Array.from({ length: 6 }, (_, i) => <li key={i} className="h-20 animate-pulse bg-ivory-100/70" />)
            : services.map((service, i) => {
                const Icon = iconFor(service.slug);
                return (
                  <li key={service.slug}>
                    <Link
                      to={`/services#${service.slug}`}
                      className="group grid grid-cols-[2.6rem_1fr_auto] items-center gap-4 py-5 transition sm:grid-cols-[3.2rem_3rem_1fr_auto] sm:gap-5"
                    >
                      <span className="font-display text-[1.6rem] text-gold-500 transition group-hover:text-gold-600 sm:text-3xl">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="hidden h-12 w-12 place-items-center rounded-full bg-ivory-100 text-wine-700 ring-1 ring-gold-500/30 transition group-hover:bg-wine-800 group-hover:text-gold-300 sm:grid">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <span>
                        <span className="block font-display text-[1.25rem] leading-snug font-semibold text-wine-800 sm:text-[1.35rem]">{service.title}</span>
                        <span className="mt-0.5 block text-[0.95rem] leading-snug text-muted">{service.summary}</span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-gold-500 opacity-40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                );
              })}
        </ol>
      </div>
    </section>
  );
}

function EngagementFeature() {
  const points = [
    'Alaga Ijoko & Alaga Iduro to anchor the ceremony',
    'Eru iyawo packaging, arrangement & display',
    'Proposal and acceptance letters, beautifully presented',
    'Asooke, beads and attire rental for the couple and family',
  ];
  return (
    <section className="relative overflow-hidden bg-ivory-100 py-20 lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 mx-auto w-full max-w-md lg:order-1">
          <div className="absolute -top-5 -left-5 h-40 w-40 rounded-full bg-gold-300/40 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-t-[12rem] rounded-b-3xl border-[6px] border-ivory-50 shadow-soft">
            <img
              src={eventDecoration}
              alt="Engagement display prepared by Madam No Case Ventures"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-[30%_60%]"
            />
          </div>
          <div className="absolute -right-4 -bottom-6 max-w-[14rem] rounded-2xl bg-white p-5 shadow-card ring-1 ring-gold-500/20 sm:-right-10">
            <p className="font-display text-lg leading-snug font-semibold text-wine-800">"Conjugal Bliss"</p>
            <p className="mt-1 text-sm text-muted">An eru iyawo display from the groom's family, styled by our team.</p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Introduction & engagement"
            title="We take care of the traditions, so your family can enjoy the day"
            intro="A Yoruba engagement has many moving parts. We bring the people, the materials and the finishing touches together, so every rite flows beautifully."
          />
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3.5">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-wine-800 text-gold-300">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="text-[1.02rem]">{point}</span>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink('Hello Madam No Case, I would like to plan an engagement ceremony. Our date is ...')}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-10"
          >
            Plan your engagement <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { data, loading, error } = useApi('/products?featured=true&limit=8');

  return (
    <section className="bg-ivory-50 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="From our shop"
          title="Featured pieces"
          intro="A few of the items available in store now. Send us a message for prices, more designs and availability."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading && <CardSkeletons count={8} />}
          {!loading && error && (
            <EmptyState title="Our catalogue is loading slowly">
              Please <Link to="/contact" className="text-wine-700 underline">contact us</Link> for the latest pieces.
            </EmptyState>
          )}
          {!loading && !error && !data?.length && <EmptyState title="New pieces are coming soon" />}
          {data?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/products" className="btn-outline">
            Browse all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GroomSpotlight() {
  return (
    <section className="on-dark relative overflow-hidden bg-wine-900 bg-lattice py-20 lg:py-24">
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full bg-gold-400/15 blur-3xl" />
      <div className="container-x relative grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="relative mx-auto w-64 sm:w-72">
          <div className="absolute -inset-3 rounded-[2.5rem] border border-gold-400/40" aria-hidden="true" />
          <img
            src={walkingStick}
            alt="Ornate gold-headed walking stick with a black shaft"
            loading="lazy"
            className="aspect-[3/4.4] w-full rounded-[2rem] object-cover object-top shadow-2xl"
          />
        </div>
        <div className="text-center md:text-left">
          <p className="eyebrow">For the groom</p>
          <h2 className="mt-4 text-[2.3rem] font-semibold text-ivory-50 sm:text-5xl">
            The Groom's <span className="gold-text italic">Walking Stick</span>
          </h2>
          <Ornament light className="mt-6 justify-center md:justify-start" />
          <p className="mt-6 max-w-xl text-lg text-ivory-100/80 md:max-w-lg">
            An ornate gold-headed walking stick: the regal finishing touch the groom carries with pride on his
            traditional day. Pair it with Asooke, beads and a statement watch from our collection.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <a
              href={whatsappLink("Hello Madam No Case, is the groom's gold walking stick available?")}
              target="_blank"
              rel="noreferrer"
              className="btn-gold"
            >
              <WhatsAppIcon /> Ask about availability
            </a>
            <Link to="/products" className="btn-outline-light">
              See more for him
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  const { data } = useApi('/gallery');
  const images = (data || []).slice(0, 9);
  if (images.length < 3) return null;

  return (
    <section className="bg-ivory-50 py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading align="left" eyebrow="Gallery" title="Moments & pieces we have styled" />
          <Link to="/gallery" className="btn-outline shrink-0">
            View full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] sm:gap-5 md:grid-cols-4">
          {images.map((img, i) => (
            <Link
              key={img._id}
              to="/gallery"
              className={`group relative overflow-hidden rounded-2xl bg-ivory-200 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <img
                src={assetUrl(img.image)}
                alt={img.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-wine-950/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="absolute bottom-3 left-4 font-display text-ivory-50 opacity-0 transition group-hover:opacity-100">{img.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisitUs() {
  const steps = [
    ['Reach out', 'Call, WhatsApp or send an enquiry with your date and needs.'],
    ['Choose', 'Visit the store or pick from photos: sales, rentals and custom orders.'],
    ['Celebrate', 'Everything is ready for your day, just as you planned.'],
  ];
  return (
    <section className="bg-ivory-100 py-20 lg:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading align="left" eyebrow="Visit us" title="Come and see us in Ondo Town" />
          <ol className="mt-10 space-y-6">
            {steps.map(([title, text], i) => (
              <li key={title} className="flex gap-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-500/50 font-display text-lg text-gold-600">{i + 1}</span>
                <div>
                  <p className="font-display text-xl font-semibold text-wine-800">{title}</p>
                  <p className="text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 space-y-3 rounded-2xl bg-white p-6 shadow-card ring-1 ring-gold-500/15">
            <a href={mapsLink} target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-wine-700">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-600" /> {business.address}
            </a>
            <a href={business.phoneHref} className="flex items-center gap-3 hover:text-wine-700">
              <Phone className="h-5 w-5 shrink-0 text-gold-600" /> {business.phoneDisplay}
            </a>
            <a href={`mailto:${business.email}`} className="flex items-center gap-3 break-all hover:text-wine-700">
              <Mail className="h-5 w-5 shrink-0 text-gold-600" /> {business.email}
            </a>
          </div>
        </div>
        <MapEmbed className="min-h-[22rem] rounded-[1.75rem] shadow-soft ring-1 ring-gold-500/25" />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <ServicesList />
      <EngagementFeature />
      <FounderSection />
      <FeaturedProducts />
      <GroomSpotlight />
      <GalleryPreview />
      <VisitUs />
      <CtaBand />
    </>
  );
}
