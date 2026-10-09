import React, { useState } from 'react';
import { Scissors, User, Calendar, Clock, ChevronDown } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const QuickBookingCard: React.FC = () => {
  const { services, barbers, t, formatPrice, openBookingModal, user } = useBarber();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  // Default to user's preferred barber if set!
  const [selectedBarberId, setSelectedBarberId] = useState<string>(user.preferredBarberId || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('11:00');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    openBookingModal({
      serviceId: selectedServiceId,
      barberId: selectedBarberId || barbers[0]?.id,
      date: selectedDate,
      time: selectedTime,
    });
  };

  const timeSlots = [
    '09:30', '10:15', '11:00', '11:45', '12:30', '13:15',
    '16:00', '16:45', '17:30', '18:15', '19:00', '19:45'
  ];

  return (
    <div className="flex flex-col text-left h-full">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          {t.makeReservation}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-0.5">
          {t.reservationSubtitle}
        </p>
      </div>

      {/* Card container */}
      <form
        onSubmit={handleContinue}
        className="flex flex-col justify-between flex-1 bg-[#111722] dark:bg-[#0e141d] rounded-2xl border border-[#1f2838] p-4 sm:p-5 shadow-lg"
      >
        <div className="space-y-3.5">
          {/* 1. Servicio */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.serviceLabel}</span>
            </label>
            <div className="relative">
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full appearance-none bg-[#161e2b] border border-[#232f42] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer pr-9"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#121822] text-slate-200">
                    {s.name} ({s.duration} min) - {formatPrice(s.price)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 2. Trabajador (opcional) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.barberLabel}</span>
            </label>
            <div className="relative">
              <select
                value={selectedBarberId}
                onChange={(e) => setSelectedBarberId(e.target.value)}
                className="w-full appearance-none bg-[#161e2b] border border-[#232f42] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer pr-9"
              >
                <option value="" className="bg-[#121822] text-slate-300">
                  {t.allBarbers}
                </option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#121822] text-slate-200">
                    {b.name} ({b.rating}★ {b.id === user.preferredBarberId ? '❤ Preferido' : ''})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 3. Fecha */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.dateLabel}</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full appearance-none bg-[#161e2b] border border-[#232f42] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Hora */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.timeLabel}</span>
            </label>
            <div className="relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full appearance-none bg-[#161e2b] border border-[#232f42] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer pr-9"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time} className="bg-[#121822] text-slate-200">
                    {time} hrs
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-5 py-3 rounded-xl bg-[#e5a93c] hover:bg-[#f2b544] text-black font-extrabold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>{t.continueBtn}</span>
        </button>
      </form>
    </div>
  );
};
