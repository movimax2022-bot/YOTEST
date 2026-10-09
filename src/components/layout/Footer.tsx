import React from 'react';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { LogoEmblem } from './LogoEmblem';

export const Footer: React.FC = () => {
  const { t, setSupportModalOpen, sendPushNotification, settings } = useBarber();

  const handleWhatsApp = () => {
    const rawPhone = (settings.whatsappPhone || '34644123456').replace(/\D/g, '');
    sendPushNotification(
      `WhatsApp ${settings.shopName || 'Barbería Madrid'}`,
      'Abriendo canal directo de WhatsApp...',
      'system'
    );
    window.open(`https://wa.me/${rawPhone}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="w-full bg-[#090d13] border-t border-[#1b222d] mt-12 py-8 px-6 lg:px-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Logo & Tagline */}
        <div className="flex items-center gap-4">
          <LogoEmblem size="sm" showText={true} />
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 italic font-medium">
            {settings.tagline || t.tagline}
          </span>
        </div>

        {/* Center: Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
          <button
            onClick={() => setSupportModalOpen(true)}
            className="hover:text-amber-400 transition"
          >
            {t.terms}
          </button>
          <span>|</span>
          <button
            onClick={() => setSupportModalOpen(true)}
            className="hover:text-amber-400 transition"
          >
            {t.privacy}
          </button>
          <span>|</span>
          <button
            onClick={() => setSupportModalOpen(true)}
            className="hover:text-amber-400 transition"
          >
            {t.contact}
          </button>
        </div>

        {/* Right: Socials */}
        <div className="flex items-center gap-4">
          <a
            href={settings.instagramUrl || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-amber-400 transition p-1"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={settings.facebookUrl || 'https://facebook.com'}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-amber-400 transition p-1"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={settings.tiktokUrl || 'https://tiktok.com'}
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="hover:text-amber-400 transition p-1"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 1 0 6.34 6.34V9a8.17 8.17 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
            </svg>
          </a>
          <button
            onClick={handleWhatsApp}
            aria-label="WhatsApp"
            className="hover:text-emerald-400 transition p-1"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-600 mt-6">
        {settings.footerCopyright || `© 2026 ${settings.shopName || 'Barbería Madrid'}. Todos los derechos reservados.`}
      </div>
    </footer>
  );
};
