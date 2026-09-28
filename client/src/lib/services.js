import {
  CakeSlice,
  Crown,
  Flower2,
  Gem,
  Mic,
  MicVocal,
  ScrollText,
  Shirt,
  ShoppingBasket,
  Sparkles,
  Watch,
} from 'lucide-react';

/** Icon for each service slug (services themselves come from the API). */
export const serviceIcons = {
  'alaga-ijoko': MicVocal,
  'alaga-iduro': Mic,
  decorations: Flower2,
  'asooke-sales': Sparkles,
  'jewelry-and-wrist-watches': Watch,
  'beads-made-and-sold': Gem,
  'bridal-materials': ShoppingBasket,
  'proposal-and-acceptance-letters': ScrollText,
  'attire-rental': Shirt,
  cakes: CakeSlice,
  'bridal-accessories': Crown,
};

export const iconFor = (slug) => serviceIcons[slug] || Sparkles;

/**
 * The services printed on the business flyer. Shown only if the API can't be
 * reached, so the marketing pages never render empty. The live list is
 * managed in the admin dashboard (seeded by `npm run seed`).
 */
export const fallbackServices = [
  { slug: 'alaga-ijoko', title: 'Alaga Ijoko', summary: "A seasoned seated compere to speak for the bride's family at your traditional engagement." },
  { slug: 'alaga-iduro', title: 'Alaga Iduro', summary: "A lively standing compere to lead the groom's family with grace and good humour." },
  { slug: 'decorations', title: 'Decorations', summary: 'Engagement, wedding and event décor, from stage backdrops to eru iyawo displays.', items: ['Stage & backdrop', 'Eru iyawo display', 'Table settings', 'Florals'] },
  { slug: 'asooke-sales', title: 'Asooke Sales', summary: 'Hand-woven Asooke for brides, grooms and families: classic and new designs.', items: ['Old designs', 'New designs', 'Family & aso ebi orders'] },
  { slug: 'jewelry-and-wrist-watches', title: 'Jewelry & Wrist Watches', summary: 'Statement jewelry and quality wrist watches for him and for her.', items: ['Jewelry sets', "Men's watches", "Women's watches"] },
  { slug: 'beads-made-and-sold', title: 'Beads: Made & Sold', summary: 'Traditional beads made by hand, alongside a collection of old and new pieces.', items: ['Necklaces', 'Bracelets', 'Bead crowns', 'Custom pieces'] },
  { slug: 'bridal-materials', title: 'Bridal Materials', summary: 'Everything the bride needs on the day: baskets, hand fans, veils, ribbons and more.', items: ['Baskets', 'Hand fans', 'Veils', 'Ribbons'] },
  { slug: 'proposal-and-acceptance-letters', title: 'Proposal & Acceptance Letters', summary: 'Beautifully presented proposal and acceptance letters for your engagement.' },
  { slug: 'attire-rental', title: 'Attire Rental', summary: 'Rent traditional attire for your ceremony: Sanmiyan, Etu, Alaari, Petuje and Akun.', items: ['Sanmiyan', 'Etu', 'Alaari', 'Petuje', 'Akun'] },
  { slug: 'cakes', title: 'Cakes', summary: 'Elegant wedding, engagement and celebration cakes.' },
  { slug: 'bridal-accessories', title: 'Bridal Accessories', summary: 'The finishing touches: fans, purses, head pieces and more.' },
];

export const PRODUCT_CATEGORIES = [
  'Asooke',
  'Jewelry',
  'Wrist Watches',
  'Beads',
  'Bridal Materials',
  'Bridal Accessories',
  'Attire Rental',
  'Proposal & Acceptance Letters',
  'Grooms Accessories',
  'Cakes',
  'Decorations',
  'Other',
];

export const AVAILABILITY = {
  available: { label: 'Available', tone: 'bg-emerald-50 text-emerald-800 ring-emerald-700/15' },
  for_rent: { label: 'For rent', tone: 'bg-gold-100 text-gold-700 ring-gold-600/20' },
  made_to_order: { label: 'Made to order', tone: 'bg-wine-50 text-wine-700 ring-wine-600/15' },
  out_of_stock: { label: 'Sold out', tone: 'bg-stone-100 text-stone-600 ring-stone-500/15' },
};

export const GALLERY_CATEGORIES = [
  'Decorations',
  'Bridal',
  'Asooke',
  'Jewelry',
  'Watches',
  'Beads',
  'Cakes',
  'Attire',
  'Accessories',
  'Events',
  'Other',
];

export const formatPrice = (price) =>
  price === null || price === undefined
    ? 'Price on request'
    : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);
