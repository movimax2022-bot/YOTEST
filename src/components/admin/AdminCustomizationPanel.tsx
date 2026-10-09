import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Type,
  Layout,
  Eye,
  Save,
  RotateCcw,
  Upload,
  CheckCircle2,
  Globe,
  Share2,
  Calendar,
  Clock,
  Scissors,
  Users,
  ShoppingBag,
  Shield,
  Smartphone,
  Laptop,
  Tablet,
  X,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Lock,
  Phone,
  Mail,
  MapPin,
  Check,
  Send,
  Camera,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { SalonSettings, Product, ServiceItem, Barber } from '../../types/barbershop';
import { ImageUploadWidget } from '../common/ImageUploadWidget';

type CustomizationTab =
  | 'general'
  | 'design'
  | 'branding'
  | 'hero'
  | 'products'
  | 'services'
  | 'barbers'
  | 'profile'
  | 'contact'
  | 'advanced';

export const AdminCustomizationPanel: React.FC = () => {
  const {
    settings,
    updateSettings,
    publishSettings,
    resetSettingsToDefault,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    services,
    addService,
    updateService,
    deleteService,
    barbers,
    createBarberAccount,
    updateBarber,
    deleteBarber,
    currentUser,
    updateCurrentUserProfile,
    changePassword,
    sendPushNotification,
    formatPrice,
  } = useBarber();

  const [activeTab, setActiveTab] = useState<CustomizationTab>('general');
  const [localSettings, setLocalSettings] = useState<SalonSettings>({ ...settings });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Keep localSettings in sync with context settings when no unsaved edits
  React.useEffect(() => {
    if (!hasUnsavedChanges) {
      setLocalSettings({ ...settings });
    }
  }, [settings, hasUnsavedChanges]);

  // Live Multi-Device Preview State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'cuidado',
    price: 18,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    description: '',
  });

  // Service modal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({
    name: '',
    price: 20,
    duration: 30,
    description: '',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    category: 'corte',
  });

  // Barber modal
  const [showBarberModal, setShowBarberModal] = useState(false);
  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);
  const [barberForm, setBarberForm] = useState<Partial<Barber>>({
    name: '',
    role: 'Barbero Especialista',
    specialty: 'Cortes Clásicos & Degradados',
    experienceYears: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    email: '',
    phone: '+34 600 000 000',
    instagram: '@barbero_madrid',
  });

  // Admin Profile state
  const [adminName, setAdminName] = useState(currentUser.name);
  const [adminEmail, setAdminEmail] = useState(currentUser.email);
  const [adminPhone, setAdminPhone] = useState(currentUser.phone);
  const [adminAvatar, setAdminAvatar] = useState(currentUser.avatar);
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [adminPassMessage, setAdminPassMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Helper to mutate local draft settings
  const handleSettingsChange = (partial: Partial<SalonSettings>) => {
    setLocalSettings((prev) => ({ ...prev, ...partial }));
    setHasUnsavedChanges(true);
  };

  // Section order helper
  const defaultSections = [
    { id: 'hero', label: 'Portada Principal / Bienvenida' },
    { id: 'quickBooking', label: 'Tarjeta de Reserva Rápida' },
    { id: 'services', label: 'Catálogo de Servicios' },
    { id: 'barbers', label: 'Equipo de Barberos' },
    { id: 'products', label: 'Tienda de Productos' },
    { id: 'portfolio', label: 'Galería y Portafolio' },
    { id: 'loyalty', label: 'Club VIP y Recompensas' },
    { id: 'reviews', label: 'Reseñas de Clientes' },
    { id: 'contact', label: 'Información y Contacto' },
  ];

  const currentSectionOrder = localSettings.sectionOrder || defaultSections.map((s) => s.id);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...currentSectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    handleSettingsChange({ sectionOrder: newOrder });
  };

  const toggleSectionVisibility = (secKey: string) => {
    const currentVis = localSettings.visibleSections || {
      hero: true,
      quickBooking: true,
      services: true,
      barbers: true,
      products: true,
      portfolio: true,
      loyalty: true,
      reviews: true,
      contact: true,
    };
    handleSettingsChange({
      visibleSections: {
        ...currentVis,
        [secKey]: !((currentVis as any)[secKey] ?? true),
      },
    });
  };

  // Standard action controls
  const handleSaveDraft = () => {
    updateSettings(localSettings);
    setHasUnsavedChanges(false);
    setSaveSuccessMsg('¡Cambios guardados con éxito en la configuración!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handlePublishAll = () => {
    updateSettings(localSettings);
    publishSettings();
    setHasUnsavedChanges(false);
    setSaveSuccessMsg('¡Configuración publicada y visible para todos los clientes en la web!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleCancelChanges = () => {
    setLocalSettings({ ...settings });
    setHasUnsavedChanges(false);
    setSaveSuccessMsg('Cambios cancelados. Se restauró el último estado guardado.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleRestoreDefaults = () => {
    if (confirm('¿Restablecer toda la configuración a los valores predeterminados originales?')) {
      resetSettingsToDefault();
      setLocalSettings({ ...settings });
      setHasUnsavedChanges(false);
      setSaveSuccessMsg('Se ha restaurado la configuración de fábrica.');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  // Admin Profile Save
  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      avatar: adminAvatar,
    });
    setSaveSuccessMsg('¡Datos personales del Administrador guardados!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleUpdateAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMessage(null);
    const res = changePassword(currentAdminPass, newAdminPass, confirmAdminPass);
    if (res.success) {
      setAdminPassMessage({ text: res.message, isError: false });
      setCurrentAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
    } else {
      setAdminPassMessage({ text: res.message, isError: true });
    }
  };

  // Products handler
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProductId(prod.id);
      setProductForm({ ...prod });
    } else {
      setEditingProductId(null);
      setProductForm({
        name: '',
        category: 'cuidado',
        price: 18,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        description: '',
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
    } else {
      addProduct({
        name: productForm.name || 'Nuevo Producto',
        category: (productForm.category as Product['category']) || 'cuidado',
        price: Number(productForm.price) || 15,
        stock: Number(productForm.stock) || 10,
        image: productForm.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        description: productForm.description || '',
        available: true,
      });
    }
    setShowProductModal(false);
  };

  // Services handler
  const handleOpenServiceModal = (serv?: ServiceItem) => {
    if (serv) {
      setEditingServiceId(serv.id);
      setServiceForm({ ...serv });
    } else {
      setEditingServiceId(null);
      setServiceForm({
        name: '',
        price: 20,
        duration: 30,
        description: '',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        category: 'corte',
      });
    }
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.price) return;

    if (editingServiceId) {
      updateService(editingServiceId, serviceForm);
    } else {
      addService({
        name: serviceForm.name || 'Nuevo Servicio',
        price: Number(serviceForm.price) || 20,
        duration: Number(serviceForm.duration) || 30,
        description: serviceForm.description || '',
        image: serviceForm.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        category: serviceForm.category || 'corte',
        availableForBooking: true,
      });
    }
    setShowServiceModal(false);
  };

  // Barbers handler
  const handleOpenBarberModal = (barber?: Barber) => {
    if (barber) {
      setEditingBarberId(barber.id);
      setBarberForm({ ...barber });
    } else {
      setEditingBarberId(null);
      setBarberForm({
        name: '',
        role: 'Barbero Especialista',
        specialty: 'Cortes Clásicos & Degradados',
        experienceYears: 5,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        email: '',
        phone: '+34 600 000 000',
        instagram: '@barbero_madrid',
      });
    }
    setShowBarberModal(true);
  };

  const handleSaveBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberForm.name) return;

    if (editingBarberId) {
      updateBarber(editingBarberId, barberForm);
    } else {
      createBarberAccount({
        name: barberForm.name || 'Nuevo Barbero',
        specialty: barberForm.specialty || 'General',
        email: barberForm.email || `${barberForm.name?.toLowerCase().replace(/\s+/g, '')}@barberiamadrid.es`,
        phone: barberForm.phone || '+34 600 000 000',
        avatar: barberForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        initialPassword: 'BarberPass2026!',
        role: barberForm.role || 'Barbero Especialista',
        available: true,
      });
    }
    setShowBarberModal(false);
  };

  // Daily hours helper
  const daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ] as const;

  const currentDailyHours = localSettings.dailyHours || {
    lunes: '09:00 - 21:00',
    martes: '09:00 - 21:00',
    miercoles: '09:00 - 21:00',
    jueves: '09:00 - 21:00',
    viernes: '09:00 - 21:30',
    sabado: '09:30 - 20:30',
    domingo: 'Cerrado',
  };

  const updateDaySchedule = (day: string, value: string) => {
    handleSettingsChange({
      dailyHours: {
        ...currentDailyHours,
        [day]: value,
      },
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* SECTION HEADER WITH REAL-TIME PUBLISH BAR */}
      <div className="bg-[#111722] border border-[#202b3d] p-6 rounded-3xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-black rounded-2xl shadow-lg shadow-amber-500/20">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-white">Personalizar mi página</h2>
              <span className="text-[10px] uppercase font-bold bg-amber-500 text-black px-2 py-0.5 rounded-md">
                Admin Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control total: edita imágenes, textos, colores, tipografía, servicios, productos, horarios y más sin tocar código.
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Vista Previa en Vivo</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-amber-500 hover:bg-amber-400 text-black ring-2 ring-amber-400/50'
                : 'bg-[#18212e] text-slate-300 hover:bg-[#202c3d]'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Borrador</span>
          </button>

          <button
            type="button"
            onClick={handlePublishAll}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Cambios</span>
          </button>
        </div>
      </div>

      {/* SUCCESS / FEEDBACK NOTIFICATION */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg('')}
            className="text-emerald-400 hover:text-emerald-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 10 INDEPENDENT SECTIONS NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'general', label: '1. Configuración General', icon: Globe },
          { id: 'design', label: '2. Diseño & Colores', icon: Palette },
          { id: 'branding', label: '3. Logotipo & Branding', icon: Sparkles },
          { id: 'hero', label: '4. Portada & Bienvenida', icon: Layout },
          { id: 'products', label: '5. Inventario Productos', icon: ShoppingBag },
          { id: 'services', label: '6. Catálogo Servicios', icon: Scissors },
          { id: 'barbers', label: '7. Equipo de Barberos', icon: Users },
          { id: 'profile', label: '8. Perfil & Cuenta Admin', icon: Shield },
          { id: 'contact', label: '9. Contacto & Horarios', icon: Phone },
          { id: 'advanced', label: '10. Avanzado & Sistema', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CustomizationTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-[#121822] text-slate-300 border border-[#202b3d] hover:bg-[#18212e]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: CONFIGURACIÓN GENERAL */}
      {activeTab === 'general' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Configuración General de la Barbería
            </h3>
            <p className="text-xs text-slate-400">
              Personaliza el nombre del establecimiento, eslogan, avisos promocionales y datos SEO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Comercial de la Barbería</label>
              <input
                type="text"
                value={localSettings.shopName}
                onChange={(e) => handleSettingsChange({ shopName: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                placeholder="Barbería Madrid"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Eslogan Principal</label>
              <input
                type="text"
                value={localSettings.tagline}
                onChange={(e) => handleSettingsChange({ tagline: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                placeholder="Tu estilo, nuestra pasión"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Barra de Anuncios Promocional (Cabecera Superior)
              </label>
              <input
                type="text"
                value={localSettings.announcementBarText || ''}
                onChange={(e) => handleSettingsChange({ announcementBarText: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                placeholder="💈 ¡Novedad! Reserva tu combo Corte + Barba y recibe un café espresso de cortesía."
              />
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="announcementBarEnabled"
                  checked={localSettings.announcementBarEnabled !== false}
                  onChange={(e) => handleSettingsChange({ announcementBarEnabled: e.target.checked })}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="announcementBarEnabled" className="text-xs text-slate-300 cursor-pointer">
                  Mostrar barra de anuncios promocional en la parte superior del sitio
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Pestaña / SEO (Meta Title)</label>
              <input
                type="text"
                value={localSettings.seoTitle || 'Barbería Madrid - Cortes Clásicos & Cuidado Masculino'}
                onChange={(e) => handleSettingsChange({ seoTitle: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción SEO (Meta Description)</label>
              <input
                type="text"
                value={localSettings.seoDescription || 'Reserva tu cita en Barbería Madrid. Expertos barberos en cortes tradicionales y modernos.'}
                onChange={(e) => handleSettingsChange({ seoDescription: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PERSONALIZACIÓN DEL DISEÑO */}
      {activeTab === 'design' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              Diseño, Colores, Fuentes y Distribución de Secciones
            </h3>
            <p className="text-xs text-slate-400">
              Modifica los colores corporativos, tipografía, fondos y el orden en que se muestran las secciones de la página.
            </p>
          </div>

          {/* Color Palettes */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-white">Color de Acento Principal:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { id: 'amber', label: 'Ámbar Clásico', color: '#f59e0b', ring: 'ring-amber-500' },
                { id: 'gold', label: 'Dorado Real', color: '#eab308', ring: 'ring-yellow-400' },
                { id: 'emerald', label: 'Esmeralda', color: '#10b981', ring: 'ring-emerald-500' },
                { id: 'blue', label: 'Azul Zafiro', color: '#3b82f6', ring: 'ring-blue-500' },
                { id: 'rose', label: 'Borgoña / Rubí', color: '#f43f5e', ring: 'ring-rose-500' },
                { id: 'bronze', label: 'Bronce Antiguo', color: '#d97706', ring: 'ring-orange-600' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSettingsChange({ themePrimaryColor: c.id as any })}
                  className={`p-3 rounded-2xl bg-[#16202e] border flex flex-col items-center gap-2 transition ${
                    (localSettings.themePrimaryColor || 'amber') === c.id
                      ? `border-amber-400 ring-2 ${c.ring} bg-amber-500/10`
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="w-7 h-7 rounded-full shadow-md" style={{ backgroundColor: c.color }} />
                  <span className="text-xs font-bold text-white">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background and Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Fondo General de la Web</label>
              <select
                value={localSettings.themeBackgroundColor || 'charcoal'}
                onChange={(e) => handleSettingsChange({ themeBackgroundColor: e.target.value as any })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="black">Negro Puro (#000000)</option>
                <option value="charcoal">Carbón Profundo (#0d1117)</option>
                <option value="navy">Azul Medianoche (#0a0f1d)</option>
                <option value="slate">Gris Grafito (#18181b)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estilo Tipográfico</label>
              <select
                value={localSettings.themeFontFamily || 'sans'}
                onChange={(e) => handleSettingsChange({ themeFontFamily: e.target.value as any })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="sans">Sans-serif Urbana (Inter / Moderna)</option>
                <option value="serif">Serif Clásica (Elegante & Tradicional)</option>
                <option value="mono">Monospace (Técnica & Vanguardista)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Redondeo de Tarjetas & Botones</label>
              <select
                value={localSettings.themeBorderRadius || 'lg'}
                onChange={(e) => handleSettingsChange({ themeBorderRadius: e.target.value as any })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="sm">Suave (Bordes sutiles)</option>
                <option value="md">Medio (8px)</option>
                <option value="lg">Marcado (16px - Recomendado)</option>
                <option value="full">Redondeo Total (Pill shape)</option>
              </select>
            </div>
          </div>

          {/* Section Distribution & Order */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-white">Orden y Visibilidad de Secciones de la Página</label>
                <p className="text-[11px] text-slate-400">
                  Usa las flechas para reordenar bloques o activa/desactiva su visibilidad pública.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {currentSectionOrder.map((secId, idx) => {
                const secDef = defaultSections.find((s) => s.id === secId) || { id: secId, label: secId };
                const isVisible = (localSettings.visibleSections as any)?.[secId] ?? true;

                return (
                  <div
                    key={secId}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#141c28] border border-[#222e40] text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white">{secDef.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                        className={`p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition ${
                          idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-700'
                        }`}
                        title="Subir posición"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={idx === currentSectionOrder.length - 1}
                        onClick={() => moveSection(idx, 'down')}
                        className={`p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition ${
                          idx === currentSectionOrder.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-700'
                        }`}
                        title="Bajar posición"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility(secId)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isVisible
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/40'
                            : 'bg-red-950/60 text-red-400 border border-red-600/40'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{isVisible ? 'Visible' : 'Oculto'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: IMÁGENES Y LOGOTIPO */}
      {activeTab === 'branding' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Logotipo Oficial y Emblema de la Barbería
            </h3>
            <p className="text-xs text-slate-400">
              Sube tu propio logotipo, ajusta su recorte, o activa el emblema tradicional de tijeras doradas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ImageUploadWidget
                label="Logotipo Personalizado de la Barbería"
                helperText="Sube un archivo PNG con fondo transparente o imagen cuadrada para el logotipo."
                currentImage={localSettings.customLogoUrl || ''}
                onImageChange={(newImg) => handleSettingsChange({ customLogoUrl: newImg })}
                onImageRemove={() => handleSettingsChange({ customLogoUrl: '' })}
                aspectRatioPreset="1:1"
                shape="rounded"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-white">Modo de Visualización del Logotipo:</label>
              <div className="space-y-2">
                {[
                  {
                    id: 'emblem_and_text',
                    title: 'Emblema Dorado + Nombre del Salón',
                    desc: 'Muestra las tijeras doradas y el nombre Barbería Madrid.',
                  },
                  {
                    id: 'image_only',
                    title: 'Solo Mi Imagen de Logotipo Personalizada',
                    desc: 'Sustituye todo el encabezado con tu imagen de logo subida.',
                  },
                  {
                    id: 'emblem_only',
                    title: 'Solo Emblema de Tijeras Vintage',
                    desc: 'Diseño minimalista compacto.',
                  },
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => handleSettingsChange({ logoDisplayMode: mode.id as any })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                      (localSettings.logoDisplayMode || 'emblem_and_text') === mode.id
                        ? 'bg-amber-500/10 border-amber-400'
                        : 'bg-[#141b26] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{mode.title}</span>
                      <input
                        type="radio"
                        checked={(localSettings.logoDisplayMode || 'emblem_and_text') === mode.id}
                        onChange={() => handleSettingsChange({ logoDisplayMode: mode.id as any })}
                        className="accent-amber-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{mode.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PORTADA Y BIENVENIDA */}
      {activeTab === 'hero' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-amber-400" />
              Portada Principal y Mensaje de Bienvenida
            </h3>
            <p className="text-xs text-slate-400">
              Sube la imagen principal de bienvenida, edita los titulares, descripciones y botones de llamada a la acción.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uploader for Hero Banner */}
            <div>
              <ImageUploadWidget
                label="Imagen de Portada Principal / Bienvenida"
                helperText="Se muestra en alta definición con filtros oscuros cinemáticos en la portada del salón."
                currentImage={localSettings.heroWelcomeImage}
                onImageChange={(newImg) => handleSettingsChange({ heroWelcomeImage: newImg })}
                aspectRatioPreset="21:9"
                shape="banner"
                presetOptions={[
                  {
                    name: 'Salón Madrid Clásico',
                    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=85',
                  },
                  {
                    name: 'Sillones Chesterfield & Neón',
                    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2000&q=85',
                  },
                  {
                    name: 'Barbero en Acción Navaja',
                    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=2000&q=85',
                  },
                ]}
              />
            </div>

            {/* Texts and CTA Configuration */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título de Portada</label>
                <input
                  type="text"
                  value={localSettings.heroTitle || 'BARBERÍA MADRID'}
                  onChange={(e) => handleSettingsChange({ heroTitle: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Texto de la Insignia / Badge Superior</label>
                <input
                  type="text"
                  value={localSettings.heroBadgeText || 'Bienvenido al Templo del Estilo'}
                  onChange={(e) => handleSettingsChange({ heroBadgeText: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción de Bienvenida</label>
                <textarea
                  rows={3}
                  value={
                    localSettings.heroSubtitle ||
                    'La experiencia definitiva de cuidado masculino en el corazón de la capital. Maestría en cortes clásicos, degradados y afeitados a navaja.'
                  }
                  onChange={(e) => handleSettingsChange({ heroSubtitle: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Botón Principal (Texto)</label>
                  <input
                    type="text"
                    value={localSettings.heroCtaText || 'Reservar Cita Ahora'}
                    onChange={(e) => handleSettingsChange({ heroCtaText: e.target.value })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Botón Secundario (Texto)</label>
                  <input
                    type="text"
                    value={localSettings.heroSecondaryCtaText || 'Ver Servicios & Precios'}
                    onChange={(e) => handleSettingsChange({ heroSecondaryCtaText: e.target.value })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: INVENTARIO DE PRODUCTOS */}
      {activeTab === 'products' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                Inventario de Productos de la Tienda
              </h3>
              <p className="text-xs text-slate-400">
                Sube fotos de máquinas, ceras, champús, aceites para barba y administra precios y existencias.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Producto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#141b26] border border-[#202b3d] rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black/60 mb-3 border border-slate-800 group">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleOpenProductModal(prod)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Cambiar Foto</span>
                    </button>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                      <span className="text-[10px] text-amber-400 font-semibold">{prod.category}</span>
                    </div>
                    <span className="font-black text-white text-base">{formatPrice(prod.price)}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Stock: <strong className="text-white">{prod.stock} uds</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenProductModal(prod)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-amber-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar producto ${prod.name}?`)) deleteProduct(prod.id);
                      }}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: CATÁLOGO DE SERVICIOS */}
      {activeTab === 'services' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                Catálogo de Servicios de Barbería
              </h3>
              <p className="text-xs text-slate-400">
                Sube imágenes para cada servicio, actualiza precios, duración y descripciones.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenServiceModal()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Servicio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="bg-[#141b26] border border-[#202b3d] rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/60 mb-3 border border-slate-800 group">
                    <img src={serv.image} alt={serv.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleOpenServiceModal(serv)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Cambiar Foto</span>
                    </button>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{serv.name}</h4>
                      <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {serv.duration} min
                      </span>
                    </div>
                    <span className="font-black text-amber-400 text-base">{formatPrice(serv.price)}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{serv.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      serv.availableForBooking !== false
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/30'
                        : 'bg-red-950/60 text-red-400'
                    }`}
                  >
                    {serv.availableForBooking !== false ? 'Activo' : 'Pausado'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenServiceModal(serv)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-amber-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar servicio ${serv.name}?`)) deleteService(serv.id);
                      }}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: EQUIPO DE BARBEROS */}
      {activeTab === 'barbers' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Equipo de Barberos
              </h3>
              <p className="text-xs text-slate-400">
                Sube o cambia la foto de perfil de cada barbero, actualiza sus especialidades y añade nuevos miembros.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBarberModal()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Barbero</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbers.map((b) => (
              <div
                key={b.id}
                className="bg-[#141b26] border border-[#202b3d] rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative group shrink-0">
                    <img
                      src={b.avatar}
                      alt={b.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/40"
                    />
                    <button
                      type="button"
                      onClick={() => handleOpenBarberModal(b)}
                      title="Cambiar Foto"
                      className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{b.name}</h4>
                    <p className="text-xs text-amber-400 font-semibold">{b.specialty}</p>
                    <p className="text-[11px] text-slate-400">{b.experienceYears || 5} años de experiencia</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">★ {b.rating || 4.9}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenBarberModal(b)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-amber-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar barbero ${b.name}?`)) deleteBarber(b.id);
                      }}
                      className="p-1 rounded-lg text-red-400 hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: PERFIL Y CUENTA ADMIN */}
      {activeTab === 'profile' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Perfil y Seguridad del Administrador
            </h3>
            <p className="text-xs text-slate-400">
              Sube y cambia tu foto de perfil como dueño o administrador, actualiza tu correo y modifica tu clave.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Avatar Uploader & Personal Details */}
            <form onSubmit={handleSaveAdminProfile} className="space-y-4">
              <ImageUploadWidget
                label="Foto de Perfil del Administrador"
                helperText="Sube una fotografía personal para tu cuenta."
                currentImage={adminAvatar}
                onImageChange={(newImg) => setAdminAvatar(newImg)}
                aspectRatioPreset="1:1"
                shape="circle"
              />

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Datos de Mi Cuenta</span>
                </button>
              </div>
            </form>

            {/* Right: Change Password */}
            <form onSubmit={handleUpdateAdminPassword} className="space-y-4 bg-[#141b26] p-5 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Cambiar Contraseña de Acceso Admin
              </h4>

              {adminPassMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    adminPassMessage.isError
                      ? 'bg-red-950/60 border border-red-800 text-red-300'
                      : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                  }`}
                >
                  {adminPassMessage.isError ? (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span>{adminPassMessage.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentAdminPass}
                  onChange={(e) => setCurrentAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nueva Contraseña (mínimo 6 caracteres)</label>
                <input
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={confirmAdminPass}
                  onChange={(e) => setConfirmAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 9: CONTACTO Y REDES SOCIALES */}
      {activeTab === 'contact' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              Contacto, Ubicación, Redes Sociales y Horarios
            </h3>
            <p className="text-xs text-slate-400">
              Configura los números de teléfono, WhatsApp de reservas, ubicación en mapa y horarios semanales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Principal</label>
              <input
                type="tel"
                value={localSettings.phone}
                onChange={(e) => handleSettingsChange({ phone: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Directo para Clientes</label>
              <input
                type="tel"
                value={localSettings.whatsappPhone || '+34 644 123 456'}
                onChange={(e) => handleSettingsChange({ whatsappPhone: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico de Contacto</label>
              <input
                type="email"
                value={localSettings.email}
                onChange={(e) => handleSettingsChange({ email: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección del Salón</label>
              <input
                type="text"
                value={localSettings.address}
                onChange={(e) => handleSettingsChange({ address: e.target.value })}
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram URL</label>
              <input
                type="url"
                value={localSettings.instagramUrl || ''}
                onChange={(e) => handleSettingsChange({ instagramUrl: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">TikTok URL</label>
              <input
                type="url"
                value={localSettings.tiktokUrl || ''}
                onChange={(e) => handleSettingsChange({ tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enlace a Google Maps / GPS</label>
              <input
                type="url"
                value={localSettings.googleMapsUrl || ''}
                onChange={(e) => handleSettingsChange({ googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Detailed Daily Hours Table */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Horarios Detallados de Apertura y Cierre
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="p-3 rounded-xl bg-[#141b26] border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs block">{day.label}</span>
                  <input
                    type="text"
                    value={(currentDailyHours as any)[day.key] || '09:00 - 21:00'}
                    onChange={(e) => updateDaySchedule(day.key, e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => updateDaySchedule(day.key, '09:00 - 21:00')}
                      className="text-[10px] text-slate-400 hover:text-amber-400 underline"
                    >
                      Estándar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDaySchedule(day.key, 'Cerrado')}
                      className="text-[10px] text-red-400 hover:text-red-300 underline"
                    >
                      Cerrado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 10: CONFIGURACIÓN AVANZADA */}
      {activeTab === 'advanced' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Configuración Avanzada y Sistema
            </h3>
            <p className="text-xs text-slate-400">
              Ajustes de confirmación automática de citas, modo mantenimiento y restablecimiento de fábrica.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141b26] border border-slate-800">
              <div>
                <span className="font-bold text-white text-xs block">Confirmación Automática de Citas</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Las citas reservadas por clientes pasarán directamente a estado 'Confirmada' sin revisión manual.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.autoConfirmBookings}
                onChange={(e) => handleSettingsChange({ autoConfirmBookings: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141b26] border border-slate-800">
              <div>
                <span className="font-bold text-white text-xs block">Modo de Mantenimiento</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Muestra un banner temporal a los clientes indicando mejoras en el salón.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.maintenanceMode || false}
                onChange={(e) => handleSettingsChange({ maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141b26] border border-slate-800">
              <div>
                <span className="font-bold text-white text-xs block">Autenticación Biométrica Requerida para Admin</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Exige confirmación por huella / Face ID / PIN al cambiar contraseñas o eliminar datos.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.biometricRequiredForAdmin}
                onChange={(e) => handleSettingsChange({ biometricRequiredForAdmin: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Storage Info */}
            <div className="p-4 rounded-2xl bg-[#141b26] border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs block">Almacenamiento Local Persistente</span>
              <p className="text-[11px] text-slate-400">
                Las fotos, servicios y personalizaciones se almacenan de forma segura en la base local del navegador
                y persisten tras cerrar sesión o refrescar la página.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 text-xs font-mono font-bold border border-emerald-600/30">
                  Estado: Sincronizado & Local
                </span>
              </div>
            </div>

            {/* Reset Factory Defaults */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Configuración Predeterminada de Fábrica</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM FLOATING/STICKY SAVE & CONTROL BAR */}
      <div className="p-4 rounded-2xl bg-[#111722]/95 border border-[#202b3d] flex flex-wrap items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Hay cambios pendientes de guardar o publicar
            </span>
          ) : (
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Toda la configuración está guardada
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCancelChanges}
            disabled={!hasUnsavedChanges}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              hasUnsavedChanges
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            Cancelar Cambios
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Cambios</span>
          </button>

          <button
            type="button"
            onClick={handlePublishAll}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Cambios</span>
          </button>
        </div>
      </div>

      {/* MODAL: VISTA PREVIA EN TIEMPO REAL MULTI-DISPOSITIVO (Requisito 4) */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b0e14] border border-[#202b3d] rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Top Toolbar */}
            <div className="p-4 bg-[#111722] border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Vista Previa en Tiempo Real</h3>
                  <p className="text-[11px] text-slate-400">
                    Previsualiza cómo luce la página web de tu barbería antes de publicar.
                  </p>
                </div>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-[#16202e] p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    previewDevice === 'desktop' ? 'bg-amber-500 text-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ordenador</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    previewDevice === 'tablet' ? 'bg-amber-500 text-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    previewDevice === 'mobile' ? 'bg-amber-500 text-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Móvil</span>
                </button>
              </div>

              {/* Close preview */}
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Frame */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-[#07090e]">
              <div
                className={`transition-all duration-300 overflow-y-auto bg-[#0d121a] rounded-2xl border border-slate-800 shadow-2xl h-full ${
                  previewDevice === 'desktop'
                    ? 'w-full'
                    : previewDevice === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[390px] border-4 border-slate-700'
                }`}
              >
                {/* Simulated Announcement Bar */}
                {localSettings.announcementBarEnabled !== false && localSettings.announcementBarText && (
                  <div className="bg-amber-500 text-black text-[11px] font-black py-1.5 px-4 text-center">
                    {localSettings.announcementBarText}
                  </div>
                )}

                {/* Simulated Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0b0e14]">
                  <div className="flex items-center gap-2">
                    {localSettings.customLogoUrl ? (
                      <img
                        src={localSettings.customLogoUrl}
                        alt="Logo"
                        className="w-8 h-8 rounded-lg object-contain"
                      />
                    ) : (
                      <span className="text-amber-400 font-serif text-lg">✂️</span>
                    )}
                    <div>
                      <span className="font-extrabold text-white text-sm block">
                        {localSettings.shopName || 'Barbería Madrid'}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold uppercase">
                        {localSettings.tagline || 'Tu estilo, nuestra pasión'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">{localSettings.phone}</span>
                </div>

                {/* Simulated Hero Section */}
                <div className="relative p-6 sm:p-10 overflow-hidden bg-black/60 min-h-[300px] flex flex-col justify-center text-left">
                  <img
                    src={localSettings.heroWelcomeImage}
                    alt="Portada"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45]"
                  />
                  <div className="relative z-10 max-w-lg space-y-3">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/30">
                      {localSettings.heroBadgeText || 'Bienvenido al Templo del Estilo'}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase">
                      {localSettings.heroTitle || 'BARBERÍA MADRID'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {localSettings.heroSubtitle ||
                        'La experiencia definitiva de cuidado masculino en el corazón de la capital.'}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-lg">
                        {localSettings.heroCtaText || 'Reservar Cita Ahora'}
                      </button>
                      <button className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700">
                        {localSettings.heroSecondaryCtaText || 'Ver Servicios'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Services row */}
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-white text-base">Servicios Destacados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.slice(0, 4).map((s) => (
                      <div key={s.id} className="p-3 rounded-xl bg-[#141b26] border border-slate-800 flex gap-3">
                        <img src={s.image} alt={s.name} className="w-14 h-14 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-white text-xs">{s.name}</p>
                          <p className="text-amber-400 font-extrabold text-xs">{formatPrice(s.price)}</p>
                          <p className="text-[10px] text-slate-400">{s.duration} min</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#111722] border border-[#233147] rounded-3xl p-6 text-left max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {editingProductId ? 'Editar Producto' : 'Añadir Nuevo Producto'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <ImageUploadWidget
                label="Fotografía del Producto"
                helperText="Sube fotos de máquinas de cortar pelo, tijeras, champús o ceras."
                currentImage={productForm.image}
                onImageChange={(img) => setProductForm((prev) => ({ ...prev, image: img }))}
                aspectRatioPreset="4:3"
                compact={false}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={productForm.category || 'cuidado'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="cuidado">Tratamiento & Cuidado</option>
                    <option value="cera">Cera Modeladora</option>
                    <option value="pomada">Pomada de Peinado</option>
                    <option value="champu">Champú Capilar</option>
                    <option value="barba">Aceite / Bálsamo de Barba</option>
                    <option value="accesorio">Máquinas, Tijeras & Accesorios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock (Unidades)</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#111722] border border-[#233147] rounded-3xl p-6 text-left max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                {editingServiceId ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}
              </h3>
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <ImageUploadWidget
                label="Fotografía del Servicio"
                helperText="Sube fotos de cortes, afeitados, rituales spa, etc."
                currentImage={serviceForm.image}
                onImageChange={(img) => setServiceForm((prev) => ({ ...prev, image: img }))}
                aspectRatioPreset="16:9"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Servicio</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duración (Minutos)</label>
                  <input
                    type="number"
                    step="5"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: parseInt(e.target.value) })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={serviceForm.category || 'corte'}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="corte">Corte Tradicional / Degradado</option>
                    <option value="barba">Arreglo de Barba</option>
                    <option value="combo">Combo Corte + Barba</option>
                    <option value="spa">Tratamiento Spa & Facial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BARBER */}
      {showBarberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#111722] border border-[#233147] rounded-3xl p-6 text-left max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                {editingBarberId ? 'Editar Perfil de Barbero' : 'Añadir Nuevo Barbero'}
              </h3>
              <button
                type="button"
                onClick={() => setShowBarberModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBarber} className="space-y-4">
              <ImageUploadWidget
                label="Foto de Perfil del Barbero"
                helperText="Sube una foto de perfil profesional para el barbero."
                currentImage={barberForm.avatar}
                onImageChange={(img) => setBarberForm((prev) => ({ ...prev, avatar: img }))}
                aspectRatioPreset="1:1"
                shape="circle"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={barberForm.name}
                    onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidad</label>
                  <input
                    type="text"
                    value={barberForm.specialty}
                    onChange={(e) => setBarberForm({ ...barberForm, specialty: e.target.value })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={barberForm.email}
                    onChange={(e) => setBarberForm({ ...barberForm, email: e.target.value })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={barberForm.phone}
                    onChange={(e) => setBarberForm({ ...barberForm, phone: e.target.value })}
                    className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram (@usuario)</label>
                <input
                  type="text"
                  value={barberForm.instagram || ''}
                  onChange={(e) => setBarberForm({ ...barberForm, instagram: e.target.value })}
                  placeholder="@carlos_barber"
                  className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBarberModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg"
                >
                  Guardar Barbero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
