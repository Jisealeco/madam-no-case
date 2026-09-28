import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import CtaBand from '../components/CtaBand.jsx';
import FilterChips from '../components/FilterChips.jsx';
import PageHero from '../components/PageHero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { CardSkeletons, EmptyState, ErrorNotice } from '../components/States.jsx';
import { whatsappLink } from '../lib/business.js';
import useApi from '../lib/useApi.js';

export default function Products() {
  const { data, loading, error, reload } = useApi('/products?limit=100');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const products = data || [];
  const categories = useMemo(() => [...new Set((data || []).map((p) => p.category))], [data]);

  const visible = products.filter((p) => {
    if (category !== 'All' && p.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
  });

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Our Products"
        intro="Asooke, beads, jewelry, wrist watches, bridal materials and accessories. Many items are priced on request, so send us a message and we will share details."
      />
      <section className="bg-paper py-14 lg:py-20">
        <div className="container-x">
          <div className="flex flex-col items-center gap-5">
            <label className="relative w-full max-w-md">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gold-600" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="field rounded-full !pl-11"
              />
            </label>
            {categories.length > 1 && <FilterChips label="Filter by category" options={categories} value={category} onChange={setCategory} />}
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && <CardSkeletons count={4} />}
            {error && <ErrorNotice error={error} onRetry={reload} />}
            {!loading && !error && visible.length === 0 && (
              <EmptyState title={products.length ? 'No products match your search' : 'New pieces are coming soon'}>
                Looking for something specific?{' '}
                <a href={whatsappLink('Hello Madam No Case, I am looking for ...')} target="_blank" rel="noreferrer" className="text-wine-700 underline">
                  Ask us on WhatsApp
                </a>
                .
              </EmptyState>
            )}
            {visible.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
