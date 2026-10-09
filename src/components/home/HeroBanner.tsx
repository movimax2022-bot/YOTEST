import React from 'react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const HeroBanner: React.FC = () => {
  const { t, openBookingModal, settings, setActiveTab } = useBarber();

  const handleCtaClick = () => {
    if (settings.heroCtaLink === 'services') {
      setActiveTab('services');
    } else {
      openBookingModal();
    }
  };

  const handleSecondaryCtaClick = () => {
    if (settings.heroSecondaryCtaLink === 'book') {
      openBookingModal();
    } else {
      setActiveTab('services');
    }
  };

  return (
    <section className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-[#222a36] shadow-2xl bg-[#0d121a]">
      {/* Background with Dark Atmospheric Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroWelcomeImage || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=85'}
          alt={`${settings.shopName || 'Barbería Madrid'} ambiente`}
          className="w-full h-full object-cover object-right md:object-center filter brightness-[0.45] contrast-125 transition-all duration-700"
        />
        {/* Cinematic gradients matching screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090d14] via-[#090d14]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-transparent to-[#090d14]/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left Column: Welcome, Title, Description, CTA */}
        <div className="max-w-xl text-left">
          {/* Gold Shears Emblem or Custom Logo */}
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            {settings.customLogoUrl ? (
              <img
                src={settings.customLogoUrl}
                alt={settings.shopName || 'Logo'}
                className="w-9 h-9 rounded-xl object-contain ring-2 ring-amber-400/50 shadow-lg"
              />
            ) : (
              <svg
                width="36"
                height="36"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]"
              >
                <path
                  d="M12 36C12 38.2 13.8 40 16 40C18.2 40 20 38.2 20 36C20 33.8 18.2 32 16 32C13.8 32 12 33.8 12 36ZM20 34L36 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M36 36C36 38.2 34.2 40 32 40C29.8 40 28 38.2 28 36C28 33.8 29.8 32 32 32C34.2 32 36 33.8 36 36ZM28 34L12 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="24" cy="22" r="3" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
                <path d="M20 14L28 14" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            <span className="text-xs md:text-sm tracking-[0.25em] font-semibold text-amber-400 uppercase">
              {settings.heroBadgeText || t.welcome}
            </span>
          </div>

          {/* Large Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
            {settings.heroTitle || settings.shopName || 'BARBERÍA MADRID'}
          </h1>

          {/* Tagline */}
          <p className="text-amber-400/95 font-medium text-lg sm:text-xl mt-1 tracking-wide">
            {settings.tagline || t.tagline}
          </p>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed max-w-lg">
            {settings.heroSubtitle || t.heroDesc}
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#e5a93c] hover:bg-[#f5b849] text-black font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              <span>{settings.heroCtaText || t.bookAppointment}</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            {settings.heroSecondaryCtaText && (
              <button
                onClick={handleSecondaryCtaClick}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm tracking-wide border border-slate-700/80 transition-all cursor-pointer"
              >
                <span>{settings.heroSecondaryCtaText}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: "Cuidamos tu estilo" script calligraphy overlay */}
        <div className="hidden lg:flex flex-col items-center justify-center text-right pr-6 self-center select-none">
          <div className="relative p-6">
            <Sparkles className="absolute -top-1 right-2 w-6 h-6 text-amber-300 animate-pulse" />
            <span className="font-script text-5xl xl:text-6xl text-amber-100/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] tracking-wide">
              {t.careYourStyle}
            </span>
            <div className="flex justify-end mt-2 pr-2">
              <span className="text-amber-400 text-2xl font-serif">✦</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
