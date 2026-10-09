import React, { useState, useMemo } from 'react';
import {
  Bell,
  Send,
  Calendar,
  Clock,
  Users,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ShieldCheck,
  User,
  Trash2,
  XCircle,
  Play,
  RotateCcw,
  Tag,
  Check,
  Zap,
  Radio,
  Crown,
  History,
  Info,
  CalendarDays,
  Smartphone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import {
  TargetAccountType,
  TargetActivityFilter,
  ScheduledPushNotification,
  PushAutomationTrigger,
} from '../../types/barbershop';

export const AdminPushCampaignsPanel: React.FC = () => {
  const {
    users,
    appointments,
    barbers,
    scheduledPushes,
    createScheduledPush,
    executeScheduledPushNow,
    cancelScheduledPush,
    deleteScheduledPush,
    sendSegmentedPush,
    getTargetedUsers,
    automations,
    toggleAutomation,
    currentUser,
  } = useBarber();

  // Active view tab inside Push Panel
  const [activeTab, setActiveTab] = useState<'composer' | 'scheduled' | 'history' | 'automations'>('composer');

  // Targeting filters
  const [targetRole, setTargetRole] = useState<TargetAccountType>('all');
  const [activityFilter, setActivityFilter] = useState<TargetActivityFilter>('all');
  const [showRecipientsList, setShowRecipientsList] = useState(false);

  // Content form
  const [pushTitle, setPushTitle] = useState('💈 Oferta Exclusiva Fin de Semana');
  const [pushBody, setPushBody] = useState(
    'Hola {nombre}, reserva hoy tu corte completo o combo y llévate un tratamiento spa de cortesía en Gran Vía 123.'
  );
  const [pushCategory, setPushCategory] = useState<'promos' | 'citas' | 'lealtad' | 'sistema'>('promos');
  const [actionLabel, setActionLabel] = useState('Reservar Cita');
  const [actionTarget, setActionTarget] = useState('booking');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Delivery options: immediate or scheduled
  const [deliveryMode, setDeliveryMode] = useState<'immediate' | 'scheduled'>('immediate');
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [scheduledTime, setScheduledTime] = useState('11:00');
  const [repeatInterval, setRepeatInterval] = useState<'none' | 'daily' | 'weekly'>('none');

  // Feedback toast
  const [successMsg, setSuccessMsg] = useState<{ text: string; count: number } | null>(null);

  // Calculate live audience matching current targeting filters
  const targetedUsers = useMemo(() => {
    return getTargetedUsers(targetRole, activityFilter);
  }, [getTargetedUsers, targetRole, activityFilter, users, appointments]);

  // Total user counts by role
  const clientCount = useMemo(() => users.filter((u) => u.role === 'client').length, [users]);
  const barberCount = useMemo(() => users.filter((u) => u.role === 'barber').length, [users]);
  const adminCount = useMemo(() => users.filter((u) => u.role === 'admin').length, [users]);

  // Scheduled count (only active scheduled ones)
  const pendingScheduledCount = useMemo(
    () => scheduledPushes.filter((p) => p.status === 'scheduled').length,
    [scheduledPushes]
  );
  const sentPushes = useMemo(
    () => scheduledPushes.filter((p) => p.status === 'sent'),
    [scheduledPushes]
  );

  // Quick Preset Templates
  const handleApplyPreset = (preset: {
    title: string;
    body: string;
    role: TargetAccountType;
    activity: TargetActivityFilter;
    category: 'promos' | 'citas' | 'lealtad' | 'sistema';
    action: string;
    target: string;
  }) => {
    setPushTitle(preset.title);
    setPushBody(preset.body);
    setTargetRole(preset.role);
    setActivityFilter(preset.activity);
    setPushCategory(preset.category);
    setActionLabel(preset.action);
    setActionTarget(preset.target);
  };

  const handleInsertVariable = (variableKey: string) => {
    setPushBody((prev) => `${prev} ${variableKey}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) return;

    if (deliveryMode === 'immediate') {
      const res = sendSegmentedPush({
        title: pushTitle,
        body: pushBody,
        targetRole,
        activityFilter,
        category: pushCategory,
        actionLabel: actionLabel.trim() || undefined,
        actionTarget: actionTarget || undefined,
        soundEnabled,
      });
      setSuccessMsg({
        text: `¡Notificación enviada en vivo a ${res.recipientsCount} usuarios con éxito!`,
        count: res.recipientsCount,
      });
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      createScheduledPush({
        title: pushTitle,
        body: pushBody,
        targetRole,
        activityFilter,
        scheduledDate,
        scheduledTime,
        repeatInterval,
        category: pushCategory,
        actionLabel: actionLabel.trim() || undefined,
        actionTarget: actionTarget || undefined,
        soundEnabled,
      });
      setSuccessMsg({
        text: `¡Campaña programada exitosamente para el ${scheduledDate} a las ${scheduledTime} (${targetedUsers.length} destinatarios estimados)!`,
        count: targetedUsers.length,
      });
      setTimeout(() => setSuccessMsg(null), 4000);
      setActiveTab('scheduled');
    }
  };

  // Human-readable labels for targeting badges
  const getRoleLabel = (role: TargetAccountType) => {
    switch (role) {
      case 'all':
        return 'Todos los Usuarios';
      case 'client':
        return 'Solo Clientes';
      case 'barber':
        return 'Solo Barberos';
      case 'admin':
        return 'Solo Administradores';
    }
  };

  const getActivityLabel = (act: TargetActivityFilter) => {
    switch (act) {
      case 'all':
        return 'Toda la Actividad';
      case 'active_recent':
        return 'Activos Recientes (< 14 días)';
      case 'inactive_20d':
        return 'Inactivos (> 20 días sin visita)';
      case 'has_upcoming':
        return 'Con Citas Próximas';
      case 'vip_frequent':
        return 'Clientes VIP / Frecuentes';
      case 'today_duty':
        return 'En Turno / Citas de Hoy';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Stats Overview */}
      <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black text-white">
                  Centro de Notificaciones Push & Segmentación
                </h3>
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  Marketing & Alertas
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configura, personaliza y calendariza mensajes push segmentando por tipo de cuenta y actividad reciente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-[#16202e] border border-[#232f42] rounded-xl px-3 py-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Total Usuarios</span>
              <p className="text-base font-black text-white">{users.length}</p>
            </div>
            <div className="bg-[#16202e] border border-[#232f42] rounded-xl px-3 py-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Clientes</span>
              <p className="text-base font-black text-amber-400">{clientCount}</p>
            </div>
            <div className="bg-[#16202e] border border-[#232f42] rounded-xl px-3 py-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Barberos</span>
              <p className="text-base font-black text-blue-400">{barberCount}</p>
            </div>
            <div className="bg-[#16202e] border border-[#232f42] rounded-xl px-3 py-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Programadas</span>
              <p className="text-base font-black text-emerald-400">{pendingScheduledCount}</p>
            </div>
          </div>
        </div>

        {/* Navigation sub-tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('composer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'composer'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                : 'bg-[#16202e] text-slate-300 hover:bg-[#1e2a3c] border border-[#253245]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Nueva Campaña & Segmentación</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'scheduled'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                : 'bg-[#16202e] text-slate-300 hover:bg-[#1e2a3c] border border-[#253245]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Notificaciones Programadas</span>
            {pendingScheduledCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-black font-black">
                {pendingScheduledCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                : 'bg-[#16202e] text-slate-300 hover:bg-[#1e2a3c] border border-[#253245]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial de Envíos</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-300">
              {sentPushes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('automations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'automations'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                : 'bg-[#16202e] text-slate-300 hover:bg-[#1e2a3c] border border-[#253245]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatizaciones Inteligentes</span>
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      {successMsg && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{successMsg.text}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-400 hover:text-white font-bold"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 1: COMPOSER & SEGMENTATION */}
      {/* ============================================================ */}
      {activeTab === 'composer' && (
        <div className="space-y-6">
          {/* Quick Presets Pills */}
          <div className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Plantillas Rápidas con 1 Clic (Presets)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: '💈 ¿Toca renovar tu estilo? - 15% Descuento',
                    body: 'Hola {nombre}, hace varias semanas desde tu último corte. Te esperamos en Gran Vía con 15% de dto. en tu reserva.',
                    role: 'client',
                    activity: 'inactive_20d',
                    category: 'promos',
                    action: 'Reservar con Dto.',
                    target: 'booking',
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-[#16202e] hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-xs font-semibold transition"
              >
                ⏳ Reactivar Clientes Inactivos
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: '✂️ Agenda de la Semana Abierta',
                    body: 'Atención {nombre}: La agenda de la próxima semana está habilitada para organizar turnos y pausas operativas.',
                    role: 'barber',
                    activity: 'all',
                    category: 'sistema',
                    action: 'Ver Mi Agenda',
                    target: 'agenda',
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-[#16202e] hover:bg-blue-950/40 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-blue-300 text-xs font-semibold transition"
              >
                ✂️ Aviso de Turnos a Barberos
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: '⭐ Beneficio Exclusivo Club Platino & Oro',
                    body: 'Hola {nombre}, por ser cliente frecuente tienes café de especialidad y masaje capilar de cortesía en tu próxima cita.',
                    role: 'client',
                    activity: 'vip_frequent',
                    category: 'lealtad',
                    action: 'Ver Beneficios',
                    target: 'rewards',
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-[#16202e] hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-xs font-semibold transition"
              >
                👑 Campaña Fidelidad Clientes VIP
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: '⏰ Recordatorio de Cita para Hoy',
                    body: 'Hola {nombre}, te recordamos tu cita programada para el día de hoy en Barbería Madrid. ¡Nos vemos en breve!',
                    role: 'client',
                    activity: 'today_duty',
                    category: 'citas',
                    action: 'Ver Mi Cita',
                    target: 'appointments',
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-[#16202e] hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition"
              >
                📅 Recordatorio de Citas de Hoy
              </button>

              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: '🛡️ Alerta de Seguridad & Auditoría',
                    body: 'Notificación para Administradores: Se ha verificado el respaldo de seguridad y la sincronización de inventario.',
                    role: 'admin',
                    activity: 'all',
                    category: 'sistema',
                    action: 'Panel Ajustes',
                    target: 'admin',
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-[#16202e] hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 text-xs font-semibold transition"
              >
                🛡️ Alerta de Sistema (Solo Admin)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: SEGMENTATION & CONFIGURATION (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. SECTION: SEGMENTATION ENGINE */}
                <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-amber-400" />
                      <h4 className="font-black text-white text-sm uppercase tracking-wider">
                        1. Segmentación de Destinatarios
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400">Paso 1 de 3</span>
                  </div>

                  {/* Account Type Filter */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Tipo de Cuenta (Rol)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'all', label: 'Todos', desc: `${users.length} usuarios`, icon: Users },
                        { id: 'client', label: 'Clientes', desc: `${clientCount} registrados`, icon: User },
                        { id: 'barber', label: 'Barberos', desc: `${barberCount} barberos`, icon: Scissors },
                        { id: 'admin', label: 'Admins', desc: `${adminCount} cuenta(s)`, icon: ShieldCheck },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = targetRole === item.id;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setTargetRole(item.id as TargetAccountType)}
                            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                                : 'bg-[#16202e] text-slate-300 border-[#232f42] hover:bg-[#1a2637]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <Icon className="w-4 h-4" />
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold leading-tight">{item.label}</p>
                              <span
                                className={`text-[10px] ${
                                  isSelected ? 'text-black/80 font-semibold' : 'text-slate-400'
                                }`}
                              >
                                {item.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity Filter */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Segmentación por Actividad Reciente
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        {
                          id: 'all',
                          title: 'Toda la Actividad',
                          desc: 'Sin distinción de visitas recientes o antigüedad',
                        },
                        {
                          id: 'active_recent',
                          title: 'Activos Recientemente',
                          desc: 'Con citas o actividad en los últimos 14 días',
                        },
                        {
                          id: 'inactive_20d',
                          title: 'Inactivos (> 20 días)',
                          desc: 'Sin citas recientes o cuentas en desuso para reactivación',
                        },
                        {
                          id: 'has_upcoming',
                          title: 'Con Citas Próximas',
                          desc: 'Citas pendientes o confirmadas a futuro',
                        },
                        {
                          id: 'vip_frequent',
                          title: 'Clientes VIP / Frecuentes',
                          desc: 'Nivel Oro / Platino o con más de 2 servicios completados',
                        },
                        {
                          id: 'today_duty',
                          title: 'En Turno / Citas de Hoy',
                          desc: 'Barberos asignados hoy o clientes con turno hoy',
                        },
                      ].map((item) => {
                        const isSelected = activityFilter === item.id;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setActivityFilter(item.id as TargetActivityFilter)}
                            className={`p-3 rounded-2xl border text-left transition ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                                : 'bg-[#16202e] border-[#232f42] text-slate-300 hover:bg-[#1b2535]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-bold">{item.title}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AUDIENCE AUDIT BOX */}
                  <div className="bg-[#151e2c] border border-amber-500/30 rounded-2xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-amber-400">
                            Audiencia Objetivo Calculada:
                          </span>
                          <span className="text-sm font-black text-white">
                            {targetedUsers.length} destinatarios
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Filtro: <strong className="text-slate-200">{getRoleLabel(targetRole)}</strong> +{' '}
                          <strong className="text-slate-200">{getActivityLabel(activityFilter)}</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowRecipientsList(!showRecipientsList)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <span>{showRecipientsList ? 'Ocultar Destinatarios' : 'Ver Destinatarios'}</span>
                        {showRecipientsList ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Recipients List */}
                    {showRecipientsList && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 max-h-56 overflow-y-auto space-y-2 pr-1">
                        {targetedUsers.length === 0 ? (
                          <div className="text-center py-4 text-slate-500 text-xs flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span>Ningún usuario coincide con los filtros seleccionados actualmente.</span>
                          </div>
                        ) : (
                          targetedUsers.map((u) => (
                            <div
                              key={u.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-[#111722] border border-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                                />
                                <div>
                                  <p className="font-bold text-white text-xs leading-none">{u.name}</p>
                                  <span className="text-[10px] text-slate-400">{u.email}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md ${
                                    u.role === 'admin'
                                      ? 'bg-purple-500/20 text-purple-300'
                                      : u.role === 'barber'
                                      ? 'bg-blue-500/20 text-blue-300'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {u.role}
                                </span>
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    u.active ? 'bg-emerald-400' : 'bg-red-400'
                                  }`}
                                  title={u.active ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. SECTION: MESSAGE CONTENT & VARIABLES */}
                <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <h4 className="font-black text-white text-sm uppercase tracking-wider">
                        2. Configuración del Contenido
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400">Paso 2 de 3</span>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Categoría de la Alerta
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'promos', label: 'Promoción', icon: '🎁', color: 'text-amber-400' },
                        { id: 'citas', label: 'Cita / Agenda', icon: '📅', color: 'text-blue-400' },
                        { id: 'lealtad', label: 'Club VIP', icon: '⭐', color: 'text-emerald-400' },
                        { id: 'sistema', label: 'Sistema', icon: '⚙️', color: 'text-purple-400' },
                      ].map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => setPushCategory(c.id as typeof pushCategory)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                            pushCategory === c.id
                              ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                              : 'bg-[#16202e] text-slate-300 border-[#232f42] hover:bg-[#1b2535]'
                          }`}
                        >
                          <span>{c.icon}</span>
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300">
                        Título de la Notificación
                      </label>
                      <span className="text-[10px] text-slate-500">{pushTitle.length} caracteres</span>
                    </div>
                    <input
                      type="text"
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      placeholder="Ej: 💈 Renueva tu corte este viernes"
                      className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  {/* Body Textarea with Dynamic Variable Helpers */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300">
                        Mensaje / Cuerpo de la Notificación
                      </label>
                      <span className="text-[10px] text-slate-500">{pushBody.length} caracteres</span>
                    </div>

                    <textarea
                      value={pushBody}
                      onChange={(e) => setPushBody(e.target.value)}
                      rows={3}
                      placeholder="Escribe el mensaje..."
                      className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                      required
                    />

                    {/* Variable insertion buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold mr-1">
                        Variables personalizadas:
                      </span>
                      {[
                        { key: '{nombre}', label: '+ Nombre del Usuario' },
                        { key: '{email}', label: '+ Email' },
                        { key: '{rol}', label: '+ Rol' },
                        { key: '{puntos}', label: '+ Puntos VIP' },
                      ].map((v) => (
                        <button
                          type="button"
                          key={v.key}
                          onClick={() => handleInsertVariable(v.key)}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono font-bold text-amber-300 border border-slate-700 transition"
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Action Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Texto del Botón de Acción (Opcional)
                      </label>
                      <input
                        type="text"
                        value={actionLabel}
                        onChange={(e) => setActionLabel(e.target.value)}
                        placeholder="Ej: Reservar Cita"
                        className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Destino de la Acción
                      </label>
                      <select
                        value={actionTarget}
                        onChange={(e) => setActionTarget(e.target.value)}
                        className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="booking">Abrir Reservas (Booking)</option>
                        <option value="agenda">Abrir Agenda del Barbero</option>
                        <option value="appointments">Mis Citas & Historial</option>
                        <option value="rewards">Club de Recompensas</option>
                        <option value="products">Tienda de Productos</option>
                        <option value="home">Página Principal</option>
                      </select>
                    </div>
                  </div>

                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Sonido Web Audio Nativo</p>
                        <p className="text-[10px] text-slate-400">
                          Reproduce campanada sonora al recibir la alerta en el dispositivo
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: DELIVERY OPTIONS & LIVE PREVIEW (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 3. SECTION: DELIVERY & SCHEDULING MODE */}
                <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <h4 className="font-black text-white text-sm uppercase tracking-wider">
                        3. Programación & Envío
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400">Paso 3 de 3</span>
                  </div>

                  {/* Delivery Mode Toggle */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#16202e] rounded-2xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('immediate')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        deliveryMode === 'immediate'
                          ? 'bg-amber-500 text-black shadow-md font-extrabold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Inmediato</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMode('scheduled')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        deliveryMode === 'scheduled'
                          ? 'bg-amber-500 text-black shadow-md font-extrabold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Programar</span>
                    </button>
                  </div>

                  {/* When Scheduled is active: Date, Time, Repeat */}
                  {deliveryMode === 'scheduled' && (
                    <div className="space-y-3 p-4 bg-[#151e2c] border border-slate-800 rounded-2xl animate-in fade-in zoom-in-95">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            Fecha de Envío
                          </label>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-[#111722] border border-[#253245] rounded-xl px-2.5 py-2 text-xs text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            Hora (HH:MM)
                          </label>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full bg-[#111722] border border-[#253245] rounded-xl px-2.5 py-2 text-xs text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Frecuencia de Repetición
                        </label>
                        <select
                          value={repeatInterval}
                          onChange={(e) => setRepeatInterval(e.target.value as typeof repeatInterval)}
                          className="w-full bg-[#111722] border border-[#253245] rounded-xl px-2.5 py-2 text-xs text-white"
                        >
                          <option value="none">Una sola vez (Sin repetición)</option>
                          <option value="daily">Repetir Diariamente a la misma hora</option>
                          <option value="weekly">Repetir Semanalmente (Mismo día y hora)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/40">
                        <Info className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>
                          Se calendarizará en la cola para emitirse a los {targetedUsers.length} destinatarios objetivo.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={targetedUsers.length === 0}
                    className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xl ${
                      targetedUsers.length === 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20 active:scale-[0.98]'
                    }`}
                  >
                    {deliveryMode === 'immediate' ? (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Emitir Alerta Ahora Mismo ({targetedUsers.length} usuarios)</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>Programar para {scheduledDate} {scheduledTime}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* LIVE PUSH PREVIEW CARD */}
                <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                        Previsualización en Vivo
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400">Mockup de Sistema</span>
                  </div>

                  {/* Mobile notification widget mockup */}
                  <div className="bg-gradient-to-br from-[#1a2332] to-[#121924] border border-[#2d3a4e] rounded-2xl p-4 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-amber-500 text-black flex items-center justify-center font-black text-[10px]">
                          BM
                        </div>
                        <span className="text-[11px] font-bold text-slate-200">BARBERÍA MADRID</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Ahora</span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {pushTitle || 'Título de la notificación'}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                        {pushBody
                          .replace(/{nombre}/g, currentUser.name || 'Juan Pérez')
                          .replace(/{email}/g, currentUser.email || 'juan@ejemplo.com')
                          .replace(/{rol}/g, 'Cliente')
                          .replace(/{puntos}/g, '350') || 'Cuerpo del mensaje...'}
                      </p>
                    </div>

                    {actionLabel && (
                      <div className="pt-2 flex justify-end">
                        <span className="px-3 py-1 rounded-lg bg-amber-500 text-black font-extrabold text-[10px] shadow">
                          {actionLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 text-center">
                    * El nombre y variables se sustituyen automáticamente por los datos reales de cada usuario destinatario.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: SCHEDULED NOTIFICATIONS QUEUE */}
      {/* ============================================================ */}
      {activeTab === 'scheduled' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Alertas Programadas en Cola
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Notificaciones calendarizadas para envío automático a segmentos específicos.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('composer')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Nueva Programación</span>
            </button>
          </div>

          {scheduledPushes.filter((p) => p.status === 'scheduled').length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <CalendarDays className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">
                No hay notificaciones push programadas actualmente.
              </p>
              <button
                onClick={() => setActiveTab('composer')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 text-xs font-bold transition"
              >
                Crear una campaña programada
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduledPushes
                .filter((p) => p.status === 'scheduled')
                .map((push) => (
                  <div
                    key={push.id}
                    className="bg-[#16202e] border border-[#253245] hover:border-amber-500/50 rounded-2xl p-4 shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {push.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {push.scheduledDate} a las {push.scheduledTime}
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          Programada
                        </span>
                      </div>

                      <h5 className="font-extrabold text-white text-sm leading-snug">{push.title}</h5>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{push.body}</p>

                      <div className="p-2.5 rounded-xl bg-[#111722] border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Segmento Objetivo:</span>
                          <span className="font-bold text-amber-400">
                            {getRoleLabel(push.targetRole)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Filtro de Actividad:</span>
                          <span className="text-slate-200 font-medium">
                            {getActivityLabel(push.activityFilter)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Destinatarios Alcanzados:</span>
                          <span className="font-bold text-white">
                            {push.recipientsCount} usuarios
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => deleteScheduledPush(push.id)}
                        className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/30 transition text-xs flex items-center gap-1"
                        title="Eliminar de la cola"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => cancelScheduledPush(push.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => executeScheduledPushNow(push.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition flex items-center gap-1 shadow"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Disparar Ahora</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: SENT CAMPAIGNS HISTORY */}
      {/* ============================================================ */}
      {activeTab === 'history' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                Historial de Alertas Emitidas
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Registro histórico de todas las notificaciones push enviadas a usuarios.
              </p>
            </div>
          </div>

          {sentPushes.length === 0 ? (
            <p className="text-center py-10 text-slate-500 text-xs">No hay envíos registrados aún.</p>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {sentPushes.map((push) => (
                <div key={push.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Enviada
                      </span>
                      <span className="text-xs font-bold text-white">{push.title}</span>
                      <span className="text-[11px] text-slate-500">
                        • {push.scheduledDate} ({push.scheduledTime})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{push.body}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        Rol: {getRoleLabel(push.targetRole)}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        Actividad: {getActivityLabel(push.activityFilter)}
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                        {push.recipientsCount} destinatarios alcanzados
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setPushTitle(push.title);
                        setPushBody(push.body);
                        setTargetRole(push.targetRole);
                        setActivityFilter(push.activityFilter);
                        setPushCategory(push.category);
                        setActiveTab('composer');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reutilizar Campaña</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteScheduledPush(push.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-950/20 transition"
                      title="Eliminar del historial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: SMART AUTOMATIONS (SYSTEM TRIGGERS) */}
      {/* ============================================================ */}
      {activeTab === 'automations' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Automatizaciones Inteligentes del Sistema
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Disparadores automáticos basados en eventos de clientes, lealtad y reservas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automations.map((auto) => (
              <div
                key={auto.id}
                className={`p-4 rounded-2xl border transition space-y-3 ${
                  auto.enabled
                    ? 'bg-[#151e2c] border-amber-500/40'
                    : 'bg-[#141b25] border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚡</span>
                    <h5 className="font-bold text-white text-xs">{auto.name}</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAutomation(auto.id)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      auto.enabled ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        auto.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">{auto.description}</p>

                <div className="p-3 bg-[#111722] rounded-xl border border-slate-800 space-y-1 text-xs">
                  <p className="font-bold text-amber-300 text-[11px]">{auto.templateTitle}</p>
                  <p className="text-slate-300 text-[11px] leading-snug">{auto.templateBody}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
