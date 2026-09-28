// Single source of truth for the business's contact details.
// Only this phone number is used anywhere on the site (the one on the printed flyer is outdated).
const PHONE = '+238032252023';

export const business = {
  name: 'Madam No Case Ventures',
  shortName: 'Madam No Case',
  tagline: 'Your One Stop Shop for Traditional, Bridal and Event Essentials',
  secondaryTagline: 'Quality Products & Excellent Service',
  closingLine: 'Make Your Special Moments More Beautiful with Us',
  phone: PHONE,
  phoneDisplay: PHONE,
  phoneHref: `tel:${PHONE}`,
  email: 'akinijsetoyin720@gmail.com',
  address: 'No 43 Off Akure Road, Lover Boy, Ondo Town, Ondo State',
  addressLines: ['No 43 Off Akure Road', 'Lover Boy, Ondo Town', 'Ondo State'],
  mapsQuery: 'Akure Road, Ondo Town, Ondo State, Nigeria',
  founder: {
    name: 'Oluwatoyin Akinjise',
    title: 'Founder & CEO',
    signature: 'Oluwatoyin',
    quote:
      "Every bride deserves to feel like royalty, and every family deserves a day they will remember with joy. That is why we say “no case”: bring me your date and your dreams, and leave the rest to me.",
  },
};

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`;
export const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(business.mapsQuery)}&z=14&output=embed`;

/** WhatsApp click-to-chat link with an optional pre-filled message. */
export function whatsappLink(message = `Hello ${business.shortName}, I would like to make an enquiry.`) {
  const number = business.phone.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const mailtoLink = (subject = 'Enquiry from your website') =>
  `mailto:${business.email}?subject=${encodeURIComponent(subject)}`;
