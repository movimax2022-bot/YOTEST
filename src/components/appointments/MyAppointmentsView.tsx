import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  QrCode,
  Download,
  Share2,
  RotateCcw,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { Appointment } from '../../types/barbershop';

interface MyAppointmentsProps {
  filterType?: 'upcoming' | 'history' | 'all';
}

export const MyAppointmentsView: React.FC<MyAppointmentsProps> = ({ filterType = 'all' }) => {
  const {
    appointments,
    cancelAppointment,
    openBookingModal,
    formatPrice,
    sendPushNotification,
    hideClientAppointment,
    currentUser,
  } = useBarber();
  const [selectedAptQR, setSelectedAptQR] = useState<Appointment | null>(null);

  // Filter out appointments hidden by client AND enforce client privacy
  const visibleAppointments = appointments.filter((a) => {
    if (a.hiddenFromClient) return false;
    if (currentUser.role === 'client') {
      const matchEmail = currentUser.email && a.clientEmail && a.clientEmail.toLowerCase() === currentUser.email.toLowerCase();
      const matchName = currentUser.name && a.clientName && a.clientName.toLowerCase() === currentUser.name.toLowerCase();
      const matchPhone = currentUser.phone && a.clientPhone && a.clientPhone === currentUser.phone;
      return matchEmail || matchName || matchPhone;
    }
    return true;
  });

  const upcoming = visibleAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'in_progress' || a.status === 'pending'
  );
  const history = visibleAppointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  const displayList =
    filterType === 'upcoming'
      ? upcoming
      : filterType === 'history'
      ? history
      : visibleAppointments;

  const handleDownloadTicket = (apt: Appointment) => {
    sendPushNotification(
      'Ticket Digital Descargado',
      `Se ha guardado tu pase para ${apt.serviceName} (${apt.id}) en tus descargas.`,
      'system'
    );
  };

  const handleShareCalendar = (apt: Appointment) => {
    const calendarTitle = encodeURIComponent(`Cita en Barbería Madrid - ${apt.serviceName}`);
    const calendarDetails = encodeURIComponent(`Barbero: ${apt.barberName}. Gran Vía 123. Ref: ${apt.id}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&details=${calendarDetails}&location=Calle+Gran+Via+123+Madrid`;
    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {filterType === 'history' ? 'Historial de Visitas' : 'Mis Citas Reservadas'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Revisa tus próximas citas, descarga tu comprobante digital con código QR o repite tu corte favorito.
          </p>
        </div>

        <button
          onClick={() => openBookingModal()}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider transition flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* List */}
      {displayList.length === 0 ? (
        <div className="p-12 text-center bg-[#10151f] border border-[#1f293a] rounded-3xl">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No tienes citas registradas</h3>
          <p className="text-xs text-slate-400 mt-1">
            Reserva hoy mismo tu cita con tu barbero favorito en Barbería Madrid.
          </p>
          <button
            onClick={() => openBookingModal()}
            className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
          >
            Reservar ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayList.map((apt) => {
            const isConfirmed = apt.status === 'confirmed';
            const isInProgress = apt.status === 'in_progress';
            const isCompleted = apt.status === 'completed';
            const isCancelled = apt.status === 'cancelled';

            return (
              <div
                key={apt.id}
                className="bg-[#111722] border border-[#202b3d] rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-600/30">
                        {apt.id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(apt.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {isConfirmed && (
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmada
                        </span>
                      )}
                      {isInProgress && (
                        <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40 animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> En sillón
                        </span>
                      )}
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-800/40">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completada
                        </span>
                      )}
                      {isCancelled && (
                        <span className="flex items-center gap-1 text-red-400 bg-red-950/40 px-2 py-0.5 rounded-full border border-red-800/40">
                          <XCircle className="w-3.5 h-3.5" /> Cancelada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="py-4 space-y-2.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-base text-white">{apt.serviceName}</h4>
                      <span className="text-base font-black text-amber-400">
                        {formatPrice(apt.servicePrice)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>{apt.barberName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{apt.time} hrs</span>
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAptQR(apt)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                      title="Ver Código QR"
                    >
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver QR</span>
                    </button>

                    {(isConfirmed || isInProgress) && (
                      <button
                        onClick={() => handleShareCalendar(apt)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                        title="Añadir a Google Calendar"
                      >
                        <Share2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Calendario</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDownloadTicket(apt)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                      title="Descargar Ticket"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  {isConfirmed && (
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 py-1.5 px-3 rounded-xl hover:bg-red-950/30 transition"
                    >
                      Cancelar cita
                    </button>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => hideClientAppointment(apt.id)}
                        className="text-xs font-semibold text-slate-400 hover:text-red-400 py-1.5 px-2.5 rounded-xl hover:bg-slate-800 transition"
                        title="Ocultar esta cita de mi historial"
                      >
                        Ocultar del historial
                      </button>
                      <button
                        onClick={() =>
                          openBookingModal({
                            serviceId: apt.serviceId,
                            barberId: apt.barberId,
                          })
                        }
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 py-1.5 px-3 rounded-xl bg-amber-950/30 border border-amber-600/30 transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Repetir corte</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Quick Modal */}
      {selectedAptQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-center max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Ticket de Acceso Digital</h3>
            <p className="text-xs text-slate-400">
              Muestra este código en la recepción de Gran Vía 123
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
              <QrCode className="w-36 h-36 text-black" />
            </div>

            <div>
              <p className="font-mono text-sm font-bold text-amber-400">
                {selectedAptQR.qrCodeToken}
              </p>
              <p className="text-xs text-slate-300 font-semibold mt-1">
                {selectedAptQR.serviceName} • {selectedAptQR.date} a las {selectedAptQR.time}
              </p>
            </div>

            <button
              onClick={() => setSelectedAptQR(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
