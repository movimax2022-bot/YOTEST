import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Currency,
  ServiceItem,
  Barber,
  Appointment,
  PortfolioCut,
  LoyaltyReward,
  PushNotification,
  PushAutomationTrigger,
  SalonSettings,
  SalesAnalytics,
  PaymentMethod,
  Product,
  UserAccount,
  UserRole,
  ScheduledPushNotification,
  TargetAccountType,
  TargetActivityFilter,
  ActivityLog,
  ActivityLogCategory,
  ActivityLogActionType,
} from '../types/barbershop';
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_APPOINTMENTS,
  INITIAL_PORTFOLIO,
  INITIAL_LOYALTY_REWARDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUTOMATIONS,
  INITIAL_SETTINGS,
  INITIAL_ANALYTICS,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_SCHEDULED_PUSHES,
  INITIAL_ACTIVITY_LOGS,
} from '../data/mockData';
import { translations, Translations } from '../data/translations';
import { sounds } from '../utils/audio';
import { SIMULATION_SCENARIOS } from '../services/pushSimulationService';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  preferredBarberId: string | null;
  loyaltyPoints: number;
  stampsCount: number; // 0-8 (8 = free cut)
  loyaltyTier: 'Bronce' | 'Plata' | 'Oro' | 'Platino';
  biometricEnabled: boolean;
  role: UserRole;
}

interface BarberContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (eurPrice: number) => string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;

  // Legacy user compatibility + Full User Accounts & Auth
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentUser: UserAccount;
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  toggleUserActive: (id: string) => void;
  createManualClient: (data: {
    name: string;
    email: string;
    phone: string;
    initialPassword?: string;
    loyaltyPoints?: number;
  }) => { success: boolean; message: string };
  login: (email: string, password: string) => { success: boolean; message: string; user?: UserAccount };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string; user?: UserAccount };
  logout: () => void;
  changePassword: (currentPass: string, newPass: string, confirmPass: string) => { success: boolean; message: string };
  recoverPassword: (email: string) => { success: boolean; message: string };
  updateCurrentUserProfile: (data: Partial<UserAccount>) => void;
  switchUserRole: (role: UserRole) => void;

  // Auth Modal State
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot_password';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot_password') => void;

  // Preferred Barber
  togglePreferredBarber: (barberId: string) => void;

  // Data: Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  // Data: Services
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  addService: (s: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, s: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  toggleServiceAvailability: (id: string) => void;

  // Data: Barbers
  barbers: Barber[];
  setBarbers: React.Dispatch<React.SetStateAction<Barber[]>>;
  createBarberAccount: (data: {
    name: string;
    email: string;
    phone: string;
    initialPassword: string;
    specialty: string;
    role?: string;
    avatar: string;
    available?: boolean;
  }) => { success: boolean; message: string };
  updateBarber: (id: string, data: Partial<Barber>) => void;
  toggleBarberActive: (id: string) => void;
  deleteBarber: (id: string) => void;
  changeBarberPassword: (barberId: string, newPass: string) => { success: boolean; message: string };

  // Data: Appointments
  appointments: Appointment[];
  checkAvailability: (barberId: string, date: string, time: string, excludeAppointmentId?: string) => boolean;
  createAppointment: (data: {
    serviceId: string;
    barberId: string;
    date: string;
    time: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
  }) => Appointment;
  cancelAppointment: (id: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointmentDetails: (id: string, data: Partial<Appointment>) => void;
  hideClientAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;
  deleteCompletedAppointments: () => number;

  // Notifications & Push
  portfolio: PortfolioCut[];
  loyaltyRewards: LoyaltyReward[];
  notifications: PushNotification[];
  automations: PushAutomationTrigger[];
  settings: SalonSettings;
  updateSettings: (newSettings: Partial<SalonSettings>) => void;
  publishSettings: () => void;
  resetSettingsToDefault: () => void;
  updateHeroWelcomeImage: (imageUrl: string) => void;
  analytics: SalesAnalytics;

  // Activity Logs & Audit Trail
  activityLogs: ActivityLog[];
  logActivity: (entry: {
    category: ActivityLogCategory;
    actionType: ActivityLogActionType;
    title: string;
    description: string;
    itemAffected?: string;
    oldValue?: string;
    newValue?: string;
    imageThumbnail?: string;
    userId?: string;
    userName?: string;
    userRole?: string;
    userEmail?: string;
    userAvatar?: string;
    ipAddress?: string;
  }) => void;
  clearActivityLogs: () => void;
  resetActivityLogsToDefault: () => void;

  sendPushNotification: (
    title: string,
    body: string,
    options?: Partial<PushNotification> | PushNotification['type']
  ) => void;
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleAutomation: (id: string) => void;
  redeemReward: (reward: LoyaltyReward) => boolean;

  // Push Campaigns & Scheduling
  scheduledPushes: ScheduledPushNotification[];
  createScheduledPush: (data: Omit<ScheduledPushNotification, 'id' | 'createdAt' | 'status' | 'recipientsCount' | 'recipientNames'>) => ScheduledPushNotification;
  executeScheduledPushNow: (id: string) => void;
  cancelScheduledPush: (id: string) => void;
  deleteScheduledPush: (id: string) => void;
  sendSegmentedPush: (data: {
    title: string;
    body: string;
    targetRole: TargetAccountType;
    activityFilter: TargetActivityFilter;
    category?: 'citas' | 'lealtad' | 'promos' | 'sistema';
    actionLabel?: string;
    actionTarget?: string;
    soundEnabled?: boolean;
  }) => { recipientsCount: number; recipientNames: string[] };
  getTargetedUsers: (targetRole: TargetAccountType, activityFilter: TargetActivityFilter) => UserAccount[];

  // Active push toast banner
  toastPush: PushNotification | null;
  dismissToastPush: () => void;

  // Simulation service helper
  scheduledCountdown: { title: string; secondsRemaining: number } | null;
  triggerSimulatedScenario: (scenarioId: string, delaySeconds?: number) => void;

  // Booking Modal & Pre-selected params
  bookingModalOpen: boolean;
  openBookingModal: (preselected?: { serviceId?: string; barberId?: string; date?: string; time?: string }) => void;
  closeBookingModal: () => void;
  preselectedBooking: { serviceId?: string; barberId?: string; date?: string; time?: string } | null;

  // Modals & Biometrics
  biometricModalOpen: boolean;
  requestBiometricAuth: (onSuccess: () => void, promptMessage?: string) => void;
  closeBiometricModal: () => void;
  portfolioModalOpen: boolean;
  setPortfolioModalOpen: (open: boolean) => void;
  supportModalOpen: boolean;
  setSupportModalOpen: (open: boolean) => void;
  videoModalOpen: boolean;
  setVideoModalOpen: (open: boolean) => void;

  // Multi-device sync
  triggerManualSync: () => void;
  isSyncing: boolean;
  lastSyncedText: string;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('es');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Authentication State
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('bm_users');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('bm_currentUser');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_USERS[3]; // Default to Juan Pérez (Client)
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Sync Legacy user state with currentUser
  const [user, setUser] = useState<UserProfile>(() => ({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    avatar: currentUser.avatar,
    preferredBarberId: 'barber-1',
    loyaltyPoints: currentUser.loyaltyPoints ?? 350,
    stampsCount: currentUser.stampsCount ?? 5,
    loyaltyTier: currentUser.loyaltyTier ?? 'Oro',
    biometricEnabled: true,
    role: currentUser.role,
  }));

  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      avatar: currentUser.avatar,
      loyaltyPoints: currentUser.loyaltyPoints ?? prev.loyaltyPoints,
      stampsCount: currentUser.stampsCount ?? prev.stampsCount,
      loyaltyTier: currentUser.loyaltyTier ?? prev.loyaltyTier,
      role: currentUser.role,
    }));
  }, [currentUser]);

  // Persist users and currentUser
  useEffect(() => {
    localStorage.setItem('bm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bm_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bm_products');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('bm_products', JSON.stringify(products));
  }, [products]);

  // Services State
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('bm_services');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SERVICES;
  });

  useEffect(() => {
    localStorage.setItem('bm_services', JSON.stringify(services));
  }, [services]);

  // Barbers State
  const [barbers, setBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem('bm_barbers');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_BARBERS;
  });

  useEffect(() => {
    localStorage.setItem('bm_barbers', JSON.stringify(barbers));
  }, [barbers]);

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('bm_appointments');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_APPOINTMENTS;
  });

  useEffect(() => {
    localStorage.setItem('bm_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const [portfolio] = useState<PortfolioCut[]>(INITIAL_PORTFOLIO);
  const [loyaltyRewards] = useState<LoyaltyReward[]>(INITIAL_LOYALTY_REWARDS);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [automations, setAutomations] = useState<PushAutomationTrigger[]>(INITIAL_AUTOMATIONS);
  const [scheduledPushes, setScheduledPushes] = useState<ScheduledPushNotification[]>(() => {
    const saved = localStorage.getItem('bm_scheduled_pushes');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SCHEDULED_PUSHES;
  });

  useEffect(() => {
    localStorage.setItem('bm_scheduled_pushes', JSON.stringify(scheduledPushes));
  }, [scheduledPushes]);
  
  const [settings, setSettings] = useState<SalonSettings>(() => {
    const saved = localStorage.getItem('bm_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          visibleSections: {
            ...INITIAL_SETTINGS.visibleSections,
            ...(parsed.visibleSections || {}),
          },
          dailyHours: {
            ...INITIAL_SETTINGS.dailyHours,
            ...(parsed.dailyHours || {}),
          },
        };
      } catch { /* ignore */ }
    }
    return INITIAL_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('bm_settings', JSON.stringify(settings));
  }, [settings]);

  // Activity Logs & Audit Trail State
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('bm_activity_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('bm_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const [analytics, setAnalytics] = useState<SalesAnalytics>(INITIAL_ANALYTICS);

  // Active push toast banner & scheduled simulation state
  const [toastPush, setToastPush] = useState<PushNotification | null>(null);
  const [scheduledCountdown, setScheduledCountdown] = useState<{
    title: string;
    secondsRemaining: number;
  } | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedText, setLastSyncedText] = useState<string>('Ahora mismo');

  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [preselectedBooking, setPreselectedBooking] = useState<{
    serviceId?: string;
    barberId?: string;
    date?: string;
    time?: string;
  } | null>(null);

  const [biometricModalOpen, setBiometricModalOpen] = useState<boolean>(false);
  const [biometricCallback, setBiometricCallback] = useState<(() => void) | null>(null);

  const [portfolioModalOpen, setPortfolioModalOpen] = useState<boolean>(false);
  const [supportModalOpen, setSupportModalOpen] = useState<boolean>(false);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for storage events across tabs to simulate multi-device synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'bm_appointments' && e.newValue) {
        try {
          setAppointments(JSON.parse(e.newValue));
          setLastSyncedText('Sincronizado vía multi-dispositivo');
          sounds.playNotification();
        } catch { /* ignore */ }
      }
      if (e.key === 'bm_currentUser' && e.newValue) {
        try {
          setCurrentUser(JSON.parse(e.newValue));
        } catch { /* ignore */ }
      }
      if (e.key === 'bm_products' && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch { /* ignore */ }
      }
      if (e.key === 'bm_services' && e.newValue) {
        try {
          setServices(JSON.parse(e.newValue));
        } catch { /* ignore */ }
      }
      if (e.key === 'bm_barbers' && e.newValue) {
        try {
          setBarbers(JSON.parse(e.newValue));
        } catch { /* ignore */ }
      }
      if (e.key === 'bm_settings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const t = translations[language];

  const formatPrice = (eurPrice: number): string => {
    if (currency === 'USD') {
      const usdPrice = (eurPrice * 1.08).toFixed(0);
      return `$${usdPrice}`;
    }
    return `€${eurPrice}`;
  };

  // --- AUTHENTICATION METHODS ---
  const login = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, message: 'No existe ninguna cuenta registrada con este correo electrónico.' };
    }

    if (!foundUser.active) {
      return { success: false, message: 'Esta cuenta está desactivada. Contacta con la administración.' };
    }

    if (foundUser.passwordHash !== password) {
      return { success: false, message: 'La contraseña introducida es incorrecta.' };
    }

    setCurrentUser(foundUser);
    sounds.playSuccess();

    // Redirect to matching portal
    if (foundUser.role === 'admin') {
      setActiveTab('admin');
    } else if (foundUser.role === 'barber') {
      setActiveTab('barber-portal');
    } else {
      setActiveTab('home');
    }

    sendPushNotification(
      `¡Bienvenido de nuevo, ${foundUser.name}!`,
      `Sesión iniciada correctamente como ${foundUser.role === 'admin' ? 'Administrador' : foundUser.role === 'barber' ? 'Barbero' : 'Cliente'}.`,
      { type: 'system', category: 'sistema' }
    );

    return { success: true, message: 'Inicio de sesión correcto.', user: foundUser };
  };

  const register = (name: string, email: string, phone: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'La contraseña debe tener un mínimo de 6 caracteres.' };
    }

    const newUser: UserAccount = {
      id: `user-client-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim() || '+34 600 000 000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'client',
      passwordHash: password,
      active: true,
      loyaltyPoints: 100, // Welcome bonus points!
      stampsCount: 0,
      loyaltyTier: 'Bronce',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    sounds.playSuccess();
    setActiveTab('home');

    sendPushNotification(
      '¡Bienvenido a Barbería Madrid!',
      `Hola ${newUser.name}, tu cuenta ha sido creada. ¡Has recibido +100 Puntos de bienvenida en el Club VIP!`,
      { type: 'loyalty', category: 'lealtad' }
    );

    return { success: true, message: 'Cuenta creada con éxito.', user: newUser };
  };

  const logout = () => {
    // Revert to client guest or prompt
    const defaultGuest = INITIAL_USERS[3];
    setCurrentUser(defaultGuest);
    setActiveTab('home');
    sounds.playNotification();
    sendPushNotification(
      'Sesión Cerrada',
      'Has cerrado sesión de forma segura.',
      { type: 'system', category: 'sistema' }
    );
  };

  const changePassword = (currentPass: string, newPass: string, confirmPass: string) => {
    if (currentUser.passwordHash !== currentPass) {
      return { success: false, message: 'La contraseña actual no es correcta.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };
    }
    if (newPass !== confirmPass) {
      return { success: false, message: 'La nueva contraseña y su confirmación no coinciden.' };
    }

    const updatedUser = { ...currentUser, passwordHash: newPass };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    sounds.playSuccess();

    sendPushNotification(
      'Contraseña Modificada',
      'Tu contraseña ha sido actualizada con éxito y de forma segura.',
      { type: 'system', category: 'sistema' }
    );

    return { success: true, message: 'Contraseña actualizada correctamente.' };
  };

  const recoverPassword = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'No se encontró ninguna cuenta asociada a este correo electrónico.' };
    }

    sounds.playNotification();
    sendPushNotification(
      'Instrucciones de Recuperación Enviadas',
      `Hemos enviado un enlace seguro de restablecimiento a ${cleanEmail}. (Contraseña de demostración: "${found.passwordHash}")`,
      { type: 'system', category: 'sistema' }
    );

    return { success: true, message: `Instrucciones de recuperación enviadas a ${cleanEmail}.` };
  };

  const updateCurrentUserProfile = (data: Partial<UserAccount>) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    // If role is barber and barberId is set, sync with barber entity
    if (updated.role === 'barber' && updated.barberId) {
      setBarbers((prev) =>
        prev.map((b) =>
          b.id === updated.barberId
            ? { ...b, name: updated.name, avatar: updated.avatar, phone: updated.phone }
            : b
        )
      );
    }

    sounds.playSuccess();
    sendPushNotification(
      'Perfil Actualizado',
      'Tus datos han sido guardados correctamente.',
      { type: 'system', category: 'sistema' }
    );
  };

  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || {
      id: `user-${role}-${Date.now()}`,
      name: role === 'admin' ? 'Administrador Madrid' : role === 'barber' ? 'Carlos Hernández' : 'Juan Pérez',
      email: `${role}@barberiamadrid.es`,
      phone: '+34 912 345 678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role,
      passwordHash: `${role}123`,
      active: true,
      barberId: role === 'barber' ? 'barber-1' : undefined,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(targetUser);
    sounds.playBiometric();

    if (role === 'admin') setActiveTab('admin');
    else if (role === 'barber') setActiveTab('barber-portal');
    else setActiveTab('home');

    sendPushNotification(
      'Rol Cambiado',
      `Ahora estás visualizando el sistema como ${role === 'admin' ? 'Administrador' : role === 'barber' ? 'Barbero' : 'Cliente'}.`,
      { type: 'system', category: 'sistema' }
    );
  };

  const toggleUserActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
    sounds.playNotification();
  };

  const createManualClient = ({
    name,
    email,
    phone,
    initialPassword = 'cliente123',
    loyaltyPoints = 100,
  }: {
    name: string;
    email: string;
    phone: string;
    initialPassword?: string;
    loyaltyPoints?: number;
  }) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Ya existe un usuario con este correo electrónico.' };
    }

    const newClient: UserAccount = {
      id: `user-client-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim() || '+34 600 000 000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'client',
      passwordHash: initialPassword,
      active: true,
      loyaltyPoints: loyaltyPoints,
      stampsCount: 0,
      loyaltyTier: loyaltyPoints >= 500 ? 'Oro' : loyaltyPoints >= 200 ? 'Plata' : 'Bronce',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newClient]);
    sounds.playSuccess();
    sendPushNotification(
      'Nuevo Cliente Registrado',
      `${name} ha sido dado de alta en la base de datos de clientes.`,
      { type: 'system', category: 'sistema' }
    );
    return { success: true, message: 'Cliente registrado correctamente.' };
  };

  // --- PRODUCTS MANAGEMENT ---
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    logActivity({
      category: 'catalog',
      actionType: 'product_update',
      title: 'Nuevo Producto en Tienda',
      description: `Se añadió "${newProd.name}" con precio de ${newProd.price} €.`,
      itemAffected: `Producto: ${newProd.name}`,
      newValue: `${newProd.price} € (${newProd.stock} uds)`,
      imageThumbnail: newProd.image,
    });
    sounds.playSuccess();
    sendPushNotification(
      'Nuevo Producto Disponible',
      `"${newProd.name}" ha sido añadido a la tienda de la barbería.`,
      { type: 'promo', category: 'promos' }
    );
  };

  const updateProduct = (id: string, prod: Partial<Product>) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...prod } : p)));
    logActivity({
      category: 'catalog',
      actionType: 'product_update',
      title: 'Producto de Tienda Actualizado',
      description: `Se modificaron los datos o fotografía de "${prod.name || target?.name}".`,
      itemAffected: `Producto: ${target?.name}`,
      imageThumbnail: prod.image || target?.image,
    });
    sounds.playSuccess();
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logActivity({
      category: 'catalog',
      actionType: 'product_update',
      title: 'Producto Eliminado',
      description: `Se eliminó el producto "${target?.name}" del catálogo.`,
      itemAffected: `Producto: ${target?.name}`,
    });
    sounds.playNotification();
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  // --- SERVICES MANAGEMENT ---
  const addService = (s: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...s,
      id: `serv-${Date.now()}`,
      availableForBooking: s.availableForBooking ?? true,
    };
    setServices((prev) => [...prev, newService]);
    logActivity({
      category: 'catalog',
      actionType: 'service_update',
      title: 'Nuevo Servicio Creado',
      description: `Se añadió "${newService.name}" con tarifa de ${newService.price} €.`,
      itemAffected: `Servicio: ${newService.name}`,
      newValue: `${newService.price} € (${newService.duration} min)`,
      imageThumbnail: newService.image,
    });
    sounds.playSuccess();
    sendPushNotification(
      'Nuevo Servicio Añadido',
      `"${newService.name}" ya está disponible para reservas por €${newService.price}.`,
      { type: 'promo', category: 'promos' }
    );
  };

  const updateService = (id: string, s: Partial<ServiceItem>) => {
    const target = services.find((srv) => srv.id === id);
    setServices((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
    logActivity({
      category: 'catalog',
      actionType: 'service_update',
      title: 'Servicio Modificado',
      description: `Se actualizaron los datos o precio de "${s.name || target?.name}".`,
      itemAffected: `Servicio: ${target?.name}`,
      imageThumbnail: s.image || target?.image,
    });
    sounds.playSuccess();
  };

  const deleteService = (id: string) => {
    const target = services.find((srv) => srv.id === id);
    setServices((prev) => prev.filter((item) => item.id !== id));
    logActivity({
      category: 'catalog',
      actionType: 'service_update',
      title: 'Servicio Retirado',
      description: `Se eliminó el servicio "${target?.name}".`,
      itemAffected: `Servicio: ${target?.name}`,
    });
    sounds.playNotification();
  };

  const toggleServiceAvailability = (id: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, availableForBooking: !item.availableForBooking } : item
      )
    );
  };

  // --- BARBERS MANAGEMENT & ACCOUNT CREATION ---
  const createBarberAccount = ({
    name,
    email,
    phone,
    initialPassword,
    specialty,
    role = 'Barbero Profesional',
    avatar,
    available = true,
  }: {
    name: string;
    email: string;
    phone: string;
    initialPassword: string;
    specialty: string;
    role?: string;
    avatar: string;
    available?: boolean;
  }) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Ya existe una cuenta con este correo.' };
    }

    const barberId = `barber-${Date.now()}`;
    const newBarber: Barber = {
      id: barberId,
      name: name.trim(),
      role: role.trim(),
      rating: 5.0,
      reviewsCount: 1,
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      specialty: specialty.trim() || 'Degradados, tijera y arreglo de barba',
      experienceYears: 5,
      available: available ?? true,
      active: true,
      email: cleanEmail,
      phone: phone.trim(),
      instagram: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      completedCuts: 0,
    };

    const newBarberUser: UserAccount = {
      id: `user-barber-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      avatar: newBarber.avatar,
      role: 'barber',
      barberId: barberId,
      passwordHash: initialPassword || 'barber123',
      active: true,
      createdAt: new Date().toISOString(),
    };

    setBarbers((prev) => [...prev, newBarber]);
    setUsers((prev) => [...prev, newBarberUser]);
    logActivity({
      category: 'team',
      actionType: 'barber_update',
      title: 'Alta de Nuevo Barbero',
      description: `Se registró al barbero "${name}" con especialidad en ${specialty}.`,
      itemAffected: `Barbero: ${name}`,
      imageThumbnail: newBarber.avatar,
    });
    sounds.playSuccess();

    sendPushNotification(
      'Cuenta de Barbero Creada',
      `${name} ha sido dado de alta y ya puede acceder al Portal de Barberos.`,
      { type: 'system', category: 'sistema' }
    );

    return { success: true, message: 'Barbero y cuenta de acceso creados correctamente.' };
  };

  const updateBarber = (id: string, data: Partial<Barber>) => {
    const targetBarber = barbers.find((b) => b.id === id);
    setBarbers((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    // Sync matching user account if email or name changes
    setUsers((prev) =>
      prev.map((u) =>
        u.barberId === id
          ? {
              ...u,
              name: data.name ?? u.name,
              avatar: data.avatar ?? u.avatar,
              phone: data.phone ?? u.phone,
              email: data.email ?? u.email,
            }
          : u
      )
    );
    logActivity({
      category: 'team',
      actionType: 'barber_update',
      title: data.avatar && data.avatar !== targetBarber?.avatar
        ? 'Foto de Barbero Actualizada'
        : 'Perfil de Barbero Modificado',
      description: `Se actualizaron los datos o fotografía de ${data.name || targetBarber?.name || 'barbero'}.`,
      itemAffected: `Barbero: ${targetBarber?.name}`,
      imageThumbnail: data.avatar || targetBarber?.avatar,
    });
    sounds.playSuccess();
  };

  const toggleBarberActive = (id: string) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: b.active === false ? true : false, available: !b.available } : b))
    );
    setUsers((prev) =>
      prev.map((u) => (u.barberId === id ? { ...u, active: !u.active } : u))
    );
  };

  const deleteBarber = (id: string) => {
    setBarbers((prev) => prev.filter((b) => b.id !== id));
    setUsers((prev) => prev.filter((u) => u.barberId !== id));
    sounds.playNotification();
  };

  const changeBarberPassword = (barberId: string, newPass: string) => {
    if (newPass.length < 6) {
      return { success: false, message: 'La contraseña debe tener mínimo 6 caracteres.' };
    }
    setUsers((prev) =>
      prev.map((u) => (u.barberId === barberId ? { ...u, passwordHash: newPass } : u))
    );
    sounds.playSuccess();
    return { success: true, message: 'Contraseña del barbero actualizada correctamente.' };
  };

  // --- APPOINTMENTS MANAGEMENT ---
  const checkAvailability = (
    barberId: string,
    date: string,
    time: string,
    excludeAppointmentId?: string
  ): boolean => {
    // Check if another non-cancelled appointment already occupies this slot with the same barber
    const collision = appointments.some(
      (a) =>
        a.id !== excludeAppointmentId &&
        a.barberId === barberId &&
        a.date === date &&
        a.time === time &&
        a.status !== 'cancelled'
    );
    return !collision;
  };

  const createAppointment = ({
    serviceId,
    barberId,
    date,
    time,
    paymentMethod,
    notes,
    clientName,
    clientPhone,
    clientEmail,
  }: {
    serviceId: string;
    barberId: string;
    date: string;
    time: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
  }): Appointment => {
    const service = services.find((s) => s.id === serviceId) || services[0];
    const barber = barbers.find((b) => b.id === barberId) || barbers[0];
    const newId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: newId,
      clientName: clientName || currentUser.name,
      clientPhone: clientPhone || currentUser.phone,
      clientEmail: clientEmail || currentUser.email,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      barberId: barber.id,
      barberName: barber.name,
      date,
      time,
      duration: service.duration,
      status: 'confirmed',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      notes: notes || '',
      qrCodeToken: `BM-2026-${newId}`,
      createdAt: new Date().toISOString(),
      hiddenFromClient: false,
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Update loyalty points and stamps if booked by client
    const pointsGained = Math.round(service.price * 2);
    if (currentUser.role === 'client') {
      const nextStamps = ((currentUser.stampsCount ?? 0) + 1) % 8;
      const nextPoints = (currentUser.loyaltyPoints ?? 0) + pointsGained;
      let nextTier: 'Bronce' | 'Plata' | 'Oro' | 'Platino' = currentUser.loyaltyTier || 'Bronce';
      if (nextPoints >= 1000) nextTier = 'Platino';
      else if (nextPoints >= 500) nextTier = 'Oro';
      else if (nextPoints >= 200) nextTier = 'Plata';

      updateCurrentUserProfile({
        loyaltyPoints: nextPoints,
        stampsCount: nextStamps,
        loyaltyTier: nextTier,
      });
    }

    // Update real-time analytics
    setAnalytics((prev) => ({
      ...prev,
      dailyRevenue: prev.dailyRevenue + service.price,
      monthlyRevenue: prev.monthlyRevenue + service.price,
      totalAppointments: prev.totalAppointments + 1,
    }));

    sendPushNotification(
      '¡Cita confirmada con éxito!',
      `Te esperamos el ${date} a las ${time} con ${barber.name}. +${pointsGained} puntos de lealtad ganados.`,
      {
        type: 'appointment',
        category: 'citas',
        appointmentId: newId,
        actionLabel: 'Ver Pase Digital',
        actionTarget: 'appointments',
      }
    );

    sounds.playSuccess();
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
    sendPushNotification(
      'Cita cancelada',
      'Tu cita ha sido cancelada correctamente. Puedes volver a reservar cuando gustes.',
      { type: 'appointment', category: 'citas', appointmentId: id }
    );
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const targetApt = appointments.find((a) => a.id === id);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    if (targetApt) {
      if (status === 'in_progress') {
        sendPushNotification(
          `💈 ${targetApt.barberName} está listo para atenderte`,
          `¡Tu turno ha comenzado! Pasa al sillón principal para "${targetApt.serviceName}" en Gran Vía 123. (Cita ${targetApt.id})`,
          {
            type: 'appointment',
            category: 'citas',
            appointmentId: targetApt.id,
            actionLabel: 'Ver Pase Digital',
            actionTarget: 'appointments',
          }
        );
      } else if (status === 'completed') {
        sendPushNotification(
          `✂ ¡Cita completada con éxito!`,
          `Tu corte "${targetApt.serviceName}" con ${targetApt.barberName} ha finalizado. Se han añadido +50 Puntos VIP.`,
          {
            type: 'appointment',
            category: 'citas',
            appointmentId: targetApt.id,
            actionLabel: 'Ver Historial',
            actionTarget: 'history',
          }
        );
      } else if (status === 'cancelled') {
        sendPushNotification(
          `Cita cancelada`,
          `La reserva ${targetApt.id} (${targetApt.serviceName}) ha sido cancelada.`,
          {
            type: 'appointment',
            category: 'citas',
            appointmentId: targetApt.id,
          }
        );
      } else if (status === 'confirmed') {
        sendPushNotification(
          `Cita confirmada`,
          `Tu cita ${targetApt.id} para el ${targetApt.date} a las ${targetApt.time} está confirmada con ${targetApt.barberName}.`,
          {
            type: 'appointment',
            category: 'citas',
            appointmentId: targetApt.id,
          }
        );
      }
    }
  };

  const updateAppointmentDetails = (id: string, data: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
    sounds.playSuccess();
    sendPushNotification(
      'Cita Modificada',
      `Los datos de la cita ${id} han sido actualizados por la administración.`,
      { type: 'appointment', category: 'citas', appointmentId: id }
    );
  };

  const hideClientAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, hiddenFromClient: true } : a))
    );
    sounds.playNotification();
    sendPushNotification(
      'Cita Ocultada del Historial',
      'La cita ha sido eliminada de tu vista personal de historial.',
      { type: 'system', category: 'citas' }
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    sounds.playNotification();
  };

  const deleteCompletedAppointments = (): number => {
    const completedCount = appointments.filter((a) => a.status === 'completed').length;
    setAppointments((prev) => prev.filter((a) => a.status !== 'completed'));
    sounds.playSuccess();
    sendPushNotification(
      'Citas Completadas Eliminadas',
      `Se han eliminado ${completedCount} citas completadas del registro de la barbería.`,
      { type: 'system', category: 'sistema' }
    );
    return completedCount;
  };

  // --- ACTIVITY LOGS & AUDIT TRAIL ---
  const logActivity = (entry: {
    category: ActivityLogCategory;
    actionType: ActivityLogActionType;
    title: string;
    description: string;
    itemAffected?: string;
    oldValue?: string;
    newValue?: string;
    imageThumbnail?: string;
    userId?: string;
    userName?: string;
    userRole?: string;
    userEmail?: string;
    userAvatar?: string;
    ipAddress?: string;
  }) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: entry.userId || currentUser.id,
      userName: entry.userName || currentUser.name,
      userRole: entry.userRole || currentUser.role,
      userEmail: entry.userEmail || currentUser.email,
      userAvatar: entry.userAvatar || currentUser.avatar,
      category: entry.category,
      actionType: entry.actionType,
      title: entry.title,
      description: entry.description,
      itemAffected: entry.itemAffected,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      imageThumbnail: entry.imageThumbnail,
      ipAddress: entry.ipAddress || '192.168.1.45 (Madrid, ES)',
    };

    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    sounds.playNotification();
  };

  const resetActivityLogsToDefault = () => {
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    sounds.playSuccess();
  };

  // --- WELCOME IMAGE & SETTINGS ---
  const updateSettings = (newSettings: Partial<SalonSettings>) => {
    setSettings((prev) => {
      // Automatic activity log detection
      if (newSettings.heroWelcomeImage && newSettings.heroWelcomeImage !== prev.heroWelcomeImage) {
        logActivity({
          category: 'images',
          actionType: 'image_update',
          title: 'Actualización de Imagen de Portada',
          description: 'Se actualizó la fotografía principal del banner de bienvenida.',
          itemAffected: 'Imagen de Portada (heroWelcomeImage)',
          oldValue: prev.heroWelcomeImage,
          newValue: newSettings.heroWelcomeImage,
          imageThumbnail: newSettings.heroWelcomeImage,
        });
      } else if (newSettings.customLogoUrl !== undefined && newSettings.customLogoUrl !== prev.customLogoUrl) {
        logActivity({
          category: 'images',
          actionType: 'image_update',
          title: newSettings.customLogoUrl ? 'Logotipo Personalizado Actualizado' : 'Logotipo Personalizado Eliminado',
          description: newSettings.customLogoUrl
            ? 'Se configuró un nuevo logotipo oficial para la cabecera y pie de página.'
            : 'Se restableció el emblema predeterminado de Barbería Madrid.',
          itemAffected: 'Logotipo Oficial (customLogoUrl)',
          oldValue: prev.customLogoUrl || 'Emblema por defecto',
          newValue: newSettings.customLogoUrl || 'Restaurado por defecto',
          imageThumbnail: newSettings.customLogoUrl,
        });
      } else if (newSettings.shopName && newSettings.shopName !== prev.shopName) {
        logActivity({
          category: 'settings',
          actionType: 'setting_change',
          title: 'Cambio de Nombre del Negocio',
          description: `Se modificó el nombre oficial a "${newSettings.shopName}".`,
          itemAffected: 'shopName',
          oldValue: prev.shopName,
          newValue: newSettings.shopName,
        });
      } else if (newSettings.themePrimaryColor && newSettings.themePrimaryColor !== prev.themePrimaryColor) {
        logActivity({
          category: 'branding',
          actionType: 'theme_change',
          title: 'Cambio de Paleta de Colores',
          description: `Se actualizó el tono de acento visual a "${newSettings.themePrimaryColor}".`,
          itemAffected: 'themePrimaryColor',
          oldValue: prev.themePrimaryColor,
          newValue: newSettings.themePrimaryColor,
        });
      } else {
        const changedKeys = Object.keys(newSettings).slice(0, 3).join(', ');
        logActivity({
          category: 'settings',
          actionType: 'setting_change',
          title: 'Configuración Web Modificada',
          description: `El usuario guardó cambios en los parámetros: ${changedKeys}.`,
          itemAffected: changedKeys,
        });
      }

      return { ...prev, ...newSettings };
    });
  };

  const publishSettings = () => {
    setSettings((prev) => ({
      ...prev,
      isPublished: true,
      lastPublishedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    }));
    logActivity({
      category: 'branding',
      actionType: 'customization_publish',
      title: 'Publicación de Cambios Web',
      description: 'Se publicaron los cambios de diseño y contenidos en el sitio web para todos los clientes.',
      itemAffected: 'Estado de Publicación (isPublished)',
      oldValue: 'Borrador sin publicar',
      newValue: 'Publicado y visible en producción',
    });
    sounds.playSuccess();
    sendPushNotification(
      '🚀 Cambios Publicados',
      'La nueva configuración y personalización de la página web ya está visible para todos los clientes.',
      { type: 'system', category: 'sistema' }
    );
  };

  const resetSettingsToDefault = () => {
    setSettings(INITIAL_SETTINGS);
    logActivity({
      category: 'settings',
      actionType: 'customization_reset',
      title: 'Restauración de Configuración Predeterminada',
      description: 'Se restablecieron todos los textos, imágenes iniciales y colores de la página.',
      itemAffected: 'Configuración General',
    });
    sounds.playNotification();
    sendPushNotification(
      'Configuración Restaurada',
      'Se han restablecido los valores de diseño y textos predeterminados de la barbería.',
      { type: 'system', category: 'sistema' }
    );
  };

  const updateHeroWelcomeImage = (imageUrl: string) => {
    setSettings((prev) => {
      const prevImg = prev.heroWelcomeImage;
      logActivity({
        category: 'images',
        actionType: 'image_update',
        title: 'Actualización de Imagen de Portada',
        description: 'Se subió una nueva imagen para la sección de bienvenida principal.',
        itemAffected: 'heroWelcomeImage',
        oldValue: prevImg,
        newValue: imageUrl,
        imageThumbnail: imageUrl,
      });
      return { ...prev, heroWelcomeImage: imageUrl };
    });
    sounds.playSuccess();
    sendPushNotification(
      'Imagen de Bienvenida Actualizada',
      'La nueva imagen de portada se muestra ahora a todos los clientes.',
      { type: 'system', category: 'sistema' }
    );
  };

  // --- NOTIFICATIONS & MISC ---
  const sendPushNotification = (
    title: string,
    body: string,
    options?: Partial<PushNotification> | PushNotification['type']
  ) => {
    const opts = typeof options === 'string' ? { type: options } : options || {};
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title,
      body,
      timestamp: 'Ahora mismo',
      type: opts.type || 'promo',
      category:
        opts.category ||
        (opts.type === 'appointment' || opts.type === 'reminder'
          ? 'citas'
          : opts.type === 'loyalty'
          ? 'lealtad'
          : 'promos'),
      read: false,
      appointmentId: opts.appointmentId,
      avatarUrl: opts.avatarUrl,
      actionLabel: opts.actionLabel,
      actionTarget: opts.actionTarget,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToastPush(newNotif);
    sounds.playNotification();

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch { /* ignore */ }
    }
  };

  const dismissToastPush = () => setToastPush(null);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => setNotifications([]);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  // --- TARGETING & PUSH CAMPAIGN SCHEDULER ---
  const getTargetedUsers = (
    targetRole: TargetAccountType,
    activityFilter: TargetActivityFilter
  ): UserAccount[] => {
    // 1. Filter by role
    let matched = users.filter((u) => {
      if (targetRole === 'all') return true;
      return u.role === targetRole;
    });

    if (activityFilter === 'all') {
      return matched;
    }

    if (activityFilter === 'active_recent') {
      return matched.filter((u) => {
        if (!u.active) return false;
        if (u.role === 'admin') return true;
        if (u.role === 'barber') return u.active;
        // For client: has appointments or was created recently
        const clientAppts = appointments.filter(
          (a) =>
            a.clientEmail.toLowerCase() === u.email.toLowerCase() ||
            a.clientName.toLowerCase() === u.name.toLowerCase()
        );
        return clientAppts.length > 0;
      });
    }

    if (activityFilter === 'inactive_20d') {
      return matched.filter((u) => {
        if (!u.active) return true; // Account disabled is inactive
        if (u.role === 'barber' || u.role === 'admin') return false;
        const clientAppts = appointments.filter(
          (a) =>
            a.clientEmail.toLowerCase() === u.email.toLowerCase() ||
            a.clientName.toLowerCase() === u.name.toLowerCase()
        );
        if (clientAppts.length === 0) return true;
        // check if they don't have appointments in October 2026
        const hasRecentOrUpcoming = clientAppts.some((a) => a.date >= '2026-10-01');
        return !hasRecentOrUpcoming;
      });
    }

    if (activityFilter === 'has_upcoming') {
      return matched.filter((u) => {
        if (u.role === 'barber') {
          return appointments.some(
            (a) =>
              a.barberId === u.barberId &&
              (a.status === 'pending' || a.status === 'confirmed')
          );
        }
        if (u.role === 'admin') return true;
        return appointments.some(
          (a) =>
            (a.clientEmail.toLowerCase() === u.email.toLowerCase() ||
              a.clientName.toLowerCase() === u.name.toLowerCase()) &&
            (a.status === 'pending' || a.status === 'confirmed')
        );
      });
    }

    if (activityFilter === 'vip_frequent') {
      return matched.filter((u) => {
        if (u.role === 'client') {
          return (
            u.loyaltyTier === 'Oro' ||
            u.loyaltyTier === 'Platino' ||
            (u.loyaltyPoints ?? 0) >= 300
          );
        }
        if (u.role === 'barber') {
          const b = barbers.find((barb) => barb.id === u.barberId);
          return (b?.rating ?? 0) >= 4.9 || (b?.completedCuts ?? 0) >= 120;
        }
        return true;
      });
    }

    if (activityFilter === 'today_duty') {
      return matched.filter((u) => {
        if (u.role === 'barber') {
          return appointments.some(
            (a) =>
              a.barberId === u.barberId &&
              (a.date === '2026-10-08' || a.date === '2026-10-09')
          );
        }
        if (u.role === 'client') {
          return appointments.some(
            (a) =>
              (a.clientEmail.toLowerCase() === u.email.toLowerCase() ||
                a.clientName.toLowerCase() === u.name.toLowerCase()) &&
              (a.date === '2026-10-08' || a.date === '2026-10-09')
          );
        }
        return true;
      });
    }

    return matched;
  };

  const createScheduledPush = (
    data: Omit<
      ScheduledPushNotification,
      'id' | 'createdAt' | 'status' | 'recipientsCount' | 'recipientNames'
    >
  ): ScheduledPushNotification => {
    const matched = getTargetedUsers(data.targetRole, data.activityFilter);
    const newScheduled: ScheduledPushNotification = {
      ...data,
      id: `push-sched-${Date.now()}`,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      recipientsCount: matched.length,
      recipientNames: matched.map((u) => u.name),
    };

    setScheduledPushes((prev) => [newScheduled, ...prev]);
    sounds.playSuccess();
    return newScheduled;
  };

  const executeScheduledPushNow = (id: string) => {
    const target = scheduledPushes.find((p) => p.id === id);
    if (!target) return;

    const matched = getTargetedUsers(target.targetRole, target.activityFilter);
    const sampleRecipient = matched[0] || currentUser;
    const personalizedBody = target.body
      .replace(/{nombre}/g, currentUser.name || sampleRecipient.name)
      .replace(/{email}/g, currentUser.email || sampleRecipient.email)
      .replace(
        /{rol}/g,
        currentUser.role === 'admin'
          ? 'Administrador'
          : currentUser.role === 'barber'
          ? 'Barbero'
          : 'Cliente'
      )
      .replace(/{puntos}/g, String(currentUser.loyaltyPoints ?? 350));

    sendPushNotification(target.title, personalizedBody, {
      type:
        target.category === 'promos'
          ? 'promo'
          : target.category === 'citas'
          ? 'appointment'
          : target.category === 'lealtad'
          ? 'loyalty'
          : 'system',
      category: target.category,
      actionLabel: target.actionLabel,
      actionTarget: target.actionTarget,
      targetRole: target.targetRole,
      recipientsCount: matched.length,
    });

    setScheduledPushes((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'sent',
              sentAt: new Date().toISOString(),
              recipientsCount: matched.length,
              recipientNames: matched.map((u) => u.name),
            }
          : p
      )
    );
    sounds.playSuccess();
  };

  const cancelScheduledPush = (id: string) => {
    setScheduledPushes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'cancelled' } : p))
    );
    sounds.playNotification();
  };

  const deleteScheduledPush = (id: string) => {
    setScheduledPushes((prev) => prev.filter((p) => p.id !== id));
    sounds.playNotification();
  };

  const sendSegmentedPush = (data: {
    title: string;
    body: string;
    targetRole: TargetAccountType;
    activityFilter: TargetActivityFilter;
    category?: 'citas' | 'lealtad' | 'promos' | 'sistema';
    actionLabel?: string;
    actionTarget?: string;
    soundEnabled?: boolean;
  }) => {
    const matched = getTargetedUsers(data.targetRole, data.activityFilter);
    const names = matched.map((u) => u.name);

    const sampleRecipient = matched[0] || currentUser;
    const personalizedBody = data.body
      .replace(/{nombre}/g, currentUser.name || sampleRecipient.name)
      .replace(/{email}/g, currentUser.email || sampleRecipient.email)
      .replace(
        /{rol}/g,
        currentUser.role === 'admin'
          ? 'Administrador'
          : currentUser.role === 'barber'
          ? 'Barbero'
          : 'Cliente'
      )
      .replace(/{puntos}/g, String(currentUser.loyaltyPoints ?? 350));

    sendPushNotification(data.title, personalizedBody, {
      type:
        data.category === 'promos'
          ? 'promo'
          : data.category === 'citas'
          ? 'appointment'
          : data.category === 'lealtad'
          ? 'loyalty'
          : 'system',
      category: data.category || 'promos',
      actionLabel: data.actionLabel,
      actionTarget: data.actionTarget,
      targetRole: data.targetRole,
      recipientsCount: matched.length,
    });

    const newSentPush: ScheduledPushNotification = {
      id: `push-sent-${Date.now()}`,
      title: data.title,
      body: data.body,
      targetRole: data.targetRole,
      activityFilter: data.activityFilter,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      category: data.category || 'promos',
      status: 'sent',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      recipientsCount: matched.length,
      recipientNames: names,
      actionLabel: data.actionLabel,
      actionTarget: data.actionTarget,
      soundEnabled: data.soundEnabled ?? true,
    };

    setScheduledPushes((prev) => [newSentPush, ...prev]);

    return { recipientsCount: matched.length, recipientNames: names };
  };

  const redeemReward = (reward: LoyaltyReward): boolean => {
    if (currentUser.loyaltyPoints && currentUser.loyaltyPoints < reward.pointsCost) {
      return false;
    }
    const currentPts = currentUser.loyaltyPoints ?? 350;
    updateCurrentUserProfile({ loyaltyPoints: currentPts - reward.pointsCost });

    sendPushNotification(
      '¡Recompensa Canjeada!',
      `Has canjeado "${reward.title}". Muéstralo a tu barbero en tu próxima visita.`,
      { type: 'loyalty', category: 'lealtad' }
    );
    sounds.playSuccess();
    return true;
  };

  const triggerSimulatedScenario = (scenarioId: string, delaySeconds = 0) => {
    const scenario = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    const preferredBarber = barbers.find((b) => b.id === user.preferredBarberId) || barbers[0];
    const latestAppointment =
      appointments.find((a) => a.status === 'confirmed' || a.status === 'in_progress') ||
      appointments[0];

    const generated = scenario.generate({
      userName: currentUser.name,
      preferredBarber,
      appointment: latestAppointment,
      points: currentUser.loyaltyPoints,
    });

    if (delaySeconds <= 0) {
      sendPushNotification(generated.title, generated.body, generated);
    } else {
      let secondsLeft = delaySeconds;
      setScheduledCountdown({ title: scenario.name, secondsRemaining: secondsLeft });
      const interval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft <= 0) {
          clearInterval(interval);
          setScheduledCountdown(null);
          sendPushNotification(generated.title, generated.body, generated);
        } else {
          setScheduledCountdown({ title: scenario.name, secondsRemaining: secondsLeft });
        }
      }, 1000);
    }
  };

  const togglePreferredBarber = (barberId: string) => {
    setUser((prev) => ({
      ...prev,
      preferredBarberId: prev.preferredBarberId === barberId ? null : barberId,
    }));
    sounds.playBiometric();
  };

  const openBookingModal = (preselected?: { serviceId?: string; barberId?: string; date?: string; time?: string }) => {
    setPreselectedBooking(preselected || null);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setPreselectedBooking(null);
  };

  const requestBiometricAuth = (onSuccess: () => void) => {
    setBiometricCallback(() => onSuccess);
    setBiometricModalOpen(true);
  };

  const closeBiometricModal = () => {
    setBiometricModalOpen(false);
    setBiometricCallback(null);
  };

  const triggerManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const timeStr = new Date().toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastSyncedText(`Sincronizado a las ${timeStr}`);
      sounds.playSuccess();
    }, 1200);
  };

  return (
    <BarberContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatPrice,
        darkMode,
        setDarkMode,
        user,
        setUser,
        currentUser,
        users,
        setUsers,
        toggleUserActive,
        createManualClient,
        login,
        register,
        logout,
        changePassword,
        recoverPassword,
        updateCurrentUserProfile,
        switchUserRole,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        togglePreferredBarber,
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        services,
        setServices,
        addService,
        updateService,
        deleteService,
        toggleServiceAvailability,
        barbers,
        setBarbers,
        createBarberAccount,
        updateBarber,
        toggleBarberActive,
        deleteBarber,
        changeBarberPassword,
        appointments,
        checkAvailability,
        createAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        updateAppointmentDetails,
        hideClientAppointment,
        deleteAppointment,
        deleteCompletedAppointments,
        portfolio,
        loyaltyRewards,
        notifications,
        automations,
        settings,
        updateSettings,
        publishSettings,
        resetSettingsToDefault,
        updateHeroWelcomeImage,
        analytics,
        activityLogs,
        logActivity,
        clearActivityLogs,
        resetActivityLogsToDefault,
        sendPushNotification,
        markNotificationRead,
        deleteNotification,
        clearNotifications,
        toggleAutomation,
        redeemReward,
        scheduledPushes,
        createScheduledPush,
        executeScheduledPushNow,
        cancelScheduledPush,
        deleteScheduledPush,
        sendSegmentedPush,
        getTargetedUsers,
        toastPush,
        dismissToastPush,
        scheduledCountdown,
        triggerSimulatedScenario,
        bookingModalOpen,
        openBookingModal,
        closeBookingModal,
        preselectedBooking,
        biometricModalOpen,
        requestBiometricAuth,
        closeBiometricModal: () => {
          closeBiometricModal();
          if (biometricCallback) {
            biometricCallback();
            setBiometricCallback(null);
          }
        },
        portfolioModalOpen,
        setPortfolioModalOpen,
        supportModalOpen,
        setSupportModalOpen,
        videoModalOpen,
        setVideoModalOpen,
        triggerManualSync,
        isSyncing,
        lastSyncedText,
      }}
    >
      {children}
    </BarberContext.Provider>
  );
};

export const useBarber = () => {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error('useBarber must be used within a BarberProvider');
  }
  return context;
};
