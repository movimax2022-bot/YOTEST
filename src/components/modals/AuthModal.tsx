import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Scissors, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBarber } from '../../context/BarberContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    recoverPassword,
  } = useBarber();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        setAuthModalOpen(false);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = register(name, email, phone, password);
      setLoading(false);
      if (res.success) {
        setAuthModalOpen(false);
      } else {
        setErrorMessage(res.message);
      }
    }, 500);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    setTimeout(() => {
      const res = recoverPassword(email);
      setLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    }, 500);
  };

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111722] border border-[#243044] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f293a] flex items-center justify-between bg-[#0e131d]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {authModalMode === 'login'
                ? 'Iniciar Sesión'
                : authModalMode === 'register'
                ? 'Crear Cuenta de Cliente'
                : 'Recuperar Contraseña'}
            </h3>
            <p className="text-xs text-amber-400 font-medium">
              Barbería Madrid • Plataforma Oficial
            </p>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#1d2738] bg-[#0c1017]">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              authModalMode === 'login'
                ? 'border-amber-400 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              authModalMode === 'register'
                ? 'border-amber-400 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        <div className="p-6 space-y-4 text-left">
          {/* Quick Demo Acccount Switcher (for convenience & testing all 3 roles!) */}
          {authModalMode === 'login' && (
            <div className="bg-[#161f2d] p-3 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Accesos rápidos de demostración (3 Roles):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin@barberiamadrid.es', 'admin123')}
                  className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/30 text-amber-300 text-[11px] font-bold transition flex flex-col items-center gap-0.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickDemo('carlos@barberiamadrid.es', 'barber123')}
                  className="p-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-600/30 text-blue-300 text-[11px] font-bold transition flex flex-col items-center gap-0.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Barbero</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickDemo('juan@ejemplo.com', 'cliente123')}
                  className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/30 text-emerald-300 text-[11px] font-bold transition flex flex-col items-center gap-0.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Cliente</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Correo Electrónico</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@barberiamadrid.es"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contraseña</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('forgot_password');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Accediendo...' : 'Iniciar Sesión'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nombre Completo</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Marcos Alonso"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Correo Electrónico</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcos@ejemplo.com"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Teléfono Móvil</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contraseña (Mínimo 6 caracteres)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confirmar Contraseña</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Creando cuenta...' : 'Completar Registro'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authModalMode === 'forgot_password' && (
            <form onSubmit={handleRecover} className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Introduce el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones de recuperación.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Correo Electrónico</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@barberiamadrid.es"
                  className="w-full bg-[#16202e] border border-[#263447] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Volver al Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs"
                >
                  {loading ? 'Enviando...' : 'Recuperar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
