import React from 'react';
import { Users, Star, Award, Scissors, Calendar, Sparkles } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const BarbersRow: React.FC = () => {
  const { barbers, openBookingModal } = useBarber();

  const activeBarbers = barbers.filter((b) => b.active !== false && b.available !== false);
  const displayBarbers = activeBarbers.length > 0 ? activeBarbers : barbers;

  return (
    <div className="flex flex-col text-left space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Nuestro Equipo de Barberos
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Maestros del corte y afeitado tradicional con más de una década de experiencia combinada.
          </p>
        </div>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayBarbers.slice(0, 4).map((barber) => (
          <div
            key={barber.id}
            className="bg-[#111722] dark:bg-[#0e141d] border border-[#1f2838] hover:border-amber-500/40 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all duration-200 group"
          >
            <div>
              {/* Photo */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-amber-500/90 text-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-black" />
                    <span>{barber.rating}</span>
                  </span>
                  <span className="text-[10px] font-bold bg-black/60 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded-md border border-white/10">
                    {barber.experienceYears} años exp.
                  </span>
                </div>
              </div>

              {/* Name & Specialty */}
              <h3 className="font-bold text-base text-white truncate">{barber.name}</h3>
              <p className="text-xs text-amber-400/90 font-medium truncate mt-0.5">{barber.role}</p>
              <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                {barber.specialty}
              </p>
            </div>

            {/* Book with this Barber button */}
            <button
              onClick={() => openBookingModal({ barberId: barber.id })}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-[#16202e] hover:bg-amber-500 hover:text-black text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700/80 hover:border-amber-500 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reservar con {barber.name.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
