import { useMemo, useState } from 'react';
import CtaBand from '../components/CtaBand.jsx';
import FilterChips from '../components/FilterChips.jsx';
import GalleryGrid from '../components/GalleryGrid.jsx';
import PageHero from '../components/PageHero.jsx';
import { CardSkeletons, EmptyState, ErrorNotice } from '../components/States.jsx';
import useApi from '../lib/useApi.js';

export default function Gallery() {
  const { data, loading, error, reload } = useApi('/gallery');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => [...new Set((data || []).map((img) => img.category))], [data]);
  const images = (data || []).filter((img) => category === 'All' || img.category === category);

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Gallery"
        intro="Décor we have styled and pieces from our store, from engagement displays to the finishing touches for the groom."
      />
      <section className="bg-paper py-14 lg:py-20">
        <div className="container-x">
          {categories.length > 1 && <FilterChips label="Filter gallery" options={categories} value={category} onChange={setCategory} />}
          <div className="mt-10">
            {loading && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <CardSkeletons count={6} className="aspect-square" />
              </div>
            )}
            {error && <ErrorNotice error={error} onRetry={reload} />}
            {!loading && !error && images.length === 0 && <EmptyState title="New photos are on the way" />}
            {images.length > 0 && <GalleryGrid images={images} />}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
