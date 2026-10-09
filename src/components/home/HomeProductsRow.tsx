import React from 'react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const HomeProductsRow: React.FC = () => {
  const { products, formatPrice, setActiveTab, openBookingModal } = useBarber();

  const activeProducts = products.filter((p) => p.available !== false);
  const displayProducts = activeProducts.length > 0 ? activeProducts : products;

  return (
    <div className="flex flex-col text-left space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Productos Destacados de Barbería
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Ceras mate, aceites nutritivos y lociones profesionales para el cuidado diario.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('products')}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 font-bold transition cursor-pointer"
        >
          <span>Ver catálogo completo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {displayProducts.slice(0, 4).map((prod) => (
          <div
            key={prod.id}
            className="bg-[#111722] dark:bg-[#0e141d] border border-[#1f2838] hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all duration-200 group"
          >
            {/* Image */}
            <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-extrabold bg-amber-500 text-black px-2 py-0.5 rounded-md shadow">
                  {formatPrice(prod.price)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider">
                  {prod.category}
                </span>
                <h3 className="font-bold text-sm text-white truncate mt-0.5">{prod.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <button
                onClick={() => openBookingModal()}
                className="mt-3 w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 text-xs font-bold transition border border-slate-700 hover:border-amber-500 cursor-pointer"
              >
                Apartar en Cita
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
