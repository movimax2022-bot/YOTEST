import React from 'react';
import {
  Home,
  Grid,
  Calendar,
  Clock,
  User,
  History,
  Scissors,
  Award,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Fingerprint,
  ShoppingBag,
  CalendarDays,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { LogoEmblem } from './LogoEmblem';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
  special?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    t,
    appointments,
    user,
    currentUser,
    logout,
    isSyncing,
    triggerManualSync,
    lastSyncedText,
    requestBiometricAuth,
    setAuthModalOpen,
  } = useBarber();

  const isBarber = currentUser.role === 'barber';
  const isAdmin = currentUser.role === 'admin';
  const isClient = currentUser.role === 'client';

  // Count pending appointments depending on role
  const relevantAppointments = isBarber
    ? appointments.filter(
        (a) =>
          (a.barberId === currentUser.barberId ||
            a.barberName.toLowerCase() === currentUser.name.toLowerCase()) &&
          (a.status === 'confirmed' || a.status === 'in_progress')
      )
    : appointments.filter(
        (a) =>
          !a.hiddenFromClient &&
          (a.status === 'confirmed' || a.status === 'in_progress')
      );

  const pendingCount = relevantAppointments.length;

  // Build navigation items according to user role
  const getNavItems = (): SidebarNavItem[] => {
    if (isBarber) {
      return [
        {
          id: 'barber-portal',
          label: 'Mi Agenda & Citas',
          icon: CalendarDays,
          badge: pendingCount > 0 ? pendingCount : undefined,
          highlight: true,
        },
        { id: 'services', label: t.nav.services, icon: Grid },
        { id: 'products', label: 'Productos Barbería', icon: ShoppingBag },
        { id: 'portfolio', label: t.nav.portfolio, icon: Scissors },
        { id: 'profile', label: 'Mi Perfil de Barbero', icon: User },
        { id: 'history', label: 'Historial', icon: History },
      ];
    }

    if (isAdmin) {
      return [
        {
          id: 'admin',
          label: 'Panel Administración',
          icon: ShieldCheck,
          special: true,
        },
        { id: 'home', label: t.nav.home, icon: Home },
        { id: 'services', label: t.nav.services, icon: Grid },
        { id: 'products', label: 'Gestión Productos', icon: ShoppingBag },
        {
          id: 'appointments',
          label: 'Citas Globales',
          icon: Clock,
          badge: appointments.filter((a) => a.status === 'confirmed').length,
        },
        { id: 'portfolio', label: t.nav.portfolio, icon: Scissors },
        { id: 'profile', label: 'Mi Perfil Admin', icon: User },
      ];
    }

    // Default: Client Navigation
    return [
      { id: 'home', label: t.nav.home, icon: Home },
      { id: 'services', label: t.nav.services, icon: Grid },
      { id: 'book', label: t.nav.book, icon: Calendar },
      {
        id: 'appointments',
        label: t.nav.myAppointments,
        icon: Clock,
        badge: pendingCount > 0 ? pendingCount : undefined,
      },
      { id: 'products', label: 'Productos Barbería', icon: ShoppingBag },
      { id: 'profile', label: t.nav.myProfile, icon: User },
      { id: 'history', label: t.nav.history, icon: History },
      { id: 'portfolio', label: t.nav.portfolio, icon: Scissors },
      { id: 'loyalty', label: t.nav.loyalty, icon: Award },
      {
        id: 'admin',
        label: 'Acceso Pro / Admin',
        icon: ShieldCheck,
        special: true,
      },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id: string) => {
    if (id === 'admin') {
      if (isAdmin) {
        setActiveTab('admin');
      } else {
        // Client attempting admin access: request biometric or open login
        requestBiometricAuth(() => {
          setActiveTab('admin');
        }, 'Verificación de credenciales de administrador');
      }
    } else {
      setActiveTab(id);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d1117] dark:bg-[#0b0e14] border-r border-[#1e2530] flex flex-col justify-between py-6 px-4 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="px-3 pb-6 border-b border-[#1f2836]">
            <LogoEmblem size="md" showText={true} />
          </div>

          {/* Role Status Tag */}
          <div className="mt-4 px-3 py-1.5 rounded-xl bg-[#141b26] border border-[#222d3d] flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">Modo activo:</span>
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : isBarber
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isAdmin ? 'Administrador' : isBarber ? 'Barbero' : 'Cliente'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'barber-portal' && (activeTab === 'barber' || activeTab === 'barber-portal'));

              if (item.special) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all mt-3 ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'bg-amber-950/30 text-amber-300 border border-amber-600/30 hover:bg-amber-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-bold">
                      PRO
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2c2214] to-[#1c1812] text-amber-400 border-l-4 border-amber-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-500 text-black leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-[#1f2836] space-y-3">
          {/* Biometric & Sync Status Badge */}
          <div className="bg-[#121820] rounded-xl p-2.5 border border-[#1e2735] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              <div className="text-[11px] text-left">
                <p className="text-slate-300 font-medium">Face ID / Biometría</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{lastSyncedText}</p>
              </div>
            </div>
            <button
              onClick={triggerManualSync}
              title="Sincronizar datos"
              className={`p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition cursor-pointer ${
                isSyncing ? 'animate-spin text-amber-400' : ''
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User profile small row */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2 truncate">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/50"
              />
              <span className="text-slate-300 font-medium truncate max-w-[100px]">
                {currentUser.name}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              title="Cerrar sesión"
              className="text-slate-400 hover:text-red-400 transition p-1 hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
