import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, AlertCircle, Search, Filter, Plus } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { Product } from '../../types/barbershop';

export const ClientProductsView: React.FC = () => {
  const { products, formatPrice, sendPushNotification, openBookingModal } = useBarber();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'todos', label: 'Todos los Productos' },
    { id: 'pomada', label: 'Pomadas & Ceras' },
    { id: 'barba', label: 'Cuidado de Barba' },
    { id: 'champu', label: 'Champús & Cuidado' },
    { id: 'accesorio', label: 'Accesorios' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'todos' ||
      p.category === selectedCategory ||
      (selectedCategory === 'pomada' && (p.category === 'pomada' || p.category === 'cera'));
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleReserveProduct = (p: Product) => {
    sendPushNotification(
      'Producto Apartado en Tienda',
      `"${p.name}" ha sido apartado para tu próxima visita en Gran Vía 123. Total: ${formatPrice(p.price)}.`,
      { type: 'promo', category: 'promos' }
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              Productos Profesionales de Barbería
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fijadores, bálsamos artesanales y aceites premium utilizados por nuestros maestros barberos en Gran Vía 123.
          </p>
        </div>

        <button
          onClick={() => openBookingModal()}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
        >
          <span>Reservar Cita + Producto</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#111722] p-3 rounded-2xl border border-[#202b3d]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'bg-[#16202e] text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full bg-[#16202e] border border-[#253245] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-[#10151f] border border-[#1f293a] rounded-3xl space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No se encontraron productos</h3>
          <p className="text-xs text-slate-400">Intenta con otro término de búsqueda o categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const inStock = p.available && p.stock > 0;

            return (
              <div
                key={p.id}
                className="bg-[#111722] border border-[#202b3d] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition group"
              >
                {/* Photo & Badge */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-transparent to-black/20" />

                  {/* Stock Availability Badge */}
                  <div className="absolute top-3 left-3">
                    {inStock ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md">
                        <Check className="w-3 h-3" /> En stock ({p.stock} uds)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-extrabold flex items-center gap-1 backdrop-blur-md">
                        <AlertCircle className="w-3 h-3" /> Agotado temporalmente
                      </span>
                    )}
                  </div>

                  {p.popular && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                      Top Ventas
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-400 transition leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Precio</span>
                      <span className="text-lg font-black text-amber-400">
                        {formatPrice(p.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReserveProduct(p)}
                      disabled={!inStock}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        inStock
                          ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{inStock ? 'Apartar en Salón' : 'Agotado'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
