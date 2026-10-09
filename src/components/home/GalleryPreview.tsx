import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const GalleryPreview: React.FC = () => {
  const { t, setPortfolioModalOpen, portfolio } = useBarber();

  const fallbackImages = [
    {
      url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80',
      alt: 'Sillones de piel clásicos Barbería Madrid',
    },
    {
      url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80',
      alt: 'Diseño freestyle degrade',
    },
    {
      url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80',
      alt: 'Corte y barba perfilada',
    },
    {
      url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=400&q=80',
      alt: 'Maestro barbero en acción',
    },
  ];

  const displayImages =
    portfolio && portfolio.length > 0
      ? portfolio.slice(0, 4).map((p) => ({ url: p.imageUrl, alt: p.title }))
      : fallbackImages;

  return (
    <div className="flex flex-col text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
          {t.ourGallery}
        </h3>
        <button
          onClick={() => setPortfolioModalOpen(true)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 font-semibold transition cursor-pointer"
        >
          <span>{t.seeMore}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Thumbnails */}
      <div className="grid grid-cols-4 gap-2.5">
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setPortfolioModalOpen(true)}
            className="group relative h-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer border border-[#1f2838] bg-slate-900 shadow-md"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};
