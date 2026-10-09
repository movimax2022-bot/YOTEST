import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle2, Shield, Lock, X } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { sounds } from '../../utils/audio';

export const BiometricModal: React.FC = () => {
  const { biometricModalOpen, closeBiometricModal, user } = useBarber();
  const [scanState, setScanState] = useState<'scanning' | 'success' | 'pin'>('scanning');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (biometricModalOpen) {
      setScanState('scanning');
      setPin('');
      // Simulate biometric scan sequence
      const timer = setTimeout(() => {
        sounds.playBiometric();
        setScanState('success');
        const doneTimer = setTimeout(() => {
          closeBiometricModal();
        }, 900);
        return () => clearTimeout(doneTimer);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [biometricModalOpen]);

  if (!biometricModalOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      sounds.playBiometric();
      setScanState('success');
      setTimeout(() => {
        closeBiometricModal();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#111722] border border-[#243044] rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
        {/* Close Button */}
        <button
          onClick={closeBiometricModal}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/40 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <h3 className="text-lg font-black text-white tracking-tight">
          Autenticación Biométrica
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-8">
          Face ID / Touch ID seguro para <span className="text-amber-400 font-semibold">{user.name}</span>
        </p>

        {scanState === 'scanning' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              {/* Ripple circles */}
              <div className="absolute w-24 h-24 rounded-full border border-amber-500/30 animate-ping opacity-60" />
              <div className="absolute w-28 h-28 rounded-full border border-amber-400/20 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <Fingerprint className="w-10 h-10 animate-pulse" />
              </div>
            </div>
            <p className="text-xs font-semibold text-amber-400 mt-6 tracking-wider uppercase animate-pulse">
              Escaneando datos biométricos...
            </p>
            <button
              onClick={() => setScanState('pin')}
              className="text-[11px] text-slate-400 hover:text-white mt-4 underline underline-offset-4"
            >
              Usar PIN de seguridad
            </button>
          </div>
        )}

        {scanState === 'success' && (
          <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <p className="text-xs font-bold text-emerald-400 mt-6 tracking-wide uppercase">
              ¡Identidad Verificada!
            </p>
          </div>
        )}

        {scanState === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4 py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300">Introduce tu PIN (Ej: 1234)</span>
            </div>
            <input
              type="password"
              maxLength={4}
              value={pin}
              autoFocus
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-36 mx-auto text-center tracking-[0.5em] text-xl font-bold bg-[#162030] border border-[#2b3a50] rounded-xl py-2 text-white focus:outline-none focus:border-amber-400"
            />
            <div className="flex gap-2 justify-center mt-4">
              <button
                type="submit"
                disabled={pin.length < 4}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs tracking-wider transition"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setScanState('scanning')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Volver
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
