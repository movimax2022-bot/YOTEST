import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Menu,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Fingerprint,
  Check,
  ShieldCheck,
  Headphones,
  User,
  LogIn,
  LogOut,
  Scissors,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { Language, Currency, UserRole } from '../../types/barbershop';

interface TopHeaderProps {
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    t,
    language,
    setLanguage,
    currency,
    setCurrency,
    darkMode,
    setDarkMode,
    user,
    currentUser,
    users,
    login,
    logout,
    switchUserRole,
    setAuthModalOpen,
    setAuthModalMode,
    notifications,
    markNotificationRead,
    requestBiometricAuth,
    setSupportModalOpen,
    setActiveTab,
    settings,
  } = useBarber();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
  ];

  const currentFlag = languages.find((l) => l.code === language)?.flag || '🇪🇸';
  const currentLangName = languages.find((l) => l.code === language)?.name || 'Español';

  const handleQuickSwitch = (email: string, pass: string) => {
    login(email, pass);
    setAccountMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b0e14]/95 dark:bg-[#090c12]/95 backdrop-blur-md border-b border-[#1b222d] transition-colors">
      {/* Announcement Bar if enabled */}
      {settings.announcementBarEnabled !== false && settings.announcementBarText && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black text-[11px] font-black py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
          <span>{settings.announcementBarText}</span>
        </div>
      )}

      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Mobile burger + Gran Vía Madrid address + Schedule */}
        <div className="flex items-center gap-4 text-xs text-slate-300">
          {/* Mobile hamburger button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-slate-800/60 text-slate-200 hover:text-amber-400 focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-slate-300 hover:text-amber-400 transition cursor-pointer">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-normal">{settings.address || t.address}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400 border-l border-slate-700/60 pl-4">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{settings.openHours || t.schedule}</span>
          </div>
        </div>

        {/* Right Side: Lang, Currency, DarkMode, Notifs, Biometrics, User profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Multilingual Support quick button */}
          <button
            onClick={() => setSupportModalOpen(true)}
            title="Soporte y Atención al cliente"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-amber-400 transition border border-slate-700/50"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Soporte</span>
          </button>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition"
            >
              <span>{currentFlag}</span>
              <span className="hidden sm:inline">{currentLangName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#121820] border border-[#232c3d] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                      language === l.code
                        ? 'text-amber-400 bg-amber-950/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </div>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative" ref={currRef}>
            <button
              onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition"
            >
              <span className="text-amber-400 font-semibold">
                {currency === 'EUR' ? '€' : '$'}
              </span>
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currencyMenuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-[#121820] border border-[#232c3d] rounded-xl shadow-2xl py-1 z-50">
                {(['EUR', 'USD'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
                      currency === c
                        ? 'text-amber-400 bg-amber-950/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c === 'EUR' ? '€ EUR' : '$ USD'}</span>
                    {currency === c && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 text-slate-300 hover:text-amber-400 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg border border-slate-700/40 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-200" />}
          </button>

          {/* Push Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              title="Notificaciones push"
              className="relative p-2 text-slate-300 hover:text-amber-400 bg-slate-800/40 hover:bg-slate-800/80 rounded-lg border border-slate-700/40 transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#121820] border border-[#232c3d] rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">Notificaciones Push</span>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} nuevas
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-6">No tienes notificaciones</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition ${
                          !n.read ? 'bg-amber-950/20 text-slate-100' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                          <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.body}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                  <button
                    onClick={() => {
                      notifications.forEach((n) => markNotificationRead(n.id));
                    }}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Marcar todas leídas
                  </button>
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      setActiveTab('admin');
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Programar push →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Biometrics lock */}
          <button
            onClick={() => requestBiometricAuth(() => {})}
            title="Autenticación Biométrica rápida (Face ID / Huella)"
            className="hidden sm:flex p-2 text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/50 rounded-lg border border-emerald-800/40 transition"
          >
            <Fingerprint className="w-4 h-4" />
          </button>

          {/* User Profile & Account Switcher Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-[#161d27] border border-[#232d3d] hover:border-amber-500/60 transition cursor-pointer group"
              title="Cuenta de usuario y selección de rol"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-400/50 group-hover:ring-amber-400"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition leading-none truncate max-w-[95px] sm:max-w-none">
                  {currentUser.name}
                </span>
                <span className="text-[10px] leading-tight flex items-center gap-1 mt-0.5">
                  {currentUser.role === 'admin' ? (
                    <span className="text-amber-400 font-extrabold flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5 inline" /> Admin
                    </span>
                  ) : currentUser.role === 'barber' ? (
                    <span className="text-blue-400 font-extrabold flex items-center gap-0.5">
                      <Scissors className="w-2.5 h-2.5 inline" /> Barbero
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">Cliente</span>
                  )}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition" />
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#121820] border border-[#243044] rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 text-left">
                {/* Account Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400/60"
                  />
                  <div className="flex-1 truncate">
                    <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          currentUser.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : currentUser.role === 'barber'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {currentUser.role === 'admin'
                          ? '🛡️ Administrador'
                          : currentUser.role === 'barber'
                          ? '✂️ Barbero del Salón'
                          : '👤 Cliente'}
                      </span>
                      {currentUser.role === 'client' && (
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded">
                          {currentUser.loyaltyPoints ?? 100} pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Portal Action */}
                <div className="py-2.5 border-b border-slate-800">
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ir al Panel de Administración</span>
                    </button>
                  )}

                  {currentUser.role === 'barber' && (
                    <button
                      onClick={() => {
                        setActiveTab('barber-portal');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>Ir a Mi Portal de Barbero</span>
                    </button>
                  )}

                  {currentUser.role === 'client' && (
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>Ver Mi Perfil de Cliente</span>
                    </button>
                  )}
                </div>

                {/* 1-Click Role / Demo Switcher for fast evaluation */}
                <div className="py-2.5 border-b border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Cambio Rápido de Cuenta / Demo</span>
                  </p>
                  <div className="space-y-1">
                    {/* Cliente: Juan Pérez */}
                    <button
                      onClick={() => handleQuickSwitch('juan@ejemplo.com', 'cliente123')}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition ${
                        currentUser.email === 'juan@ejemplo.com'
                          ? 'bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-500/40'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>👤</span>
                        <span className="truncate">Juan Pérez</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium">Cliente</span>
                    </button>

                    {/* Barbero: Carlos Hernández */}
                    <button
                      onClick={() => handleQuickSwitch('carlos@barberiamadrid.es', 'barber123')}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition ${
                        currentUser.email === 'carlos@barberiamadrid.es'
                          ? 'bg-blue-950/40 text-blue-300 font-bold border border-blue-500/40'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>✂️</span>
                        <span className="truncate">Carlos H. (Barbero #1)</span>
                      </span>
                      <span className="text-[10px] text-blue-400 font-medium">Barbero</span>
                    </button>

                    {/* Barbero: Mateo Silva */}
                    <button
                      onClick={() => handleQuickSwitch('mateo@barberiamadrid.es', 'barber123')}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition ${
                        currentUser.email === 'mateo@barberiamadrid.es'
                          ? 'bg-blue-950/40 text-blue-300 font-bold border border-blue-500/40'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>✂️</span>
                        <span className="truncate">Mateo S. (Barbero #2)</span>
                      </span>
                      <span className="text-[10px] text-blue-400 font-medium">Barbero</span>
                    </button>

                    {/* Admin: Administrador Madrid */}
                    <button
                      onClick={() => handleQuickSwitch('admin@barberiamadrid.es', 'admin123')}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition ${
                        currentUser.email === 'admin@barberiamadrid.es'
                          ? 'bg-amber-950/40 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>🛡️</span>
                        <span className="truncate">Administrador Madrid</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-medium">Admin</span>
                    </button>
                  </div>
                </div>

                {/* Login / Register / Logout Actions */}
                <div className="pt-2.5 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                      setAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Iniciar Sesión con otra cuenta</span>
                  </button>

                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                      setAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Crear Cuenta de Cliente</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-400 hover:bg-red-950/30 rounded-lg transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
