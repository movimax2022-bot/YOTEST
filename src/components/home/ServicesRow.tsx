import React from 'react';
import { Scissors, Sparkles, Clock } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { ServiceItem } from '../../types/barbershop';

export const ServicesRow: React.FC = () => {
  const { services, t, formatPrice, openBookingModal } = useBarber();

  // Show the first 4 services matching the screenshot layout
  const displayServices = services.slice(0, 4);

  const getServiceIcon = (category: ServiceItem['category'], index: number) => {
    switch (category) {
      case 'corte':
        return <Scissors className="w-5 h-5 text-amber-400" />;
      case 'combo':
        return (
          <div className="flex items-center gap-1 text-amber-400">
            <Scissors className="w-4 h-4" />
            <span className="text-[10px] font-bold">✂💈</span>
          </div>
        );
      case 'barba':
        return (
          <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 2.21 1.79 4 4 4s4-1.79 4-4v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 14c0 1.1-.9 2-2 2s-2-.9-2-2v-1h4v1zm-2-3c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
          </svg>
        );
      default:
        return index === 3 ? (
          <Sparkles className="w-5 h-5 text-amber-400" />
        ) : (
          <Scissors className="w-5 h-5 text-amber-400" />
        );
    }
  };

  return (
    <div className="flex flex-col text-left">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          {t.ourServices}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-0.5">
          {t.servicesSubtitle}
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {displayServices.map((service, idx) => (
          <div
            key={service.id}
            className="flex flex-col justify-between bg-[#111722] dark:bg-[#0e141d] rounded-2xl border border-[#1f2838] overflow-hidden hover:border-amber-500/40 transition-all duration-200 group shadow-lg"
          >
            {/* Top Photo */}
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-900">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111722] via-transparent to-black/20" />
            </div>

            {/* Content Body */}
            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <div>
                {/* Category Icon Badge */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="p-1 rounded-md bg-amber-950/40 border border-amber-500/30">
                    {getServiceIcon(service.category, idx)}
                  </div>
                </div>

                {/* Service Name */}
                <h3 className="font-bold text-sm md:text-base text-white truncate">
                  {service.name}
                </h3>

                {/* Duration */}
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{service.duration} min</span>
                </div>

                {/* Price */}
                <div className="mt-2.5">
                  <span className="text-lg md:text-xl font-extrabold text-amber-400">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>

              {/* Reservar Button */}
              <button
                onClick={() => openBookingModal({ serviceId: service.id })}
                className="w-full mt-3.5 py-2 px-3 rounded-xl border border-amber-500/40 bg-black/30 hover:bg-amber-500 hover:text-black text-amber-400 font-semibold text-xs tracking-wider transition-all duration-150 cursor-pointer active:scale-95"
              >
                {t.reserveBtn}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
