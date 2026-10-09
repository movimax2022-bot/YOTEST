import React from 'react';
import { Play, Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const ShopInfoCard: React.FC = () => {
  const { t, setVideoModalOpen, sendPushNotification, settings } = useBarber();

  const handleWhatsApp = () => {
    const rawPhone = (settings.whatsappPhone || settings.phone || '34912345678').replace(/\D/g, '');
    sendPushNotification(
      `WhatsApp ${settings.shopName || 'Barbería Madrid'}`,
      'Conectando directamente con nuestro equipo de atención al cliente...',
      'system'
    );
    window.open(`https://wa.me/${rawPhone}`, '_blank', 'noopener,noreferrer');
  };

  const shopCoverImage =
    settings.heroWelcomeImage ||
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="flex flex-col text-left h-full">
      {/* Video Preview Card */}
      <div className="flex flex-col justify-between flex-1 bg-[#111722] dark:bg-[#0e141d] rounded-2xl border border-[#1f2838] overflow-hidden shadow-lg p-4 sm:p-5">
        {/* Video Player Thumbnail */}
        <div
          onClick={() => setVideoModalOpen(true)}
          className="relative h-36 sm:h-40 w-full rounded-xl overflow-hidden group cursor-pointer border border-[#222e40]"
        >
          <img
            src={shopCoverImage}
            alt={`Interior ${settings.shopName || 'Barbería Madrid'}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-75"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            {/* Play Button Icon */}
            <div className="w-12 h-12 rounded-full border border-white/60 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:border-amber-400 group-hover:text-amber-400 transition-all">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>

          <div className="absolute bottom-2.5 left-3 text-left">
            <h4 className="text-xs font-black text-white tracking-wider uppercase drop-shadow">
              {settings.shopName || 'BARBERÍA MADRID'}
            </h4>
            <p className="text-[10px] text-amber-300 font-medium drop-shadow">
              {settings.tagline || t.qualityStyleTrust}
            </p>
          </div>
        </div>

        {/* Contact Info List */}
        <div className="my-4 space-y-2.5 text-xs text-slate-300">
          {/* Phone */}
          <a
            href={`tel:${(settings.phone || '+34 912 345 678').replace(/\s+/g, '')}`}
            className="flex items-center gap-2.5 hover:text-amber-400 transition"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{settings.phone || '+34 912 345 678'}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${settings.email || 'info@barberiamadrid.es'}`}
            className="flex items-center gap-2.5 hover:text-amber-400 transition truncate"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{settings.email || 'info@barberiamadrid.es'}</span>
          </a>

          {/* Address */}
          <div className="flex items-center gap-2.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{settings.address || 'Calle Gran Vía 123, Madrid'}</span>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-2.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{settings.openHours || 'Lun - Sáb: 9:00 - 21:00'}</span>
          </div>
        </div>

        {/* Social Icons matching screenshot */}
        <div className="pt-3 border-t border-[#1e2736] flex items-center gap-3 text-slate-400">
          {/* Instagram */}
          <a
            href={settings.instagramUrl || 'https://instagram.com'}
            target="_blank"
            rel="noreferrer"
            aria-label={`Instagram ${settings.shopName || 'Barbería Madrid'}`}
            className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 hover:text-amber-400 transition"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Facebook */}
          <a
            href={settings.facebookUrl || 'https://facebook.com'}
            target="_blank"
            rel="noreferrer"
            aria-label={`Facebook ${settings.shopName || 'Barbería Madrid'}`}
            className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 hover:text-amber-400 transition"
          >
            <Facebook className="w-4 h-4" />
          </a>

          {/* TikTok */}
          <a
            href={settings.tiktokUrl || 'https://tiktok.com'}
            target="_blank"
            rel="noreferrer"
            aria-label={`TikTok ${settings.shopName || 'Barbería Madrid'}`}
            className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 hover:text-amber-400 transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 1 0 6.34 6.34V9a8.17 8.17 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            aria-label={`WhatsApp ${settings.shopName || 'Barbería Madrid'}`}
            className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-emerald-950/40 hover:text-emerald-400 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
