import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const NextAppointmentBanner: React.FC = () => {
  const { t, openBookingModal } = useBarber();

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#1f2838] bg-[#0c1017] shadow-lg flex flex-col justify-center p-6 text-left min-h-[160px] group">
      {/* Background Image of Luxury Barber Tools */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80"
          alt="Herramientas profesionales de barbería"
          className="w-full h-full object-cover object-right filter brightness-[0.35] group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e14] via-[#0a0e14]/85 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-sm">
        <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
          {t.nextAppointmentWaits}
        </h3>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          {t.nextAppointmentDesc}
        </p>

        <div className="mt-4">
          <button
            onClick={() => openBookingModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e5a93c] hover:bg-[#f2b544] text-black font-extrabold text-xs tracking-wider shadow-md hover:shadow-amber-500/20 active:scale-95 transition cursor-pointer"
          >
            <span>{t.bookNow}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
