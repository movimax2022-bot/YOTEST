import React, { useState } from 'react';
import {
  Scissors,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Lock,
  Phone,
  Save,
  Check,
  AlertCircle,
  Eye,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { Appointment } from '../../types/barbershop';

export const BarberPortalView: React.FC = () => {
  const {
    currentUser,
    barbers,
    appointments,
    updateAppointmentStatus,
    changePassword,
    updateCurrentUserProfile,
    formatPrice,
    logout,
    sendPushNotification,
  } = useBarber();

  const [activeBarberTab, setActiveBarberTab] = useState<'agenda' | 'perfil' | 'seguridad'>('agenda');
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'upcoming' | 'history'>('today');

  // Profile Edit State
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [profileSaved, setProfileSaved] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Find linked barber entity
  const matchedBarber =
    barbers.find((b) => b.id === currentUser.barberId) ||
    barbers.find((b) => b.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
    barbers[0];

  const barberId = matchedBarber?.id || 'barber-1';

  // Security check: Barbers only see THEIR appointments!
  const myAppointments = appointments.filter(
    (a) => a.barberId === barberId || a.barberName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = myAppointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = myAppointments.filter(
    (a) => a.date >= todayStr && a.status !== 'completed' && a.status !== 'cancelled'
  );
  const historyAppointments = myAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const displayedAppointments =
    filterPeriod === 'today'
      ? todayAppointments
      : filterPeriod === 'upcoming'
      ? upcomingAppointments
      : historyAppointments;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name,
      phone,
      avatar,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
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
    } else {
      setPassError(res.message);
    }
  };

  // If a non-barber reaches here, show clear notice
  if (currentUser.role !== 'barber' && currentUser.role !== 'admin') {
    return (
      <div className="p-12 text-center bg-[#111722] border border-[#202b3d] rounded-3xl max-w-lg mx-auto space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Acceso Restringido al Portal de Barberos</h3>
        <p className="text-xs text-slate-400">
          Debes iniciar sesión con una cuenta de barbero autorizada para consultar esta agenda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Top Banner & Barber Identity */}
      <div className="bg-[#111722] border border-[#202b3d] p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-white">{currentUser.name}</h2>
              <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md">
                Portal del Barbero
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {matchedBarber?.role || 'Maestro Barbero'} • Gran Vía 123 • {currentUser.email}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-[#16202e] p-1 rounded-2xl border border-slate-700/60">
          <button
            onClick={() => setActiveBarberTab('agenda')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeBarberTab === 'agenda'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mi Agenda</span>
          </button>

          <button
            onClick={() => setActiveBarberTab('perfil')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeBarberTab === 'perfil'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Perfil</span>
          </button>

          <button
            onClick={() => setActiveBarberTab('seguridad')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeBarberTab === 'seguridad'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Contraseña</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AGENDA & CITAS */}
      {activeBarberTab === 'agenda' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Quick Stats for this Barber */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#111722] border border-[#202b3d] p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Citas Hoy</span>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {todayAppointments.length}
              </p>
            </div>
            <div className="bg-[#111722] border border-[#202b3d] p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Próximas Reservas</span>
              <p className="text-2xl font-black text-white mt-1">
                {upcomingAppointments.length}
              </p>
            </div>
            <div className="bg-[#111722] border border-[#202b3d] p-4 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium">Servicios Históricos</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {historyAppointments.length}
              </p>
            </div>
          </div>

          {/* Period Filter Buttons */}
          <div className="flex items-center gap-2 bg-[#111722] p-2 rounded-2xl border border-[#202b3d]">
            {[
              { id: 'today', label: `Citas del Día (${todayAppointments.length})` },
              { id: 'upcoming', label: `Próximas Citas (${upcomingAppointments.length})` },
              { id: 'history', label: `Historial de Citas (${historyAppointments.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterPeriod(tab.id as typeof filterPeriod)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterPeriod === tab.id
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Appointments List for this Barber */}
          {displayedAppointments.length === 0 ? (
            <div className="p-12 text-center bg-[#111722] border border-[#202b3d] rounded-3xl space-y-2">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No hay citas en este período</h4>
              <p className="text-xs text-slate-400">
                Tu agenda está libre para este rango de fechas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedAppointments.map((apt: Appointment) => {
                const isConfirmed = apt.status === 'confirmed';
                const isInProgress = apt.status === 'in_progress';
                const isCompleted = apt.status === 'completed';
                const isCancelled = apt.status === 'cancelled';

                return (
                  <div
                    key={apt.id}
                    className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4.5 flex flex-col justify-between shadow-lg space-y-3"
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                        <span className="font-mono font-bold text-amber-400">
                          {apt.id}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-blue-950/60 text-blue-400 border border-blue-600/30'
                              : isInProgress
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-600/30 animate-pulse'
                              : isConfirmed
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/30'
                              : 'bg-red-950/60 text-red-400 border border-red-600/30'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      {/* Client info & service */}
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-sm">{apt.serviceName}</h4>
                            <p className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3" /> {apt.clientName}
                            </p>
                          </div>
                          <span className="text-sm font-black text-white">
                            {formatPrice(apt.servicePrice)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-[#16202e] p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>{apt.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>{apt.time} hrs</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.clientPhone}</span>
                          </div>
                        </div>

                        {apt.notes && (
                          <p className="text-[11px] text-slate-400 italic bg-black/30 p-2 rounded-lg border border-slate-800">
                            Petición: {apt.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Barber Quick Actions */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {apt.status !== 'in_progress' && apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/40 text-xs font-bold transition cursor-pointer"
                          >
                            En Sillón
                          </button>
                        )}

                        {apt.status !== 'completed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completada</span>
                          </button>
                        )}
                      </div>

                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                          className="px-2 py-1 rounded-xl text-red-400 hover:bg-red-950/40 text-[11px] transition"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PERFIL DEL BARBERO */}
      {activeBarberTab === 'perfil' && (
        <form
          onSubmit={handleProfileSave}
          className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="font-bold text-white text-base">Editar Perfil del Barbero</h3>
          <p className="text-xs text-slate-400">
            Actualiza tus datos de contacto y foto para que tus clientes te identifiquen al reservar.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Público</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL Foto de Perfil</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {profileSaved ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Datos actualizados con éxito
              </span>
            ) : (
              <span className="text-xs text-slate-500">Cambios sincronizados en el portal</span>
            )}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs transition flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Perfil</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: CAMBIAR CONTRASEÑA DEL BARBERO */}
      {activeBarberTab === 'seguridad' && (
        <form
          onSubmit={handleChangePassword}
          className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200"
        >
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              Cambiar Contraseña de Barbero
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Actualiza tu clave de acceso de forma segura sin requerir la intervención del administrador.
            </p>
          </div>

          {passError && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nueva Contraseña (Mínimo 6 caracteres)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs transition"
            >
              Actualizar Contraseña
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
