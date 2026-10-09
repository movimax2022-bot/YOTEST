import { Language } from '../types/barbershop';

export interface Translations {
  address: string;
  schedule: string;
  welcome: string;
  tagline: string;
  heroDesc: string;
  bookAppointment: string;
  careYourStyle: string;
  ourServices: string;
  servicesSubtitle: string;
  makeReservation: string;
  reservationSubtitle: string;
  serviceLabel: string;
  selectService: string;
  barberLabel: string;
  allBarbers: string;
  dateLabel: string;
  selectDate: string;
  timeLabel: string;
  selectTime: string;
  continueBtn: string;
  reserveBtn: string;
  qualityStyleTrust: string;
  whyChooseUs: string;
  expertBarbers: string;
  expertBarbersDesc: string;
  premiumProducts: string;
  premiumProductsDesc: string;
  punctuality: string;
  punctualityDesc: string;
  uniqueAtmosphere: string;
  uniqueAtmosphereDesc: string;
  ourGallery: string;
  seeMore: string;
  nextAppointmentWaits: string;
  nextAppointmentDesc: string;
  bookNow: string;
  terms: string;
  privacy: string;
  contact: string;
  client: string;
  admin: string;
  logout: string;
  nav: {
    home: string;
    services: string;
    book: string;
    myAppointments: string;
    myProfile: string;
    history: string;
    portfolio: string;
    loyalty: string;
    adminPanel: string;
  };
  loyalty: {
    title: string;
    points: string;
    tier: string;
    stamps: string;
    stampsSub: string;
    redeem: string;
  };
  support: {
    title: string;
    callUs: string;
    chatWithUs: string;
    sendWhatsapp: string;
    faq: string;
  };
  sync: {
    cloudSynced: string;
    syncing: string;
    offline: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    address: 'Calle Gran Vía 123, Madrid',
    schedule: 'Lun - Sáb 9:00 - 21:00',
    welcome: 'BIENVENIDO A',
    tagline: 'Tu estilo, nuestra pasión',
    heroDesc: 'Cortes modernos, barba perfecta y un servicio profesional. Reserva tu cita y vive la experiencia.',
    bookAppointment: 'Reservar cita',
    careYourStyle: 'Cuidamos tu estilo',
    ourServices: 'Nuestros servicios',
    servicesSubtitle: 'Elige el servicio que mejor se adapte a ti',
    makeReservation: 'Haz tu reserva',
    reservationSubtitle: 'Selecciona el servicio, el día y la hora',
    serviceLabel: 'Servicio',
    selectService: 'Selecciona un servicio',
    barberLabel: 'Trabajador (opcional)',
    allBarbers: 'Todos los barberos',
    dateLabel: 'Fecha',
    selectDate: 'Selecciona fecha',
    timeLabel: 'Hora',
    selectTime: 'Selecciona hora',
    continueBtn: 'Continuar',
    reserveBtn: 'Reservar',
    qualityStyleTrust: 'Calidad • Estilo • Confianza',
    whyChooseUs: '¿Por qué elegirnos?',
    expertBarbers: 'Barberos expertos',
    expertBarbersDesc: 'Profesionales con años de experiencia.',
    premiumProducts: 'Productos premium',
    premiumProductsDesc: 'Cuidamos tu cabello y tu piel.',
    punctuality: 'Puntualidad',
    punctualityDesc: 'Tu tiempo es importante.',
    uniqueAtmosphere: 'Ambiente único',
    uniqueAtmosphereDesc: 'Un espacio diseñado para ti.',
    ourGallery: 'Nuestra galería',
    seeMore: 'Ver más',
    nextAppointmentWaits: 'Tu próxima cita te espera',
    nextAppointmentDesc: 'No dejes para mañana el corte que te hace mejor hoy.',
    bookNow: 'Reservar ahora',
    terms: 'Términos y condiciones',
    privacy: 'Política de privacidad',
    contact: 'Contacto',
    client: 'Cliente',
    admin: 'Administrador',
    logout: 'Cerrar sesión',
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      book: 'Reservar cita',
      myAppointments: 'Mis citas',
      myProfile: 'Mi perfil',
      history: 'Historial',
      portfolio: 'Portafolio de Cortes',
      loyalty: 'Club VIP & Puntos',
      adminPanel: 'Panel Administrativo',
    },
    loyalty: {
      title: 'Club de Fidelización Madrid VIP',
      points: 'Tus Puntos',
      tier: 'Nivel Actual',
      stamps: 'Tarjeta de Sellos Digital',
      stampsSub: '¡8 cortes = 1 corte completo GRATIS!',
      redeem: 'Canjear Recompensa',
    },
    support: {
      title: 'Soporte Técnico y Atención',
      callUs: 'Llámanos directamente',
      chatWithUs: 'Chat de soporte en vivo',
      sendWhatsapp: 'Escribir por WhatsApp',
      faq: 'Preguntas Frecuentes',
    },
    sync: {
      cloudSynced: 'Datos sincronizados en la nube',
      syncing: 'Sincronizando dispositivos...',
      offline: 'Modo sin conexión',
    },
  },
  en: {
    address: 'Calle Gran Vía 123, Madrid',
    schedule: 'Mon - Sat 9:00 - 21:00',
    welcome: 'WELCOME TO',
    tagline: 'Your style, our passion',
    heroDesc: 'Modern cuts, perfect beards, and professional master service. Book your appointment and experience the craft.',
    bookAppointment: 'Book appointment',
    careYourStyle: 'We care for your style',
    ourServices: 'Our services',
    servicesSubtitle: 'Choose the service that best suits your style',
    makeReservation: 'Make your reservation',
    reservationSubtitle: 'Select the service, day, and time',
    serviceLabel: 'Service',
    selectService: 'Select a service',
    barberLabel: 'Barber (optional)',
    allBarbers: 'All barbers',
    dateLabel: 'Date',
    selectDate: 'Select date',
    timeLabel: 'Time',
    selectTime: 'Select time',
    continueBtn: 'Continue',
    reserveBtn: 'Book',
    qualityStyleTrust: 'Quality • Style • Trust',
    whyChooseUs: 'Why choose us?',
    expertBarbers: 'Expert barbers',
    expertBarbersDesc: 'Master craftsmen with years of dedication.',
    premiumProducts: 'Premium products',
    premiumProductsDesc: 'Gentle care for your hair and skin.',
    punctuality: 'Punctuality',
    punctualityDesc: 'Your valuable time is our priority.',
    uniqueAtmosphere: 'Unique atmosphere',
    uniqueAtmosphereDesc: 'A sophisticated space tailored for you.',
    ourGallery: 'Our gallery',
    seeMore: 'View more',
    nextAppointmentWaits: 'Your next cut awaits',
    nextAppointmentDesc: "Don't leave for tomorrow the fresh cut you need today.",
    bookNow: 'Book now',
    terms: 'Terms and conditions',
    privacy: 'Privacy policy',
    contact: 'Contact',
    client: 'Client',
    admin: 'Administrator',
    logout: 'Log out',
    nav: {
      home: 'Home',
      services: 'Services',
      book: 'Book Appointment',
      myAppointments: 'My Appointments',
      myProfile: 'My Profile',
      history: 'History',
      portfolio: 'Cut Portfolio',
      loyalty: 'VIP Rewards',
      adminPanel: 'Admin Panel',
    },
    loyalty: {
      title: 'Madrid VIP Loyalty Club',
      points: 'Your Points',
      tier: 'Current Tier',
      stamps: 'Digital Stamp Card',
      stampsSub: '8 cuts = 1 free signature cut!',
      redeem: 'Redeem Reward',
    },
    support: {
      title: 'Customer & Technical Support',
      callUs: 'Direct Call',
      chatWithUs: 'Live Support Chat',
      sendWhatsapp: 'WhatsApp Chat',
      faq: 'Frequently Asked Questions',
    },
    sync: {
      cloudSynced: 'Cloud synchronized across devices',
      syncing: 'Syncing devices...',
      offline: 'Offline mode',
    },
  },
  fr: {
    address: 'Calle Gran Vía 123, Madrid',
    schedule: 'Lun - Sam 9:00 - 21:00',
    welcome: 'BIENVENUE À',
    tagline: 'Votre style, notre passion',
    heroDesc: 'Coupes modernes, barbe sculptée et service haut de gamme. Réservez votre rendez-vous.',
    bookAppointment: 'Prendre rendez-vous',
    careYourStyle: 'Nous soignons votre style',
    ourServices: 'Nos services',
    servicesSubtitle: 'Choisissez le service parfait pour vous',
    makeReservation: 'Faites votre réservation',
    reservationSubtitle: 'Sélectionnez le service, le jour et l’heure',
    serviceLabel: 'Service',
    selectService: 'Sélectionnez un service',
    barberLabel: 'Barbier (optionnel)',
    allBarbers: 'Tous les barbiers',
    dateLabel: 'Date',
    selectDate: 'Sélectionnez la date',
    timeLabel: 'Heure',
    selectTime: 'Sélectionnez l’heure',
    continueBtn: 'Continuer',
    reserveBtn: 'Réserver',
    qualityStyleTrust: 'Qualité • Style • Confiance',
    whyChooseUs: 'Pourquoi nous choisir ?',
    expertBarbers: 'Barbiers experts',
    expertBarbersDesc: 'Des artisans d’expérience reconnus.',
    premiumProducts: 'Produits premium',
    premiumProductsDesc: 'Soin d’exception pour vos cheveux.',
    punctuality: 'Ponctualité',
    punctualityDesc: 'Votre temps est précieux.',
    uniqueAtmosphere: 'Ambiance unique',
    uniqueAtmosphereDesc: 'Un espace conçu spécialement pour vous.',
    ourGallery: 'Notre galerie',
    seeMore: 'Voir plus',
    nextAppointmentWaits: 'Votre prochain rendez-vous vous attend',
    nextAppointmentDesc: 'Ne remettez pas à demain la coupe qui vous sublime.',
    bookNow: 'Réserver',
    terms: 'Conditions générales',
    privacy: 'Politique de confidentialité',
    contact: 'Contact',
    client: 'Client',
    admin: 'Administrateur',
    logout: 'Déconnexion',
    nav: {
      home: 'Accueil',
      services: 'Services',
      book: 'Réserver',
      myAppointments: 'Mes rendez-vous',
      myProfile: 'Mon profil',
      history: 'Historique',
      portfolio: 'Portfolio de coupes',
      loyalty: 'Club Fidélité',
      adminPanel: 'Panneau Admin',
    },
    loyalty: {
      title: 'Club Fidélité Madrid VIP',
      points: 'Vos Points',
      tier: 'Niveau Actuel',
      stamps: 'Carte de Tampons Numérique',
      stampsSub: '8 coupes = 1 coupe offerte !',
      redeem: 'Échanger',
    },
    support: {
      title: 'Support & Assistance',
      callUs: 'Appelez-nous',
      chatWithUs: 'Chat d’assistance',
      sendWhatsapp: 'Écrire sur WhatsApp',
      faq: 'Questions fréquentes',
    },
    sync: {
      cloudSynced: 'Synchronisé avec le cloud',
      syncing: 'Synchronisation en cours...',
      offline: 'Mode hors-ligne',
    },
  },
  pt: {
    address: 'Calle Gran Vía 123, Madrid',
    schedule: 'Seg - Sáb 9:00 - 21:00',
    welcome: 'BEM-VINDO À',
    tagline: 'Seu estilo, nossa paixão',
    heroDesc: 'Cortes modernos, barba impecável e atendimento de excelência. Agende seu horário.',
    bookAppointment: 'Agendar horário',
    careYourStyle: 'Cuidamos do seu estilo',
    ourServices: 'Nossos serviços',
    servicesSubtitle: 'Escolha o serviço perfeito para seu visual',
    makeReservation: 'Faça sua reserva',
    reservationSubtitle: 'Selecione o serviço, data e horário',
    serviceLabel: 'Serviço',
    selectService: 'Selecione um serviço',
    barberLabel: 'Barbeiro (opcional)',
    allBarbers: 'Todos os barbeiros',
    dateLabel: 'Data',
    selectDate: 'Selecione a data',
    timeLabel: 'Horário',
    selectTime: 'Selecione o horário',
    continueBtn: 'Continuar',
    reserveBtn: 'Reservar',
    qualityStyleTrust: 'Qualidade • Estilo • Confiança',
    whyChooseUs: 'Por que nos escolher?',
    expertBarbers: 'Barbeiros especialistas',
    expertBarbersDesc: 'Profissionais renomados com anos de bagagem.',
    premiumProducts: 'Produtos premium',
    premiumProductsDesc: 'Cuidado refinado com fios e pele.',
    punctuality: 'Pontualidade',
    punctualityDesc: 'Seu tempo é prioridade máxima.',
    uniqueAtmosphere: 'Ambiente exclusivo',
    uniqueAtmosphereDesc: 'Espaço requintado para relaxar.',
    ourGallery: 'Nossa galeria',
    seeMore: 'Ver mais',
    nextAppointmentWaits: 'Seu próximo horário te espera',
    nextAppointmentDesc: 'Não deixe para depois o corte que eleva sua autoestima.',
    bookNow: 'Agendar agora',
    terms: 'Termos e condições',
    privacy: 'Política de privacidade',
    contact: 'Contato',
    client: 'Cliente',
    admin: 'Administrador',
    logout: 'Sair da conta',
    nav: {
      home: 'Início',
      services: 'Serviços',
      book: 'Agendar horário',
      myAppointments: 'Meus agendamentos',
      myProfile: 'Meu perfil',
      history: 'Histórico',
      portfolio: 'Portfólio de Cortes',
      loyalty: 'Clube VIP & Pontos',
      adminPanel: 'Painel Admin',
    },
    loyalty: {
      title: 'Clube Fidelidade Madrid VIP',
      points: 'Seus Pontos',
      tier: 'Nível Atual',
      stamps: 'Cartão Fidelidade Digital',
      stampsSub: '8 cortes = 1 corte completo GRÁTIS!',
      redeem: 'Resgatar Recompensa',
    },
    support: {
      title: 'Suporte & Atendimento',
      callUs: 'Ligue agora',
      chatWithUs: 'Chat de atendimento',
      sendWhatsapp: 'Conversar no WhatsApp',
      faq: 'Perguntas Frequentes',
    },
    sync: {
      cloudSynced: 'Sincronizado na nuvem',
      syncing: 'Sincronizando dispositivos...',
      offline: 'Modo offline',
    },
  },
};
