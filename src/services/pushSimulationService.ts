import { PushNotification, Appointment, Barber } from '../types/barbershop';

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  category: 'citas' | 'lealtad' | 'promos' | 'sistema';
  icon: string;
  generate: (context: {
    userName: string;
    preferredBarber?: Barber;
    appointment?: Appointment;
    points?: number;
  }) => Omit<PushNotification, 'id' | 'timestamp' | 'read'>;
}

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'status_in_progress',
    name: 'Alerta de Cita: Barbero Listo en Sillón',
    description: 'Notifica al cliente que su barbero ha preparado el puesto y le espera.',
    category: 'citas',
    icon: 'Scissors',
    generate: ({ userName, appointment, preferredBarber }) => {
      const barberName = appointment?.barberName || preferredBarber?.name || 'Carlos Hernández';
      const aptId = appointment?.id || 'APT-1082';
      return {
        title: `💈 ${barberName} está listo para atenderte`,
        body: `¡Hola ${userName}! Tu puesto en sillón principal está preparado en Gran Vía 123 (Cita ${aptId}).`,
        type: 'appointment',
        category: 'citas',
        appointmentId: aptId,
        actionLabel: 'Ver Pase Digital',
        actionTarget: 'appointments',
      };
    },
  },
  {
    id: 'status_completed',
    name: 'Cita Finalizada & Puntos Acumulados',
    description: 'Aviso de servicio completado con suma inmediata de puntos de fidelidad.',
    category: 'citas',
    icon: 'CheckCircle',
    generate: ({ userName, appointment }) => {
      const serviceName = appointment?.serviceName || 'Corte + Barba';
      return {
        title: `✂ ¡Gracias por tu visita, ${userName}!`,
        body: `Tu servicio "${serviceName}" ha sido completado. Se han añadido +50 puntos a tu cuenta Madrid VIP.`,
        type: 'appointment',
        category: 'citas',
        appointmentId: appointment?.id || 'APT-1082',
        actionLabel: 'Ver Puntos',
        actionTarget: 'loyalty',
      };
    },
  },
  {
    id: 'reminder_1h',
    name: 'Recordatorio Anticipado de Cita (1h)',
    description: 'Alerta push preventiva 60 minutos antes de la hora fijada.',
    category: 'citas',
    icon: 'Clock',
    generate: ({ appointment, preferredBarber }) => {
      const barberName = appointment?.barberName || preferredBarber?.name || 'Carlos Hernández';
      const time = appointment?.time || '11:00';
      return {
        title: `⏰ Recordatorio: Cita en 1 hora`,
        body: `Te esperamos a las ${time} hrs con ${barberName} en Calle Gran Vía 123. ¡Puntualidad garantizada!`,
        type: 'reminder',
        category: 'citas',
        appointmentId: appointment?.id,
        actionLabel: 'Ver Ruta',
        actionTarget: 'appointments',
      };
    },
  },
  {
    id: 'activity_inactive_21d',
    name: 'Inactividad de 3 Semanas (Comportamiento)',
    description: 'Personalizada según el tiempo transcurrido desde el último corte registrado.',
    category: 'promos',
    icon: 'Calendar',
    generate: ({ userName, preferredBarber }) => {
      const barber = preferredBarber?.name || 'Carlos Hernández';
      return {
        title: `✂ ¿Toca renovar tu estilo, ${userName}?`,
        body: `Hace 21 días de tu última visita. Tu barbero preferido ${barber} tiene 2 huecos libres hoy.`,
        type: 'promo',
        category: 'promos',
        actionLabel: 'Reservar con Carlos',
        actionTarget: 'book',
      };
    },
  },
  {
    id: 'loyalty_milestone',
    name: 'Recompensa VIP Desbloqueada',
    description: 'Notifica cuando el balance de puntos permite canjear un producto o servicio gratuito.',
    category: 'lealtad',
    icon: 'Award',
    generate: ({ userName, points = 350 }) => {
      return {
        title: `👑 ¡Tienes ${points} Puntos VIP listos para canjear!`,
        body: `¡Felicidades ${userName}! Puedes disfrutar hoy de un perfilado de barba o bálsamo de cortesía sin coste.`,
        type: 'loyalty',
        category: 'lealtad',
        actionLabel: 'Canjear Premio',
        actionTarget: 'loyalty',
      };
    },
  },
  {
    id: 'barber_opening',
    name: 'Hueco de Última Hora con Barbero Favorito',
    description: 'Avisa inmediatamente cuando se libera un turno con el barbero preferido.',
    category: 'promos',
    icon: 'Sparkles',
    generate: ({ userName, preferredBarber }) => {
      const bName = preferredBarber?.name || 'Carlos Hernández';
      return {
        title: `⚡ ¡Hueco disponible de última hora!`,
        body: `Hola ${userName}, se acaba de liberar un turno hoy a las 18:30 con ${bName}. ¡Resérvalo antes de que se agote!`,
        type: 'promo',
        category: 'promos',
        actionLabel: 'Aprovechar Turno',
        actionTarget: 'book',
      };
    },
  },
];
