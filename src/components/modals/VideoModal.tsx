import React from 'react';
import { X, Volume2, Star, Sparkles } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const VideoModal: React.FC = () => {
  const { videoModalOpen, setVideoModalOpen, settings } = useBarber();

  if (!videoModalOpen) return null;

  const videoImage =
    settings.heroWelcomeImage ||
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=85';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0f141d] border border-[#232f42] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#1c2635] flex items-center justify-between bg-[#0b0f17]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              En directo • {settings.shopName || 'Barbería Madrid'} ({settings.address || 'Gran Vía'})
            </span>
          </div>

          <button
            onClick={() => setVideoModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          <img
            src={videoImage}
            alt={`${settings.shopName || 'Barbería Madrid'} Video Reel`}
            className="w-full h-full object-cover filter brightness-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-6">
            <div className="flex justify-between items-center text-white">
              <span className="bg-amber-500 text-black text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                HD 4K Cinematic
              </span>
              <div className="p-2 rounded-full bg-black/60 text-white">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>

            <div className="text-left max-w-lg">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-bold text-white ml-1">
                  Experiencia 5 Estrellas
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white drop-shadow-md">
                {settings.tagline || 'El Ritual del Afeitado & Corte Perfecto'}
              </h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed drop-shadow">
                {settings.heroSubtitle || 'Ambiente exclusivo, café espresso artesanal, toallas vaporizadas y los mejores productos de fijación orgánica de Europa.'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#0d121b] border-t border-[#1b2533] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Música ambiental seleccionada por los barberos</span>
          </div>
          <button
            onClick={() => setVideoModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer"
          >
            Cerrar Video
          </button>
        </div>
      </div>
    </div>
  );
};
