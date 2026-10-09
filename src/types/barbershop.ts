export type Language = 'es' | 'en' | 'fr' | 'pt';
export type Currency = 'EUR' | 'USD';

export type UserRole = 'client' | 'barber' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  passwordHash: string; // simulated password verification
  active: boolean;
  barberId?: string; // for barber role, link to Barber entity
  loyaltyPoints?: number;
  stampsCount?: number;
  loyaltyTier?: 'Bronce' | 'Plata' | 'Oro' | 'Platino';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'cera' | 'pomada' | 'champu' | 'barba' | 'cuidado' | 'accesorio';
  stock: number;
  available: boolean;
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'corte' | 'barba' | 'combo' | 'especial';
  duration: number; // in minutes
  price: number;
  image: string;
  description: string;
  popular?: boolean;
  availableForBooking?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  specialty: string;
  experienceYears: number;
  available: boolean;
  active?: boolean;
  email?: string;
  phone?: string;
  instagram: string;
  completedCuts: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'bizum' | 'cash';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number;
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  qrCodeToken: string;
  createdAt: string;
  hiddenFromClient?: boolean;
}

export interface PortfolioCut {
  id: string;
  title: string;
  category: 'Fade' | 'Barba' | 'Clásico' | 'Hair Tattoo' | 'Moderno';
  barberName: string;
  barberId: string;
  imageUrl: string;
  likes: number;
  description: string;
  tags: string[];
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsCost: number;
  category: 'descuento' | 'gratis' | 'producto' | 'vip';
  description: string;
  icon: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'appointment' | 'promo' | 'loyalty' | 'reminder' | 'system';
  category?: 'citas' | 'lealtad' | 'promos' | 'sistema';
  read: boolean;
  appointmentId?: string;
  avatarUrl?: string;
  actionLabel?: string;
  actionTarget?: string;
  scheduledFor?: string;
  targetAudience?: 'all' | 'inactive_15d' | 'vip' | 'custom';
  targetRole?: 'all' | 'client' | 'barber' | 'admin';
  recipientsCount?: number;
}

export type TargetAccountType = 'all' | 'client' | 'barber' | 'admin';

export type TargetActivityFilter =
  | 'all'
  | 'active_recent'
  | 'inactive_20d'
  | 'has_upcoming'
  | 'vip_frequent'
  | 'today_duty';

export type PushScheduleStatus = 'scheduled' | 'sent' | 'cancelled';

export interface ScheduledPushNotification {
  id: string;
  title: string;
  body: string;
  targetRole: TargetAccountType;
  activityFilter: TargetActivityFilter;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  repeatInterval?: 'none' | 'daily' | 'weekly';
  category: 'citas' | 'lealtad' | 'promos' | 'sistema';
  status: PushScheduleStatus;
  createdAt: string;
  sentAt?: string;
  recipientsCount: number;
  recipientNames?: string[];
  actionLabel?: string;
  actionTarget?: string;
  soundEnabled?: boolean;
}

export interface PushAutomationTrigger {
  id: string;
  name: string;
  description: string;
  condition: 'inactive_21_days' | 'appointment_reminder_24h' | 'birthday' | 'loyalty_tier_up';
  enabled: boolean;
  templateTitle: string;
  templateBody: string;
}

export interface SalonSettings {
  shopName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  openHours: string;
  taxRatePercentage: number;
  autoConfirmBookings: boolean;
  biometricRequiredForAdmin: boolean;
  pushNotificationsEnabled: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncedAt: string;
  heroWelcomeImage: string;
  // Customization & Branding fields
  customLogoUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadgeText?: string;
  heroCtaText?: string;
  heroSecondaryCtaText?: string;
  themePrimaryColor?: 'amber' | 'gold' | 'emerald' | 'blue' | 'rose' | 'bronze';
  themeFontFamily?: 'sans' | 'serif' | 'mono';
  themeBorderRadius?: 'sm' | 'md' | 'lg' | 'full';
  whatsappPhone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  googleMapsUrl?: string;
  contactNotice?: string;
  footerCopyright?: string;
  footerDescription?: string;
  visibleSections?: {
    hero: boolean;
    quickBooking: boolean;
    services: boolean;
    barbers: boolean;
    products: boolean;
    portfolio: boolean;
    loyalty: boolean;
    reviews: boolean;
    contact: boolean;
  };
  sectionOrder?: string[];
  announcementBarText?: string;
  announcementBarEnabled?: boolean;
  themeBackgroundColor?: 'black' | 'charcoal' | 'navy' | 'slate';
  themeFontSize?: 'sm' | 'normal' | 'lg';
  logoDisplayMode?: 'emblem_and_text' | 'image_only' | 'emblem_only';
  heroCtaLink?: string;
  heroSecondaryCtaLink?: string;
  heroSecondaryCtaEnabled?: boolean;
  maintenanceMode?: boolean;
  customCss?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished?: boolean;
  lastPublishedAt?: string;
  dailyHours?: {
    lunes: string;
    martes: string;
    miercoles: string;
    jueves: string;
    viernes: string;
    sabado: string;
    domingo: string;
  };
}

export interface SalesAnalytics {
  dailyRevenue: number;
  monthlyRevenue: number;
  totalAppointments: number;
  averageTicket: number;
  occupancyRate: number;
  weeklyTrend: { day: string; revenue: number; appointments: number }[];
  paymentBreakdown: { method: string; percentage: number; amount: number }[];
  topServices: { name: string; count: number; revenue: number }[];
  topBarbers: { name: string; cutsCount: number; rating: number }[];
}

export type ActivityLogCategory =
  | 'settings'
  | 'images'
  | 'branding'
  | 'catalog'
  | 'team'
  | 'security'
  | 'push';

export type ActivityLogActionType =
  | 'setting_change'
  | 'image_update'
  | 'theme_change'
  | 'product_update'
  | 'service_update'
  | 'barber_update'
  | 'customization_publish'
  | 'customization_reset'
  | 'password_change'
  | 'push_campaign';

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  userId: string;
  userName: string;
  userRole: UserRole | string;
  userEmail?: string;
  userAvatar?: string;
  category: ActivityLogCategory;
  actionType: ActivityLogActionType;
  title: string;
  description: string;
  itemAffected?: string;
  oldValue?: string;
  newValue?: string;
  imageThumbnail?: string;
  ipAddress?: string;
}
