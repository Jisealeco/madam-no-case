/**
 * Loads the business's starting content: the 11 services from the flyer, plus
 * products and gallery images made from the business's own photos in
 * server/seed/images.
 *
 *   npm run seed
 *
 * Safe to re-run: records are matched by slug/name/title and only inserted if
 * missing, so edits made in the admin dashboard are never overwritten.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { connectDB, disconnectDB } from '../config/db.js';
import { SEED_IMAGES_DIR, UPLOADS_DIR } from '../config/paths.js';
import GalleryImage from '../models/GalleryImage.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import slugify from '../utils/slugify.js';

const services = [
  {
    title: 'Alaga Ijoko',
    summary: "A seasoned seated compere to speak for the bride's family at your traditional engagement.",
    description:
      "Our Alaga Ijoko receives the groom's family with warmth and wit, guiding every rite of the engagement: the greetings, the reading of the proposal letter, the presentation of eru iyawo and the prayers, in true Yoruba tradition.",
  },
  {
    title: 'Alaga Iduro',
    summary: "A lively standing compere to lead the groom's family with grace and good humour.",
    description:
      "The Alaga Iduro leads the groom's train from the entrance to the final blessing, handling the prostration, the requests and the playful negotiations so your family can enjoy the day.",
  },
  {
    title: 'Decorations',
    summary: 'Engagement, wedding and event décor, from stage backdrops to eru iyawo displays.',
    description:
      'We design and set up beautiful event spaces: stage and backdrop styling, table settings, floral arrangements and elegant displays of engagement items that make your photos unforgettable.',
    items: ['Stage & backdrop', 'Eru iyawo display', 'Table settings', 'Florals'],
  },
  {
    title: 'Asooke Sales',
    summary: 'Hand-woven Asooke for brides, grooms and families: classic and new designs.',
    description:
      'Choose from a wide range of Asooke, both old-school patterns and new trending designs, in colours to match your celebration. Family and aso ebi orders are welcome.',
    items: ['Old designs', 'New designs', 'Family & aso ebi orders'],
  },
  {
    title: 'Jewelry & Wrist Watches',
    summary: 'Statement jewelry and quality wrist watches for him and for her.',
    description:
      'Complete your look with elegant jewelry sets and a curated selection of wrist watches: sporty, classic and iced-out styles for the groom, the bride and guests.',
    items: ['Jewelry sets', "Men's watches", "Women's watches"],
  },
  {
    title: 'Beads: Made & Sold',
    summary: 'Traditional beads made by hand, alongside a collection of old and new pieces.',
    description:
      'We make and sell traditional beads (necklaces, bracelets and crowns) and can craft bespoke pieces to match your attire. Both vintage and new beads are available.',
    items: ['Necklaces', 'Bracelets', 'Bead crowns', 'Custom pieces'],
  },
  {
    title: 'Bridal Materials',
    summary: 'Everything the bride needs on the day: baskets, hand fans, veils, ribbons and more.',
    description:
      'Our bridal materials cover all the little essentials that make a big difference: decorated baskets, hand fans, veils, ribbons and other engagement and wedding materials.',
    items: ['Baskets', 'Hand fans', 'Veils', 'Ribbons'],
  },
  {
    title: 'Proposal & Acceptance Letters',
    summary: 'Beautifully presented proposal and acceptance letters for your engagement.',
    description:
      "Traditional proposal letters from the groom's family and acceptance letters from the bride's family, neatly written and elegantly presented, ready to be read aloud on the day.",
  },
  {
    title: 'Attire Rental',
    summary: 'Rent traditional attire for your ceremony: Sanmiyan, Etu, Alaari, Petuje and Akun.',
    description:
      'Look regal without the full cost of buying. We rent out traditional attire, both new and old, including Sanmiyan, Etu, Alaari, Petuje and Akun.',
    items: ['Sanmiyan', 'Etu', 'Alaari', 'Petuje', 'Akun'],
  },
  {
    title: 'Cakes',
    summary: 'Elegant wedding, engagement and celebration cakes.',
    description:
      'From tiered wedding cakes to engagement and birthday cakes, we deliver cakes that look as good as they taste, designed around your colours and theme.',
  },
  {
    title: 'Bridal Accessories',
    summary: 'The finishing touches: fans, purses, head pieces and more.',
    description:
      'Bridal accessories that complete the look, including hand fans, purses, head pieces and other elegant pieces for the bride and her entourage.',
  },
].map((service, index) => ({ ...service, slug: slugify(service.title), order: index + 1, isActive: true }));

const products = [
  {
    name: "Gold Groom's Walking Stick",
    description:
      'A regal walking stick with an ornate gold-tone head and a black shaft, the classic finishing touch for the groom on his traditional engagement day.',
    category: 'Grooms Accessories',
    availability: 'available',
    featured: true,
    photo: 'grooms-walking-stick-gold.jpeg',
  },
  {
    name: 'Iced Bezel Blue Dial Watch',
    description: 'A stone-set silver case with a deep blue sunburst dial and a blue leather strap. Bold and glamorous.',
    category: 'Wrist Watches',
    availability: 'available',
    featured: true,
    photo: 'watch-iced-blue-dial.jpeg',
  },
  {
    name: 'Silver Skeleton Dial Watch',
    description: 'A sculpted silver case with an open skeleton dial showing the movement, on a black rubber strap.',
    category: 'Wrist Watches',
    availability: 'available',
    featured: false,
    photo: 'watch-skeleton-silver.jpeg',
  },
  {
    name: 'Dual Time Black Leather Watch',
    description: 'A rugged square black case with two dials and a mini compass, on a stitched black leather strap.',
    category: 'Wrist Watches',
    availability: 'available',
    featured: false,
    photo: 'watch-dual-time-black.jpeg',
  },
  {
    name: 'Blue Chronograph Sport Watch',
    description: 'A sporty chronograph with a vivid blue dial and three sub-dials, on a soft black silicone strap.',
    category: 'Wrist Watches',
    availability: 'available',
    featured: true,
    photo: 'watch-chronograph-blue.jpeg',
  },
  // Bridal, beads, Asooke and engagement pieces. The featured ones appear on the home page.
  {
    name: 'Coral & Gold Bridal Bead Set',
    description: 'Two-strand coral bead necklace with gold-tone accent beads, with matching earrings and bracelet: a classic set for the bride.',
    category: 'Beads',
    availability: 'available',
    featured: true,
    photo: 'coral-gold-bridal-bead-set.jpeg',
  },
  {
    name: 'Pink Velvet Jewelled Hand Fan',
    description: 'A blush-pink velvet bridal hand fan, richly decorated with gold stones and a jewelled trim.',
    category: 'Bridal Accessories',
    availability: 'available',
    featured: true,
    photo: 'pink-velvet-jewelled-hand-fan.jpeg',
  },
  {
    name: 'Ivory Rose Bridal Bouquet',
    description: 'A full bridal bouquet of ivory roses with soft greenery and a satin-wrapped handle.',
    category: 'Bridal Materials',
    availability: 'available',
    featured: true,
    photo: 'ivory-rose-bridal-bouquet.jpeg',
  },
  {
    name: 'Gold Wedding Ring Set',
    description: "His and hers gold-tone wedding bands with a stone-set engagement ring, presented in a velvet ring box.",
    category: 'Jewelry',
    availability: 'available',
    featured: true,
    photo: 'gold-wedding-ring-set.jpeg',
  },
  {
    name: 'Magenta & Lime Asooke',
    description: 'Rich magenta Asooke with a bold lime stripe and fine white lines: a bright, joyful choice for the celebration.',
    category: 'Asooke',
    availability: 'available',
    featured: true,
    photo: 'asooke-magenta-lime.jpeg',
  },
  {
    name: 'Five-Strand Coral Bead Necklace',
    description: 'Long multi-strand coral bead necklace finished with carved focal beads, with a matching bracelet.',
    category: 'Beads',
    availability: 'available',
    featured: true,
    photo: 'coral-beads-five-strand.jpeg',
  },
  {
    name: 'Proposal & Acceptance Letters: Gold Filigree Frames',
    description: 'Marriage proposal and acceptance letters mounted in ornate gold filigree frames, ready to be presented at the engagement.',
    category: 'Proposal & Acceptance Letters',
    availability: 'available',
    featured: true,
    photo: 'proposal-acceptance-gold-filigree.jpeg',
  },
  {
    name: 'Olive Green Asooke',
    description: 'Textured olive-green Asooke with wine-coloured stripes, a rich, modern colour for the couple or the family.',
    category: 'Asooke',
    availability: 'available',
    featured: true,
    photo: 'asooke-olive-green.jpeg',
  },
  {
    name: 'Proposal & Acceptance Letters: Round Gold Plaques',
    description: 'Proposal and acceptance letters set in round, ornately embossed gold plaques with floral accents.',
    category: 'Proposal & Acceptance Letters',
    availability: 'available',
    photo: 'proposal-acceptance-round-gold.jpeg',
  },
  {
    name: 'Purple Hand Fan & Fascinator Sets',
    description: 'Matching purple hand fans with gold trim and organza fascinators, ideal for the bride and her friends.',
    category: 'Bridal Accessories',
    availability: 'available',
    photo: 'purple-hand-fans-fascinators.jpeg',
  },
  {
    name: 'White Calla Lily Cascade Bouquet',
    description: 'An elegant cascading bouquet of white calla lilies and delicate white blooms.',
    category: 'Bridal Materials',
    availability: 'available',
    photo: 'white-calla-lily-cascade-bouquet.jpeg',
  },
  {
    name: 'Navy & Sky Blue Asooke Set',
    description: 'Navy striped Asooke paired with a sky-blue textured piece, a coordinated set for gele, ipele and more.',
    category: 'Asooke',
    availability: 'available',
    photo: 'asooke-navy-sky-blue.jpeg',
  },
  {
    name: 'Navy & Blue Striped Asooke',
    description: 'Crisp navy and blue Asooke with white stripes, classic and versatile.',
    category: 'Asooke',
    availability: 'available',
    photo: 'asooke-navy-blue-stripe.jpeg',
  },
  {
    name: 'Tan & Ivory Asooke Set',
    description: 'Soft tan Asooke with ivory stripes, including a fringed textured piece: understated and elegant.',
    category: 'Asooke',
    availability: 'available',
    photo: 'asooke-tan-ivory.jpeg',
  },
  {
    name: 'Wine Asooke with Grey Stripes',
    description: 'Deep wine Asooke with grey and pale blue bands, a traditional hand-woven look.',
    category: 'Asooke',
    availability: 'available',
    photo: 'asooke-wine-grey-stripe.jpeg',
  },
  {
    name: 'Brown Asooke with Lilac Stripes',
    description: 'Rich brown Asooke with lilac and pink stripes and a subtle woven texture.',
    category: 'Asooke',
    availability: 'available',
    photo: 'asooke-brown-lilac-stripe.jpeg',
  },
];

const gallery = [
  {
    title: 'Eru Iyawo Display: Conjugal Bliss',
    caption: "Engagement items from the groom's family, wrapped in lilac and arranged for a traditional ceremony.",
    category: 'Decorations',
    photo: 'event-decoration-conjugal-bliss.jpeg',
    order: 1,
  },
  {
    title: "Groom's Gold Walking Stick",
    caption: 'Ornate gold-tone walking stick for the groom.',
    category: 'Accessories',
    photo: 'grooms-walking-stick-gold.jpeg',
    order: 2,
  },
  {
    title: 'Iced Bezel Blue Dial',
    caption: 'Stone-set watch with a deep blue dial.',
    category: 'Watches',
    photo: 'watch-iced-blue-dial.jpeg',
    order: 18,
  },
  {
    title: 'Silver Skeleton Watch',
    caption: 'Open-dial watch on a black strap.',
    category: 'Watches',
    photo: 'watch-skeleton-silver.jpeg',
    order: 19,
  },
  {
    title: 'Blue Chronograph',
    caption: 'Sport chronograph with a blue dial.',
    category: 'Watches',
    photo: 'watch-chronograph-blue.jpeg',
    order: 20,
  },
  {
    title: 'Dual Time Watch',
    caption: 'Square dual-dial watch with a compass.',
    category: 'Watches',
    photo: 'watch-dual-time-black.jpeg',
    order: 21,
  },
  { title: 'Coral & Gold Bridal Bead Set', caption: 'Coral beads with gold accents, earrings and bracelet.', category: 'Beads', photo: 'coral-gold-bridal-bead-set.jpeg', order: 2 },
  { title: 'Pink Velvet Jewelled Hand Fan', caption: 'Blush velvet hand fan with gold stones.', category: 'Accessories', photo: 'pink-velvet-jewelled-hand-fan.jpeg', order: 3 },
  { title: 'Ivory Rose Bridal Bouquet', caption: 'Ivory roses with soft greenery.', category: 'Bridal', photo: 'ivory-rose-bridal-bouquet.jpeg', order: 4 },
  { title: 'Gold Wedding Ring Set', caption: 'Wedding bands and engagement ring in a velvet box.', category: 'Jewelry', photo: 'gold-wedding-ring-set.jpeg', order: 5 },
  { title: 'Magenta & Lime Asooke', caption: 'Magenta Asooke with a lime stripe.', category: 'Asooke', photo: 'asooke-magenta-lime.jpeg', order: 6 },
  { title: 'Five-Strand Coral Beads', caption: 'Multi-strand coral necklace with carved focal beads.', category: 'Beads', photo: 'coral-beads-five-strand.jpeg', order: 7 },
  { title: 'Proposal Letters in Gold Filigree Frames', caption: 'Marriage proposal and acceptance letters, framed.', category: 'Bridal', photo: 'proposal-acceptance-gold-filigree.jpeg', order: 8 },
  { title: 'Olive Green Asooke', caption: 'Olive green with wine stripes.', category: 'Asooke', photo: 'asooke-olive-green.jpeg', order: 9 },
  { title: 'Purple Hand Fans & Fascinators', caption: 'Matching fans and fascinators for the bride and friends.', category: 'Accessories', photo: 'purple-hand-fans-fascinators.jpeg', order: 10 },
  { title: 'Round Gold Proposal Plaques', caption: 'Proposal and acceptance letters on gold plaques.', category: 'Bridal', photo: 'proposal-acceptance-round-gold.jpeg', order: 11 },
  { title: 'White Calla Lily Bouquet', caption: 'Cascading calla lily bouquet.', category: 'Bridal', photo: 'white-calla-lily-cascade-bouquet.jpeg', order: 12 },
  { title: 'Navy & Sky Blue Asooke', caption: 'Coordinated navy and sky-blue set.', category: 'Asooke', photo: 'asooke-navy-sky-blue.jpeg', order: 13 },
  { title: 'Navy & Blue Striped Asooke', caption: 'Navy and blue with white stripes.', category: 'Asooke', photo: 'asooke-navy-blue-stripe.jpeg', order: 14 },
  { title: 'Tan & Ivory Asooke', caption: 'Soft tan with ivory stripes.', category: 'Asooke', photo: 'asooke-tan-ivory.jpeg', order: 15 },
  { title: 'Wine Asooke', caption: 'Deep wine with grey bands.', category: 'Asooke', photo: 'asooke-wine-grey-stripe.jpeg', order: 16 },
  { title: 'Brown & Lilac Asooke', caption: 'Brown with lilac and pink stripes.', category: 'Asooke', photo: 'asooke-brown-lilac-stripe.jpeg', order: 17 },
];

/** Copies a seed photo into uploads/ (once) and returns its public path. */
async function publishPhoto(photo) {
  const target = `seed-${photo}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.copyFile(path.join(SEED_IMAGES_DIR, photo), path.join(UPLOADS_DIR, target));
  return `/uploads/${target}`;
}

async function upsertMissing(Model, key, docs) {
  let inserted = 0;
  for (const doc of docs) {
    const result = await Model.updateOne({ [key]: doc[key] }, { $setOnInsert: doc }, { upsert: true, runValidators: true });
    inserted += result.upsertedCount;
  }
  return inserted;
}

try {
  await connectDB();

  const serviceCount = await upsertMissing(Service, 'slug', services);

  const productDocs = [];
  for (const { photo, ...product } of products) productDocs.push({ ...product, image: await publishPhoto(photo) });
  // The shop lists newest first. Insert the original 5 pieces, then the bridal collection
  // last-to-first, so the collection shows on the site in the order written above.
  const productCount = await upsertMissing(Product, 'name', [...productDocs.slice(0, 5), ...productDocs.slice(5).reverse()]);

  const galleryDocs = [];
  for (const { photo, ...item } of gallery) galleryDocs.push({ ...item, image: await publishPhoto(photo) });
  const galleryCount = await upsertMissing(GalleryImage, 'title', galleryDocs);

  console.log(`[seed] Services added: ${serviceCount}/${services.length}`);
  console.log(`[seed] Products added: ${productCount}/${products.length}`);
  console.log(`[seed] Gallery images added: ${galleryCount}/${gallery.length}`);
  console.log('[seed] Done. Existing records were left unchanged.');
} catch (err) {
  console.error(`[seed] Failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
