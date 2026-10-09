import React, { useState } from 'react';
import { X, Heart, Scissors, Sparkles, Filter } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const PortfolioModal: React.FC = () => {
  const {
    portfolioModalOpen,
    setPortfolioModalOpen,
    portfolio,
    openBookingModal,
    services,
  } = useBarber();

  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});

  if (!portfolioModalOpen) return null;

  const categories = ['Todos', 'Fade', 'Barba', 'Clásico', 'Hair Tattoo', 'Moderno'];

  const filteredPortfolio =
    activeCategory === 'Todos'
      ? portfolio
      : portfolio.filter((item) => item.category === activeCategory);

  const handleLike = (id: string, initialLikes: number) => {
    const isLiked = userLikedMap[id];
    setUserLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + (isLiked ? -1 : 1),
    }));
  };

  const handleRequestStyle = (cut: typeof portfolio[0]) => {
    // Map cut to matching service
    const matchingService =
      services.find(
        (s) =>
          s.name.toLowerCase().includes(cut.category.toLowerCase()) ||
          (cut.category === 'Hair Tattoo' && s.id === 'serv-4') ||
          (cut.category === 'Barba' && s.id === 'serv-3')
      ) || services[0];

    setPortfolioModalOpen(false);
    openBookingModal({
      serviceId: matchingService.id,
      barberId: cut.barberId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#101621] border border-[#232f42] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1d2737] flex items-center justify-between bg-[#0c111a]">
          <div>
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-black text-white tracking-tight">
                Portafolio de Cortes & Diseños
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspírate con los trabajos realizados por nuestros maestros barberos en Gran Vía 123
            </p>
          </div>

          <button
            onClick={() => setPortfolioModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-[#1a2332] bg-[#0f1520] flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black shadow-md font-bold'
                  : 'bg-[#16202e] text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPortfolio.map((cut) => {
            const currentLikes = likesMap[cut.id] ?? cut.likes;
            const isLiked = userLikedMap[cut.id] ?? false;

            return (
              <div
                key={cut.id}
                className="bg-[#141c28] border border-[#202b3c] rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition group flex flex-col justify-between"
              >
                {/* Photo */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    src={cut.imageUrl}
                    alt={cut.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-amber-500/30">
                    {cut.category}
                  </span>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(cut.id, cut.likes)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-red-400 transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-bold text-sm text-white">{cut.title}</h4>
                    <p className="text-[11px] text-amber-400 font-medium mt-0.5">
                      Por {cut.barberName}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {cut.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {cut.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-red-500/40 text-red-400" />
                      {currentLikes} likes
                    </span>

                    <button
                      onClick={() => handleRequestStyle(cut)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/40 font-bold text-xs tracking-wide transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pedir este corte</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
