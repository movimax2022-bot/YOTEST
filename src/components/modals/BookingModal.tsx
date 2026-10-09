import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Calendar,
  Clock,
  User,
  Heart,
  CreditCard,
  Smartphone,
  Banknote,
  QrCode,
  ShieldCheck,
  Sparkles,
  Award,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { PaymentMethod, Appointment } from '../../types/barbershop';

export const BookingModal: React.FC = () => {
  const {
    bookingModalOpen,
    closeBookingModal,
    preselectedBooking,
    services,
    barbers,
    user,
    togglePreferredBarber,
    formatPrice,
    createAppointment,
    checkAvailability,
  } = useBarber();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');

  const activeServices = services.filter((s) => s.availableForBooking !== false);
  const displayServices = activeServices.length > 0 ? activeServices : services;

  // Form State
  const [serviceId, setServiceId] = useState<string>(displayServices[0]?.id || '');
  const [barberId, setBarberId] = useState<string>(user.preferredBarberId || barbers[0]?.id || '');
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>('11:00');
  const [notes, setNotes] = useState<string>('');
  const [includeMask, setIncludeMask] = useState<boolean>(false); // +€5
  const [includeWash, setIncludeWash] = useState<boolean>(false); // +€3

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvc, setCardCvc] = useState<string>('345');
  const [bizumPhone, setBizumPhone] = useState<string>(user.phone);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false);

  // Result Appointment
  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  // Sync preselected params when modal opens
  useEffect(() => {
    if (bookingModalOpen) {
      setStep('details');
      if (preselectedBooking?.serviceId) setServiceId(preselectedBooking.serviceId);
      if (preselectedBooking?.barberId) setBarberId(preselectedBooking.barberId);
      else if (user.preferredBarberId) setBarberId(user.preferredBarberId);
      if (preselectedBooking?.date) setDate(preselectedBooking.date);
      if (preselectedBooking?.time) setTime(preselectedBooking.time);
    }
  }, [bookingModalOpen, preselectedBooking, user.preferredBarberId]);

  if (!bookingModalOpen) return null;

  const selectedService = services.find((s) => s.id === serviceId) || services[0];
  const selectedBarber = barbers.find((b) => b.id === barberId) || barbers[0];

  let rawTotal = selectedService ? selectedService.price : 20;
  if (includeMask) rawTotal += 5;
  if (includeWash) rawTotal += 3;

  const pointsDiscount = useLoyaltyPoints && user.loyaltyPoints >= 100 ? 5 : 0;
  const finalTotal = Math.max(0, rawTotal - pointsDiscount);

  const timeSlots = [
    '09:30', '10:15', '11:00', '11:45', '12:30', '13:15',
    '15:30', '16:15', '17:00', '17:45', '18:30', '19:15', '20:00'
  ];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAvailability(barberId, date, time)) {
      alert('Este horario ya está ocupado por otra cita con este barbero. Por favor selecciona otra hora disponible.');
      return;
    }
    setStep('payment');
  };

  const handleConfirmBooking = () => {
    const apt = createAppointment({
      serviceId,
      barberId,
      date,
      time,
      paymentMethod,
      notes: `${notes} ${includeMask ? '[+ Mascarilla facial]' : ''} ${includeWash ? '[+ Lavado relajante]' : ''}`.trim(),
    });
    setConfirmedApt(apt);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111722] border border-[#243044] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f293a] flex items-center justify-between bg-[#0e131d]">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                onClick={() => setStep('details')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {step === 'details'
                  ? 'Reservar Cita en Barbería Madrid'
                  : step === 'payment'
                  ? 'Pasarela de Pago Segura'
                  : '¡Cita Confirmada con Éxito!'}
              </h3>
              <p className="text-xs text-amber-400 font-medium">
                {step === 'details'
                  ? 'Paso 1: Selecciona servicio, barbero y horario'
                  : step === 'payment'
                  ? 'Paso 2: Pago integrado y verificación instantánea'
                  : 'Tu ticket de acceso digital está listo'}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* STEP 1: Details */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* 1. Selecciona Servicio */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Servicio Principal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {displayServices.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        serviceId === s.id
                          ? 'bg-amber-950/30 border-amber-500 text-white shadow-md'
                          : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-xs sm:text-sm">{s.name}</p>
                          <p className="text-[11px] text-slate-400">{s.duration} min</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-amber-400 text-sm">
                        {formatPrice(s.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Selecciona Barbero */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    2. Barbero Profesional
                  </label>
                  <span className="text-[11px] text-amber-400">
                    Marca con ❤ tu barbero preferido
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {barbers.map((b) => {
                    const isPreferred = user.preferredBarberId === b.id;
                    const isSelected = barberId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setBarberId(b.id)}
                        className={`relative p-3 rounded-2xl border cursor-pointer transition flex flex-col items-center text-center ${
                          isSelected
                            ? 'bg-amber-950/30 border-amber-500 text-white'
                            : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {/* Heart Favorite button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePreferredBarber(b.id);
                          }}
                          title="Marcar como barbero preferido"
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isPreferred ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>

                        <img
                          src={b.avatar}
                          alt={b.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/30 mb-2"
                        />
                        <p className="font-bold text-xs truncate w-full">{b.name}</p>
                        <p className="text-[10px] text-amber-400 font-medium">★ {b.rating}</p>
                        {isPreferred && (
                          <span className="mt-1 text-[9px] bg-red-950/60 text-red-400 px-1.5 py-0.5 rounded-full font-bold">
                            Preferido
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Extras / Add-ons */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Tratamientos Opcionales
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      includeMask
                        ? 'bg-amber-950/20 border-amber-500 text-amber-300'
                        : 'bg-[#151c27] border-[#222d3d] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeMask}
                        onChange={(e) => setIncludeMask(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className="text-xs font-medium">Mascarilla de carbón activo</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+€5</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      includeWash
                        ? 'bg-amber-950/20 border-amber-500 text-amber-300'
                        : 'bg-[#151c27] border-[#222d3d] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeWash}
                        onChange={(e) => setIncludeWash(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className="text-xs font-medium">Lavado capilar relajante spa</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+€3</span>
                  </label>
                </div>
              </div>

              {/* 4. Fecha y Horarios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fecha</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#151c27] border border-[#222d3d] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hora</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {timeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                          time === slot
                            ? 'bg-amber-500 text-black border-amber-500 font-bold'
                            : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Notas Adicionales */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notas de Estilo o Peticiones (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Degradado medio a 0.5, toalla caliente extra en la barba..."
                  className="w-full bg-[#151c27] border border-[#222d3d] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Bottom Summary & Button */}
              <div className="pt-4 border-t border-[#1e2736] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total a pagar:</span>
                  <p className="text-2xl font-black text-amber-400 leading-none mt-0.5">
                    {formatPrice(rawTotal)}
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#e5a93c] hover:bg-[#f2b544] text-black font-extrabold text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center gap-2"
                >
                  <span>Continuar al Pago</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Order Recap Banner */}
              <div className="bg-[#151c27] border border-[#222d3d] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedService.image}
                    alt={selectedService.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedService.name}</h4>
                    <p className="text-xs text-slate-400">
                      Con {selectedBarber.name} • {date} a las {time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Subtotal</p>
                  <p className="text-base font-bold text-white">{formatPrice(rawTotal)}</p>
                </div>
              </div>

              {/* Loyalty Points Deduction Option */}
              {user.loyaltyPoints >= 100 && (
                <div className="bg-gradient-to-r from-amber-950/40 to-[#171d28] border border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-300">
                        Club VIP: Tienes {user.loyaltyPoints} Puntos
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Canjea 100 puntos y obtén un descuento directo de €5.00
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useLoyaltyPoints}
                      onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              )}

              {/* Payment Methods Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Método de Pago Integrado
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* Apple Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-black border-amber-400 text-white shadow-md'
                        : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-slate-200" />
                    <span className="font-bold text-xs">Apple Pay</span>
                    <span className="text-[10px] text-slate-400">Touch/Face ID</span>
                  </button>

                  {/* Google Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'google_pay'
                        ? 'bg-[#1a2332] border-amber-400 text-white shadow-md'
                        : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-xs">Google Pay</span>
                    <span className="text-[10px] text-slate-400">1-Tap Android</span>
                  </button>

                  {/* Tarjeta */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-[#1a2332] border-amber-400 text-white shadow-md'
                        : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-xs">Tarjeta Bancaria</span>
                    <span className="text-[10px] text-slate-400">Visa / Mastercard</span>
                  </button>

                  {/* Bizum */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bizum')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'bizum'
                        ? 'bg-[#1a2332] border-emerald-400 text-white shadow-md'
                        : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="font-black text-sm text-emerald-400">bizum</span>
                    <span className="font-bold text-xs">Bizum España</span>
                    <span className="text-[10px] text-slate-400">Pago móvil directo</span>
                  </button>

                  {/* Efectivo en mostrador */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 col-span-2 sm:col-span-1 ${
                      paymentMethod === 'cash'
                        ? 'bg-[#1a2332] border-amber-400 text-white shadow-md'
                        : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-xs">Pago en el Local</span>
                    <span className="text-[10px] text-slate-400">Efectivo / Datáfono</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs according to Payment Method */}
              {paymentMethod === 'card' && (
                <div className="bg-[#151c27] p-4 rounded-2xl border border-[#222d3d] space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#111722] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Caducidad
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#111722] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        maxLength={4}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-[#111722] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bizum' && (
                <div className="bg-[#151c27] p-4 rounded-2xl border border-[#222d3d]">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Número de Teléfono Bizum
                  </label>
                  <input
                    type="tel"
                    value={bizumPhone}
                    onChange={(e) => setBizumPhone(e.target.value)}
                    className="w-full bg-[#111722] border border-[#232f42] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <p className="text-[11px] text-emerald-400 mt-2">
                    Recibirás una notificación en tu app de banca para autorizar el cobro instantáneo.
                  </p>
                </div>
              )}

              {/* Security badges */}
              <div className="flex items-center justify-center gap-6 py-1 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cifrado SSL 256-bit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>3D Secure 2.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Garantía de Satisfacción</span>
                </div>
              </div>

              {/* Total & Confirm Button */}
              <div className="pt-4 border-t border-[#1e2736] flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total a pagar:</span>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-amber-400">
                      {formatPrice(finalTotal)}
                    </p>
                    {pointsDiscount > 0 && (
                      <span className="text-xs text-emerald-400 font-semibold line-through">
                        {formatPrice(rawTotal)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="px-7 py-3 rounded-xl bg-[#e5a93c] hover:bg-[#f2b544] text-black font-extrabold text-sm tracking-wide shadow-xl shadow-amber-500/20 active:scale-95 transition cursor-pointer"
                >
                  Pagar y Confirmar Cita
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmed Ticket */}
          {step === 'confirmed' && confirmedApt && (
            <div className="flex flex-col items-center text-center space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">¡Reserva Completada!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Hemos enviado la confirmación y el recordatorio a tu móvil por notificación push.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="w-full max-w-md bg-[#161e2b] border border-[#253245] rounded-3xl p-5 shadow-2xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                      PASE DIGITAL • BARBERÍA MADRID
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {confirmedApt.serviceName}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 bg-amber-950/60 text-amber-400 rounded-lg border border-amber-600/30">
                    {confirmedApt.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400">Cliente</span>
                    <p className="font-semibold text-white">{confirmedApt.clientName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Barbero</span>
                    <p className="font-semibold text-amber-400">{confirmedApt.barberName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Fecha</span>
                    <p className="font-semibold text-white">{confirmedApt.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Hora</span>
                    <p className="font-semibold text-white">{confirmedApt.time} hrs</p>
                  </div>
                </div>

                {/* QR Access Token */}
                <div className="p-3 bg-[#0d121a] rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-10 h-10 text-amber-400" />
                    <div>
                      <p className="text-xs font-mono font-bold text-white">
                        {confirmedApt.qrCodeToken}
                      </p>
                      <p className="text-[10px] text-slate-400">Presenta este código al llegar</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded-full border border-emerald-800/40">
                    PAGADO
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeBookingModal}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition"
                >
                  Entendido / Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
