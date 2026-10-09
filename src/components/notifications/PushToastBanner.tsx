import React from 'react';
import { X, Calendar, Award, Sparkles, Bell, ArrowRight } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const PushToastBanner: React.FC = () => {
  const { toastPush, dismissToastPush, setActiveTab, scheduledCountdown } = useBarber();

  const handleAction = () => {
    if (toastPush?.actionTarget) {
      setActiveTab(toastPush.actionTarget);
    }
    dismissToastPush();
  };

  const getIcon = () => {
    if (!toastPush) return <Bell className="w-4 h-4 text-amber-400" />;
    switch (toastPush.category) {
      case 'citas':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'lealtad':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'promos':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <>
      {/* Scheduled simulation countdown pill if active */}
      {scheduledCountdown && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#151c27]/95 border border-amber-500/50 shadow-2xl rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-200">
            Simulación programada: <strong className="text-amber-400">{scheduledCountdown.title}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[11px]">
            {scheduledCountdown.secondsRemaining}s
          </span>
        </div>
      )}

      {/* Main Push Toast Card */}
      {toastPush && (
        <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] bg-[#121822]/95 border border-amber-500/40 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md p-4 transition-all duration-300 animate-in slide-in-from-top-6 fade-in">
          {/* Top meta */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-950/60 border border-amber-500/30">
                {getIcon()}
              </div>
              <span className="font-extrabold uppercase tracking-wider text-slate-200">
                BARBERÍA MADRID
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Ahora</span>
              <button
                onClick={dismissToastPush}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                aria-label="Cerrar notificación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
              {toastPush.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {toastPush.body}
            </p>
          </div>

          {/* Action Footer if available */}
          {toastPush.actionLabel && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={handleAction}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <span>{toastPush.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
