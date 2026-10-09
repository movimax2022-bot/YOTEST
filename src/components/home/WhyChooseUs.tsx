import React from 'react';
import { Award, ShieldCheck, Clock, Star } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const WhyChooseUs: React.FC = () => {
  const { t } = useBarber();

  const features = [
    {
      title: t.expertBarbers,
      desc: t.expertBarbersDesc,
      icon: Award,
    },
    {
      title: t.premiumProducts,
      desc: t.premiumProductsDesc,
      icon: ShieldCheck,
    },
    {
      title: t.punctuality,
      desc: t.punctualityDesc,
      icon: Clock,
    },
    {
      title: t.uniqueAtmosphere,
      desc: t.uniqueAtmosphereDesc,
      icon: Star,
    },
  ];

  return (
    <div className="flex flex-col text-left">
      <h3 className="text-lg md:text-xl font-black text-white tracking-tight mb-4">
        {t.whyChooseUs}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#111722] dark:bg-[#0e141d] p-4 sm:p-5 rounded-2xl border border-[#1f2838] shadow-lg">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className={`flex flex-col text-left p-2.5 rounded-xl transition ${
                i !== 0 ? 'md:border-l md:border-slate-800 md:pl-4' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-white">
                {feat.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
