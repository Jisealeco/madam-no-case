import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { assetUrl } from '../lib/api.js';

/** Masonry-style photo grid with a keyboard-accessible lightbox. */
export default function GalleryGrid({ images }) {
  const [active, setActive] = useState(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir) => setActive((i) => (i === null ? null : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, step]);

  const current = active !== null ? images[active] : null;

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-5 lg:columns-3">
        {images.map((img, i) => (
          <button
            key={img._id}
            type="button"
            onClick={() => setActive(i)}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-ivory-200 text-left sm:mb-5"
          >
            <img
              src={assetUrl(img.image)}
              alt={img.title}
              loading="lazy"
              className="w-full transition duration-700 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-wine-950/85 via-wine-950/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:p-5">
              <span className="block text-[0.65rem] tracking-[0.28em] text-gold-300 uppercase">{img.category}</span>
              <span className="mt-1 block font-display text-lg text-ivory-50">{img.title}</span>
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-wine-950/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button type="button" onClick={close} className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-ivory-50 hover:bg-white/20" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-ivory-50 hover:bg-white/20 sm:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-ivory-50 hover:bg-white/20 sm:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={assetUrl(current.image)} alt={current.title} className="mx-auto max-h-[78vh] rounded-xl object-contain" />
            <figcaption className="mt-4 text-center">
              <span className="block font-display text-xl text-ivory-50">{current.title}</span>
              {current.caption && <span className="mt-1 block text-sm text-ivory-100/70">{current.caption}</span>}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
