import React from 'react';
import { Award, Gift, Sparkles, Star, Scissors, Check, QrCode } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { LoyaltyReward } from '../../types/barbershop';

export const LoyaltyView: React.FC = () => {
  const { user, loyaltyRewards, redeemReward } = useBarber();

  const stampsTotal = 8;
  const stampsFilled = user.stampsCount;

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Club de Fidelización Barbería Madrid VIP
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Acumula puntos con cada corte, completa tu tarjeta de sellos digital y canjea recompensas de lujo.
        </p>
      </div>

      {/* Main VIP Membership Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a1e0f] via-[#1a1510] to-[#0d1017] border border-amber-500/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                MADRID VIP PASS
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              {user.name}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Miembro desde 2025 • Categoría <span className="text-amber-400 font-extrabold">{user.loyaltyTier}</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Balance disponible</span>
              <p className="text-3xl md:text-4xl font-black text-amber-400 leading-none mt-1">
                {user.loyaltyPoints}{' '}
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  puntos
                </span>
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
              <QrCode className="w-12 h-12 text-amber-300" />
            </div>
          </div>
        </div>

        {/* Digital Stamp Card */}
        <div className="mt-8 pt-6 border-t border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                Tarjeta de Sellos Digital ({stampsFilled}/{stampsTotal})
              </span>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">
              ¡Te faltan {stampsTotal - stampsFilled} cortes para tu corte GRATIS!
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {Array.from({ length: stampsTotal }).map((_, idx) => {
              const isStamped = idx < stampsFilled;
              const isGift = idx === stampsTotal - 1;

              return (
                <div
                  key={idx}
                  className={`h-16 rounded-2xl border flex flex-col items-center justify-center transition ${
                    isStamped
                      ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-md'
                      : isGift
                      ? 'bg-amber-950/30 border-dashed border-amber-500/50 text-amber-400/80 animate-pulse'
                      : 'bg-[#151c27] border-slate-700/60 text-slate-600'
                  }`}
                >
                  {isStamped ? (
                    <div className="flex flex-col items-center">
                      <Check className="w-5 h-5 text-amber-400 stroke-[3]" />
                      <span className="text-[9px] font-bold mt-0.5">#{idx + 1}</span>
                    </div>
                  ) : isGift ? (
                    <div className="flex flex-col items-center">
                      <Gift className="w-5 h-5 text-amber-400" />
                      <span className="text-[9px] font-black uppercase text-amber-300">
                        GRATIS
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Scissors className="w-4 h-4 text-slate-600" />
                      <span className="text-[9px] text-slate-500 font-bold mt-0.5">
                        #{idx + 1}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Recompensas Disponibles para Canje
            </h3>
            <p className="text-xs text-slate-400">
              Canjea tus puntos instantáneamente y aplica el beneficio en tu próxima reserva o en tienda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loyaltyRewards.map((reward: LoyaltyReward) => {
            const canAfford = user.loyaltyPoints >= reward.pointsCost;

            return (
              <div
                key={reward.id}
                className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/30">
                      {reward.pointsCost} pts
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{reward.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => redeemReward(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs tracking-wider transition ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {canAfford ? 'Canjear Recompensa' : `Faltan ${reward.pointsCost - user.loyaltyPoints} pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Benefits Breakdown */}
      <div className="bg-[#111722] border border-[#202b3d] rounded-2xl p-5 text-xs text-slate-300">
        <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          Ventajas Exclusivas del Nivel {user.loyaltyTier}
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          <li className="flex items-center gap-2 bg-[#16202e] p-2.5 rounded-xl">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Café gourmet o refresco artesanal en cada visita</span>
          </li>
          <li className="flex items-center gap-2 bg-[#16202e] p-2.5 rounded-xl">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Prioridad en lista de espera en horarios pico</span>
          </li>
          <li className="flex items-center gap-2 bg-[#16202e] p-2.5 rounded-xl">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Descuentos sorpresa por notificación push</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
