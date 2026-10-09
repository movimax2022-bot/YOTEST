import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Fingerprint,
  Bell,
  Heart,
  Save,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  Trash2,
  Check,
  Clock,
  Play,
  Timer,
  ChevronRight,
  Filter,
  CheckCheck,
  Inbox,
  ArrowRight,
  Lock,
  Camera,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { SIMULATION_SCENARIOS, SimulationScenario } from '../../services/pushSimulationService';
import { PushNotification } from '../../types/barbershop';
import { ImageUploadWidget } from '../common/ImageUploadWidget';

export const UserProfileView: React.FC = () => {
  const {
    user,
    setUser,
    currentUser,
    updateCurrentUserProfile,
    changePassword,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    barbers,
    togglePreferredBarber,
    notifications,
    sendPushNotification,
    markNotificationRead,
    deleteNotification,
    clearNotifications,
    triggerManualSync,
    isSyncing,
    lastSyncedText,
    requestBiometricAuth,
    triggerSimulatedScenario,
    setActiveTab,
  } = useBarber();

  const [activeProfileTab, setActiveProfileTab] = useState<'perfil' | 'bandeja' | 'simulador'>('perfil');

  // Personal Info Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Inbox Filtering State
  const [inboxCategory, setInboxCategory] = useState<string>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);

  // Custom Push Simulation State
  const [customTitle, setCustomTitle] = useState(`💈 Aviso para ti, ${currentUser.name}`);
  const [customBody, setCustomBody] = useState('Tu cita para mañana ha sido confirmada en sillón principal.');
  const [customCategory, setCustomCategory] = useState<'citas' | 'lealtad' | 'promos'>('citas');
  const [customDelay, setCustomDelay] = useState<number>(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const avatarPresets = [
    { label: 'Hombre 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
    { label: 'Hombre 2', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' },
    { label: 'Hombre 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { label: 'Elegante', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name,
      email,
      phone,
      avatar,
    });
    setUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      avatar,
    }));
    setSavedSuccess(true);
    sendPushNotification(
      'Perfil Actualizado',
      'Tus datos personales y foto de perfil han sido guardados correctamente.',
      { type: 'system', category: 'sistema' }
    );
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    const res = changePassword(currentPassword, newPassword, confirmPassword);
    if (res.success) {
      setPassSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(''), 3000);
    } else {
      setPassError(res.message);
    }
  };

  const handleToggleBiometrics = () => {
    requestBiometricAuth(() => {
      setUser((prev) => ({
        ...prev,
        biometricEnabled: !prev.biometricEnabled,
      }));
    });
  };

  const handleSendCustomSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customBody.trim()) return;

    if (customDelay > 0) {
      triggerSimulatedScenario('status_in_progress', customDelay);
    } else {
      sendPushNotification(customTitle, customBody, {
        type: customCategory === 'citas' ? 'appointment' : customCategory === 'lealtad' ? 'loyalty' : 'promo',
        category: customCategory,
        actionLabel: 'Ver Detalles',
        actionTarget: customCategory === 'citas' ? 'appointments' : customCategory === 'lealtad' ? 'loyalty' : 'home',
      });
    }
  };

  // Filter notifications for the inbox
  const filteredNotifications = notifications.filter((n) => {
    if (onlyUnread && n.read) return false;
    if (inboxCategory === 'all') return true;
    if (inboxCategory === 'citas') return n.category === 'citas' || n.type === 'appointment' || n.type === 'reminder';
    if (inboxCategory === 'lealtad') return n.category === 'lealtad' || n.type === 'loyalty';
    if (inboxCategory === 'promos') return n.category === 'promos' || n.type === 'promo';
    return true;
  });

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Panel de Usuario y Notificaciones
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Administra tus datos, consulta el historial de alertas de tus citas y prueba el motor de notificaciones push.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1.5 bg-[#121822] p-1 rounded-2xl border border-[#202b3d] shrink-0">
          <button
            onClick={() => setActiveProfileTab('perfil')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeProfileTab === 'perfil'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mi Perfil</span>
          </button>

          <button
            onClick={() => setActiveProfileTab('bandeja')}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeProfileTab === 'bandeja'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Bandeja de Entrada</span>
            {unreadCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeProfileTab === 'bandeja'
                    ? 'bg-black text-amber-400'
                    : 'bg-amber-500 text-black'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveProfileTab('simulador')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeProfileTab === 'simulador'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulador Push</span>
            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 font-extrabold">
              Demo
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: PERFIL Y PREFERENCIAS */}
      {activeProfileTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Left Column: Avatar & Summary */}
          <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 flex flex-col items-center text-center shadow-lg h-fit">
            <div className="relative mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-400/40 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-black">
                <CheckCircle2 className="w-4 h-4 text-black" />
              </span>
            </div>

            <h3 className="text-lg font-black text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
            <span className="mt-2 text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-600/30">
              Cliente Nivel {user.loyaltyTier}
            </span>

            <div className="w-full mt-6 pt-6 border-t border-slate-800 space-y-3 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Puntos VIP:</span>
                <span className="font-extrabold text-amber-400">{user.loyaltyPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sellos acumulados:</span>
                <span className="font-bold text-white">{user.stampsCount} / 8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Notificaciones no leídas:</span>
                <span className="font-bold text-amber-400">{unreadCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sincronización:</span>
                <span className="font-medium text-emerald-400">Activa</span>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Edit Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Form */}
            <form
              onSubmit={handleSave}
              className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-lg space-y-4"
            >
              <h4 className="font-bold text-white text-base">Información de Contacto</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nombre Completo</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>Correo Electrónico</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Teléfono Móvil (WhatsApp/Bizum)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                {/* Avatar / Photo Selection */}
                <ImageUploadWidget
                  label="Foto de Perfil de la Cuenta"
                  helperText="Sube una foto desde tu ordenador o teléfono. Podrás recortar, rotar y ajustar brillo antes de guardar."
                  currentImage={avatar}
                  onImageChange={(newAvatar) => setAvatar(newAvatar)}
                  onImageRemove={() => setAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80')}
                  aspectRatioPreset="1:1"
                  shape="circle"
                  presetOptions={[
                    { name: 'Hombre 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
                    { name: 'Hombre 2', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' },
                    { name: 'Hombre 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                    { name: 'Elegante', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
                  ]}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                {savedSuccess ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> ¡Guardado correctamente!
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Datos cifrados localmente</span>
                )}

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>

            {/* Change Password Form for Client */}
            <form
              onSubmit={handleChangePassword}
              className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-lg space-y-4"
            >
              <div>
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Cambiar Contraseña</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actualiza tu contraseña de acceso para mantener segura tu cuenta.
                </p>
              </div>

              {passSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              {passError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 carácteres"
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('forgot_password');
                    setAuthModalOpen(true);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition cursor-pointer"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>

            {/* Preferred Barber Selection */}
            <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white text-base">Mi Barbero Favorito</h4>
                  <p className="text-xs text-slate-400">
                    Se seleccionará automáticamente al iniciar cualquier reserva
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {barbers.map((b) => {
                  const isSelected = user.preferredBarberId === b.id;

                  return (
                    <div
                      key={b.id}
                      onClick={() => togglePreferredBarber(b.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 text-white shadow-md'
                          : 'bg-[#151c27] border-[#222d3d] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="relative mb-2">
                        <img
                          src={b.avatar}
                          alt={b.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40"
                        />
                        <Heart
                          className={`absolute -top-1 -right-1 w-4 h-4 ${
                            isSelected ? 'fill-red-500 text-red-500' : 'text-slate-400'
                          }`}
                        />
                      </div>
                      <p className="font-bold text-xs truncate w-full">{b.name}</p>
                      <p className="text-[10px] text-amber-400">★ {b.rating}</p>
                      {isSelected && (
                        <span className="text-[9px] bg-red-950/60 text-red-400 font-bold px-1.5 py-0.5 rounded-full mt-1">
                          Favorito
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security & Multi-device Sync Settings */}
            <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-lg space-y-4">
              <h4 className="font-bold text-white text-base">Seguridad y Dispositivos</h4>

              <div className="space-y-3">
                {/* Biometrics Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-[#151c27] border border-[#232f42] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Autenticación Biométrica</p>
                      <p className="text-[11px] text-slate-400">
                        Requerir Face ID o Huella para pagos y acceso de administrador
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleBiometrics}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      user.biometricEnabled
                        ? 'bg-emerald-500 text-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {user.biometricEnabled ? 'Activado' : 'Desactivado'}
                  </button>
                </div>

                {/* Multi-Device Cloud Sync */}
                <div className="flex items-center justify-between p-3.5 bg-[#151c27] border border-[#232f42] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded-xl">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Sincronización Automática</p>
                      <p className="text-[11px] text-slate-400">{lastSyncedText}</p>
                    </div>
                  </div>
                  <button
                    onClick={triggerManualSync}
                    className={`px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 ${
                      isSyncing ? 'animate-spin' : ''
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sincronizar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANDEJA DE ENTRADA DE NOTIFICACIONES Y ALERTAS DE CITAS */}
      {activeProfileTab === 'bandeja' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          {/* Top Actions & Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Historial de Alertas & Notificaciones
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Revisa los avisos de tus citas, cambios de estado en directo y recompensas de tu cuenta.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Marcar todas leídas</span>
              </button>

              <button
                onClick={clearNotifications}
                className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/40 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar bandeja</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#151c27] p-2 rounded-2xl border border-slate-800/80">
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
              {[
                { id: 'all', label: 'Todas' },
                { id: 'citas', label: 'Citas y Cambios de Turno' },
                { id: 'lealtad', label: 'Club VIP & Puntos' },
                { id: 'promos', label: 'Promociones & Estilo' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setInboxCategory(f.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    inboxCategory === f.id
                      ? 'bg-amber-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 px-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => setOnlyUnread(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0"
              />
              <span>Solo no leídas ({unreadCount})</span>
            </label>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <Bell className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
              <p className="text-sm font-semibold text-slate-400">
                No tienes notificaciones en esta categoría
              </p>
              <p className="text-xs text-slate-500">
                Puedes probar el simulador de alertas push en la pestaña superior.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif: PushNotification) => {
                const isAppointmentAlert =
                  notif.category === 'citas' || notif.type === 'appointment' || notif.type === 'reminder';
                const isLoyaltyAlert = notif.category === 'lealtad' || notif.type === 'loyalty';

                return (
                  <div
                    key={notif.id}
                    className={`relative rounded-2xl border p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      !notif.read
                        ? 'bg-[#161e2b] border-amber-500/40 shadow-md'
                        : 'bg-[#131924] border-[#1e2736] text-slate-400'
                    }`}
                  >
                    {/* Unread dot indicator */}
                    {!notif.read && (
                      <span className="absolute top-4 right-4 sm:top-5 sm:right-5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20 animate-pulse" />
                    )}

                    {/* Left Icon & Body */}
                    <div className="flex items-start gap-3.5 flex-1 pr-6">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isAppointmentAlert
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-600/30'
                            : isLoyaltyAlert
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/30'
                            : 'bg-blue-950/60 text-blue-400 border border-blue-600/30'
                        }`}
                      >
                        {isAppointmentAlert ? (
                          <Calendar className="w-5 h-5" />
                        ) : isLoyaltyAlert ? (
                          <Award className="w-5 h-5" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              isAppointmentAlert
                                ? 'bg-amber-500/20 text-amber-400'
                                : isLoyaltyAlert
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {isAppointmentAlert
                              ? 'Alerta de Cita'
                              : isLoyaltyAlert
                              ? 'Fidelidad VIP'
                              : 'Estilo & Promo'}
                          </span>

                          {notif.appointmentId && (
                            <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-slate-700">
                              Ref: {notif.appointmentId}
                            </span>
                          )}

                          <span className="text-[10px] text-slate-500">
                            {notif.timestamp}
                          </span>
                        </div>

                        <h4
                          className={`text-sm font-bold leading-snug ${
                            !notif.read ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {notif.title}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {notif.body}
                        </p>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      {notif.actionLabel && (
                        <button
                          onClick={() => {
                            if (notif.actionTarget) setActiveTab(notif.actionTarget);
                            markNotificationRead(notif.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wide transition flex items-center gap-1 shadow-sm"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {!notif.read ? (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          title="Marcar como leída"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <Check className="w-4 h-4 text-emerald-400" />
                        </button>
                      ) : null}

                      <button
                        onClick={() => deleteNotification(notif.id)}
                        title="Eliminar de la bandeja"
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SIMULADOR DE NOTIFICACIONES PUSH PERSONALIZADAS */}
      {activeProfileTab === 'simulador' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Banner Explanation */}
          <div className="bg-gradient-to-r from-amber-950/40 via-[#151c27] to-[#121822] border border-amber-500/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  Servicio de Simulación de Notificaciones Push
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Prueba en tiempo real cómo los clientes reciben alertas personalizadas sobre cambios en sus citas,
                recordatorios automáticos tras 21 días de inactividad, y recompensas VIP, con banner nativo y sonido Web Audio.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-500 text-black px-3 py-1 rounded-full self-start md:self-auto">
              Simulador Interactivo
            </span>
          </div>

          {/* Scenario Grid */}
          <div>
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Escenarios de Notificación Basados en Actividad Real
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIMULATION_SCENARIOS.map((scenario: SimulationScenario) => {
                return (
                  <div
                    key={scenario.id}
                    className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4.5 flex flex-col justify-between hover:border-amber-500/40 transition shadow-lg group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            scenario.category === 'citas'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : scenario.category === 'lealtad'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {scenario.category}
                        </span>
                        <Bell className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
                      </div>

                      <h5 className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                        {scenario.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => triggerSimulatedScenario(scenario.id, 0)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Enviar Ya</span>
                      </button>

                      <button
                        onClick={() => triggerSimulatedScenario(scenario.id, 5)}
                        title="Programar envío en 5 segundos para probar la alerta"
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                      >
                        <Timer className="w-3.5 h-3.5 text-amber-400" />
                        <span>5s</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Push Composer Form */}
          <form
            onSubmit={handleSendCustomSimulation}
            className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Crear y Emitir Notificación Personalizada
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Define el texto, la categoría y el tiempo de retardo para probar el banner y el registro en la bandeja de entrada.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título de la Alerta
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contenido del Mensaje
                </label>
                <textarea
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  rows={2}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as typeof customCategory)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="citas">Citas y Cambios de Turno</option>
                    <option value="lealtad">Club VIP & Puntos</option>
                    <option value="promos">Estilo & Promociones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Programación / Temporizador
                  </label>
                  <select
                    value={customDelay}
                    onChange={(e) => setCustomDelay(Number(e.target.value))}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value={0}>Inmediato (0 segundos)</option>
                    <option value={5}>En 5 segundos</option>
                    <option value={10}>En 10 segundos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Se guardará automáticamente en tu bandeja de entrada
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Emitir Notificación Push</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
