import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Bell,
  Settings,
  Scissors,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Plus,
  Send,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  PieChart,
  ShoppingBag,
  Image as ImageIcon,
  Lock,
  Trash2,
  Edit2,
  AlertCircle,
  Check,
  Search,
  Filter,
  Palette,
  History,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { AppointmentStatus, PushAutomationTrigger, ServiceItem, Product, Barber } from '../../types/barbershop';
import { AdminPushCampaignsPanel } from './AdminPushCampaignsPanel';
import { AdminCustomizationPanel } from './AdminCustomizationPanel';
import { AdminActivityLogs } from './AdminActivityLogs';
import { ImageUploadWidget } from '../common/ImageUploadWidget';

export const AdminDashboard: React.FC = () => {
  const {
    analytics,
    appointments,
    updateAppointmentStatus,
    updateAppointmentDetails,
    deleteAppointment,
    deleteCompletedAppointments,
    barbers,
    createBarberAccount,
    updateBarber,
    toggleBarberActive,
    deleteBarber,
    changeBarberPassword,
    services,
    addService,
    updateService,
    deleteService,
    toggleServiceAvailability,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    users,
    toggleUserActive,
    createManualClient,
    currentUser,
    changePassword,
    settings,
    updateSettings,
    updateHeroWelcomeImage,
    formatPrice,
    sendPushNotification,
    createAppointment,
    triggerManualSync,
    isSyncing,
    lastSyncedText,
    setActiveTab,
  } = useBarber();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    | 'customize'
    | 'analytics'
    | 'appointments'
    | 'barbers'
    | 'services'
    | 'products'
    | 'clients'
    | 'welcome_image'
    | 'notifications'
    | 'activity_logs'
    | 'settings'
  >('customize');

  // --- Appointments Management State ---
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [barberFilter, setBarberFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [clientSearch, setClientSearch] = useState<string>('');

  // Delete Completed Confirmation Modal
  const [showDeleteCompletedModal, setShowDeleteCompletedModal] = useState(false);

  // Manual Walk-in / Phone appointment state
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinClient, setWalkinClient] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinServiceId, setWalkinServiceId] = useState(services[0]?.id || '');
  const [walkinBarberId, setWalkinBarberId] = useState(barbers[0]?.id || '');
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);
  const [walkinTime, setWalkinTime] = useState('11:00');

  // Edit Appointment Modal State
  const [editingAppointment, setEditingAppointment] = useState<typeof appointments[0] | null>(null);

  // --- Barber Management State ---
  const [showAddBarberModal, setShowAddBarberModal] = useState(false);
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberEmail, setNewBarberEmail] = useState('');
  const [newBarberPhone, setNewBarberPhone] = useState('');
  const [newBarberPassword, setNewBarberPassword] = useState('barber123');
  const [newBarberSpecialty, setNewBarberSpecialty] = useState('Fade, corte a tijera y afeitado tradicional');
  const [newBarberAvatar, setNewBarberAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  // Change Barber Password Modal State
  const [passwordChangeBarber, setPasswordChangeBarber] = useState<Barber | null>(null);
  const [barberNewPass, setBarberNewPass] = useState('');

  // --- Services Management State ---
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(20);
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServiceCategory, setNewServiceCategory] = useState<'corte' | 'barba' | 'combo' | 'especial'>('corte');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceImage, setNewServiceImage] = useState('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80');

  // --- Products Management State ---
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(15);
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdCategory, setNewProdCategory] = useState<'pomada' | 'barba' | 'champu' | 'cera' | 'cuidado' | 'accesorio'>('pomada');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1597354984706-aec992c7d0d1?auto=format&fit=crop&w=600&q=80');

  // --- Client Management State ---
  const [clientSearchFilter, setClientSearchFilter] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientPassword, setNewClientPassword] = useState('cliente123');
  const [newClientPoints, setNewClientPoints] = useState(100);
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<typeof users[0] | null>(null);

  // --- Welcome Image State ---
  const [welcomeImageUrl, setWelcomeImageUrl] = useState(settings.heroWelcomeImage || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=85');
  const [welcomePreviewSaved, setWelcomePreviewSaved] = useState(false);

  useEffect(() => {
    if (settings.heroWelcomeImage) {
      setWelcomeImageUrl(settings.heroWelcomeImage);
    }
  }, [settings.heroWelcomeImage]);

  // --- Admin Password Change State ---
  const [adminCurrentPass, setAdminCurrentPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState({ text: '', isError: false });

  // Filter Appointments Table
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesDate = !dateFilter || a.date === dateFilter;
    const matchesBarber = barberFilter === 'all' || a.barberId === barberFilter;
    const matchesService = serviceFilter === 'all' || a.serviceId === serviceFilter;
    const matchesClient =
      !clientSearch ||
      a.clientName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      a.clientPhone.includes(clientSearch);
    return matchesStatus && matchesDate && matchesBarber && matchesService && matchesClient;
  });

  const registeredClients = users.filter((u) => u.role === 'client');

  // Handlers
  const handleExportCSV = () => {
    const headers = 'ID,Cliente,Telefono,Servicio,Barbero,Fecha,Hora,Precio,Estado,MetodoPago\n';
    const rows = appointments
      .map(
        (a) =>
          `${a.id},"${a.clientName}","${a.clientPhone}","${a.serviceName}","${a.barberName}",${a.date},${a.time},${a.servicePrice},${a.status},${a.paymentMethod}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barberia_madrid_reporte_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    sendPushNotification('Reporte Exportado', 'El archivo CSV de ventas y citas ha sido descargado.', { type: 'system', category: 'sistema' });
  };

  const handleExportJSON = () => {
    const exportData = {
      generadoEl: new Date().toISOString(),
      estadisticas: analytics,
      totalCitas: appointments.length,
      citas: appointments,
      productos: products,
      servicios: services,
      barberos: barbers,
      ajustes: settings,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barberia_madrid_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    sendPushNotification('Copia de Seguridad JSON', 'Respaldo completo de la base de datos descargado.', { type: 'system', category: 'sistema' });
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    createAppointment({
      serviceId: walkinServiceId,
      barberId: walkinBarberId,
      date: walkinDate,
      time: walkinTime,
      paymentMethod: 'cash',
      clientName: walkinClient.trim() || 'Cliente en mostrador',
      clientPhone: walkinPhone.trim() || '+34 600 000 000',
      notes: 'Cita registrada manualmente en administración',
    });
    setShowWalkinModal(false);
    setWalkinClient('');
    setWalkinPhone('');
  };

  const handleCreateBarber = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createBarberAccount({
      name: newBarberName,
      email: newBarberEmail,
      phone: newBarberPhone,
      initialPassword: newBarberPassword,
      specialty: newBarberSpecialty,
      avatar: newBarberAvatar,
      available: true,
    });
    if (res.success) {
      setShowAddBarberModal(false);
      setNewBarberName('');
      setNewBarberEmail('');
      setNewBarberPhone('');
    } else {
      alert(res.message);
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      name: newServiceName,
      price: Number(newServicePrice),
      duration: Number(newServiceDuration),
      category: newServiceCategory,
      description: newServiceDesc || 'Servicio profesional garantizado en Gran Vía 123.',
      image: newServiceImage,
      popular: false,
      availableForBooking: true,
    });
    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProdName,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      category: newProdCategory,
      description: newProdDesc || 'Producto profesional para el cuidado masculino.',
      image: newProdImage,
      available: true,
    });
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  const handleSaveWelcomeImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!welcomeImageUrl.trim()) return;
    updateHeroWelcomeImage(welcomeImageUrl);
    setWelcomePreviewSaved(true);
    setTimeout(() => setWelcomePreviewSaved(false), 2500);
  };

  const handleAdminChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg({ text: '', isError: false });
    const res = changePassword(adminCurrentPass, adminNewPass, adminConfirmPass);
    if (res.success) {
      setAdminPassMsg({ text: res.message, isError: false });
      setAdminCurrentPass('');
      setAdminNewPass('');
      setAdminConfirmPass('');
    } else {
      setAdminPassMsg({ text: res.message, isError: true });
    }
  };

  // Security check: Only authenticated admin can view this dashboard
  if (currentUser.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-[#111722] border border-red-500/30 rounded-3xl max-w-lg mx-auto space-y-4 shadow-2xl">
        <ShieldCheck className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Acceso Restringido</h3>
        <p className="text-xs text-slate-400">
          Solo el administrador autorizado puede acceder a la configuración completa de la página, diseño, precios y gestión del salón.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111722] border border-[#202b3d] p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-white">Panel Administrativo</h2>
              <span className="text-[10px] uppercase font-bold bg-amber-500 text-black px-2 py-0.5 rounded-md">
                Control Total
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestión centralizada: Personalización completa, Clientes, Barberos, Servicios, Citas, Productos y Finanzas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setShowWalkinModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Cita Manual</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'customize', label: '🎨 Personalizar mi página', icon: Palette },
          { id: 'analytics', label: 'Analítica & Ventas', icon: TrendingUp },
          { id: 'appointments', label: 'Gestión de Citas', icon: Calendar },
          { id: 'barbers', label: 'Gestión de Barberos', icon: Users },
          { id: 'services', label: 'Servicios', icon: Scissors },
          { id: 'products', label: 'Productos', icon: ShoppingBag },
          { id: 'clients', label: 'Clientes', icon: Users },
          { id: 'welcome_image', label: 'Imagen de Portada', icon: ImageIcon },
          { id: 'notifications', label: 'Campañas Push', icon: Bell },
          { id: 'activity_logs', label: 'Historial de Actividad', icon: History },
          { id: 'settings', label: 'Ajustes & Contraseña', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id as typeof activeAdminSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-[#121822] text-slate-300 border border-[#202b3d] hover:bg-[#18212e]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: PERSONALIZAR MI PÁGINA */}
      {activeAdminSubTab === 'customize' && (
        <AdminCustomizationPanel />
      )}

      {/* TAB 1: ANALYTICS */}
      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Facturación de Hoy</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{formatPrice(analytics.dailyRevenue)}</p>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">↑ +14% vs ayer</span>
            </div>
            <div className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Facturación del Mes</span>
              <p className="text-2xl font-black text-white mt-1">{formatPrice(analytics.monthlyRevenue)}</p>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">↑ Meta mensual: 94%</span>
            </div>
            <div className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Ticket Promedio</span>
              <p className="text-2xl font-black text-white mt-1">{formatPrice(analytics.averageTicket)}</p>
              <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">Por cliente atendido</span>
            </div>
            <div className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Tasa de Ocupación</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{analytics.occupancyRate}%</p>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">4 sillones operativos</span>
            </div>
          </div>

          <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold text-white text-base mb-2">Rendimiento Semanal</h4>
            <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
              {analytics.weeklyTrend.map((item) => {
                const heightPct = Math.min(100, Math.max(15, (item.revenue / 1000) * 100));
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition">
                      {formatPrice(item.revenue)}
                    </span>
                    <div className="w-full max-w-[48px] bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-36">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl group-hover:brightness-110 transition-all duration-300"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 mt-1">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS MANAGEMENT */}
      {activeAdminSubTab === 'appointments' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-white text-base">Control Integral de Citas</h4>
              <p className="text-xs text-slate-400">
                Visualiza, filtra, edita y gestiona las reservas de todos los barberos y clientes.
              </p>
            </div>

            {/* "Eliminar citas completadas" button as requested */}
            <button
              onClick={() => setShowDeleteCompletedModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar citas completadas</span>
            </button>
          </div>

          {/* Filters Bar: Status, Date, Barber, Service, Client Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 bg-[#16202e] p-3 rounded-2xl border border-slate-800">
            {/* Status */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#111722] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="in_progress">En sillón</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Fecha</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-[#111722] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            {/* Barber */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Barbero</label>
              <select
                value={barberFilter}
                onChange={(e) => setBarberFilter(e.target.value)}
                className="w-full bg-[#111722] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="all">Todos los barberos</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Servicio</label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full bg-[#111722] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="all">Todos los servicios</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Search Client */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Buscar Cliente</label>
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Nombre o teléfono..."
                className="w-full bg-[#111722] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#16202e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Servicio</th>
                  <th className="py-3 px-3">Barbero</th>
                  <th className="py-3 px-3">Fecha & Hora</th>
                  <th className="py-3 px-3">Precio</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No se encontraron citas con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#151d2a] transition">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">{apt.id}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-white">{apt.clientName}</p>
                        <p className="text-[10px] text-slate-500">{apt.clientPhone}</p>
                      </td>
                      <td className="py-3 px-3">{apt.serviceName}</td>
                      <td className="py-3 px-3 text-slate-200">{apt.barberName}</td>
                      <td className="py-3 px-3">
                        <span>{apt.date}</span>
                        <span className="text-amber-400 font-semibold block">{apt.time} hrs</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">{formatPrice(apt.servicePrice)}</td>
                      <td className="py-3 px-3">
                        <select
                          value={apt.status}
                          onChange={(e) =>
                            updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)
                          }
                          className="bg-[#16202e] border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmada</option>
                          <option value="in_progress">En sillón</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={() => setEditingAppointment(apt)}
                          title="Editar Cita"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          title="Eliminar Cita"
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BARBER MANAGEMENT */}
      {activeAdminSubTab === 'barbers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-base">Cuentas y Equipo de Barberos</h4>
              <p className="text-xs text-slate-400">
                Crea cuentas para tus barberos con rol BARBER para que gestionen su agenda y atiendan citas.
              </p>
            </div>

            <button
              onClick={() => setShowAddBarberModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nuevo Barbero</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barbers.map((b) => (
              <div
                key={b.id}
                className="bg-[#111722] border border-[#202b3d] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={b.avatar}
                      alt={b.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/40"
                    />
                    <div>
                      <h5 className="font-bold text-white text-sm">{b.name}</h5>
                      <p className="text-xs text-amber-400">{b.role}</p>
                      <p className="text-[11px] text-slate-400">{b.email || `${b.name.toLowerCase().replace(/\s+/g, '')}@barberiamadrid.es`}</p>
                      <p className="text-[11px] text-slate-500">{b.phone || '+34 600 000 000'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBarberActive(b.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      b.active !== false
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {b.active !== false ? 'Cuenta Activa' : 'Desactivado'}
                  </button>
                </div>

                <div className="text-xs text-slate-300 bg-[#16202e] p-2.5 rounded-xl flex justify-between items-center">
                  <span>Especialidad: <strong>{b.specialty}</strong></span>
                  <span className="text-amber-400 font-bold">★ {b.rating}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setBarberFilter(b.id);
                        setActiveAdminSubTab('appointments');
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-600/30 cursor-pointer"
                      title="Ver citas asignadas a este barbero"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Citas ({appointments.filter((a) => a.barberId === b.id).length})</span>
                    </button>
                    <button
                      onClick={() => setEditingBarber(b)}
                      className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPasswordChangeBarber(b);
                        setBarberNewPass('');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Clave</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la cuenta del barbero ${b.name}?`)) {
                          deleteBarber(b.id);
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES MANAGEMENT */}
      {activeAdminSubTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-base">Catálogo de Servicios</h4>
              <p className="text-xs text-slate-400">
                Añade, edita precios y activa/desactiva servicios para reservas de clientes en tiempo real.
              </p>
            </div>

            <button
              onClick={() => setShowAddServiceModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Servicio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <img src={s.image} alt={s.name} className="w-full h-32 rounded-xl object-cover mb-3" />
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-white text-sm">{s.name}</h5>
                    <span className="font-black text-amber-400 text-base">{formatPrice(s.price)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{s.description}</p>
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {s.duration} min
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleServiceAvailability(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      s.availableForBooking !== false
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/30'
                        : 'bg-red-950/60 text-red-400 border border-red-600/30'
                    }`}
                  >
                    {s.availableForBooking !== false ? 'Activo para Reservas' : 'Pausado'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingService(s)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar servicio ${s.name}?`)) {
                          deleteService(s.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
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

      {/* TAB 5: PRODUCTS MANAGEMENT */}
      {activeAdminSubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-base">Inventario de Productos en Tienda</h4>
              <p className="text-xs text-slate-400">
                Los productos añadidos aquí aparecen automáticamente en el portal del cliente con su stock y precio.
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Producto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-[#111722] border border-[#202b3d] rounded-2xl p-4 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <img src={p.image} alt={p.name} className="w-full h-32 rounded-xl object-cover mb-3" />
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-white text-sm">{p.name}</h5>
                    <span className="font-black text-amber-400 text-base">{formatPrice(p.price)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  <p className="text-[11px] text-slate-300 mt-2">
                    Stock disponible: <strong>{p.stock} unidades</strong>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleProductAvailability(p.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      p.available && p.stock > 0
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/30'
                        : 'bg-red-950/60 text-red-400 border border-red-600/30'
                    }`}
                  >
                    {p.available && p.stock > 0 ? 'En Venta' : 'No Disponible'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar producto ${p.name}?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
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

      {/* TAB 6: CLIENTS MANAGEMENT */}
      {activeAdminSubTab === 'clients' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-white text-base">Base de Datos de Clientes Registrados</h4>
              <p className="text-xs text-slate-400">
                Consulta clientes, su historial de visitas, activa/desactiva cuentas o da de alta clientes manualmente.
              </p>
            </div>

            <button
              onClick={() => setShowAddClientModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Cliente Manualmente</span>
            </button>
          </div>

          {/* Search bar for clients */}
          <div className="flex items-center gap-2 bg-[#16202e] p-2.5 rounded-xl border border-slate-700/60 max-w-md">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={clientSearchFilter}
              onChange={(e) => setClientSearchFilter(e.target.value)}
              placeholder="Buscar cliente por nombre, email o teléfono..."
              className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#16202e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Cliente</th>
                  <th className="py-3 px-3">Correo</th>
                  <th className="py-3 px-3">Teléfono</th>
                  <th className="py-3 px-3">Citas Realizadas</th>
                  <th className="py-3 px-3">Puntos VIP</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {registeredClients
                  .filter((c) => {
                    if (!clientSearchFilter) return true;
                    const query = clientSearchFilter.toLowerCase();
                    return (
                      c.name.toLowerCase().includes(query) ||
                      c.email.toLowerCase().includes(query) ||
                      c.phone.includes(query)
                    );
                  })
                  .map((c) => {
                    const clientAppointments = appointments.filter(
                      (a) =>
                        (a.clientEmail && a.clientEmail.toLowerCase() === c.email.toLowerCase()) ||
                        (a.clientName && a.clientName.toLowerCase() === c.name.toLowerCase()) ||
                        (a.clientPhone && a.clientPhone === c.phone)
                    );

                    return (
                      <tr key={c.id} className="hover:bg-[#151d2a] transition">
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                          <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/40" />
                          <span>{c.name}</span>
                        </td>
                        <td className="py-3 px-3">{c.email}</td>
                        <td className="py-3 px-3">{c.phone}</td>
                        <td className="py-3 px-3">
                          <span className="bg-slate-800 px-2.5 py-1 rounded-full text-xs font-bold text-white">
                            {clientAppointments.length} citas
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-amber-400">
                          {c.loyaltyPoints ?? 100} pts ({c.loyaltyTier ?? 'Bronce'})
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => toggleUserActive(c.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                              c.active !== false
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600/30'
                                : 'bg-red-950/60 text-red-400 border-red-600/30'
                            }`}
                          >
                            {c.active !== false ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedClientForHistory(c)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
                          >
                            Ver Citas
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: WELCOME IMAGE SECTION */}
      {activeAdminSubTab === 'welcome_image' && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              Imagen de Bienvenida / Portada Principal
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Esta imagen se muestra automáticamente en el banner de cabecera de la página de inicio para todos los clientes. Sube tu propia foto, recórtala o ajústala.
            </p>
          </div>

          <ImageUploadWidget
            label="Subir o Cambiar Imagen de Portada"
            helperText="Sube una fotografía desde tu ordenador o teléfono. Podrás recortar y ajustar brillo antes de guardar."
            currentImage={welcomeImageUrl}
            onImageChange={(newImg) => {
              setWelcomeImageUrl(newImg);
              updateHeroWelcomeImage(newImg);
              setWelcomePreviewSaved(true);
              setTimeout(() => setWelcomePreviewSaved(false), 3000);
            }}
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
                name: 'Maestro Barbero en Acción',
                url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=2000&q=85',
              },
            ]}
          />

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {welcomePreviewSaved ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Imagen de bienvenida guardada y sincronizada en vivo
              </span>
            ) : (
              <span className="text-xs text-slate-500">Los cambios se aplican automáticamente en la web</span>
            )}

            <button
              type="button"
              onClick={() => {
                updateHeroWelcomeImage(welcomeImageUrl);
                setWelcomePreviewSaved(true);
                setTimeout(() => setWelcomePreviewSaved(false), 3000);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition"
            >
              Confirmar Imagen de Bienvenida
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: PUSH CAMPAIGNS & SCHEDULER */}
      {activeAdminSubTab === 'notifications' && (
        <AdminPushCampaignsPanel />
      )}

      {/* TAB 9: SETTINGS & ADMIN PASSWORD CHANGE */}
      {activeAdminSubTab === 'settings' && (
        <div className="space-y-6">
          {/* Admin Change Password Form as requested */}
          <form
            onSubmit={handleAdminChangePassword}
            className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4"
          >
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                Cambiar Contraseña del Administrador
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Seguridad reforzada: ingresa tu contraseña actual para establecer una nueva clave.
              </p>
            </div>

            {adminPassMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  adminPassMsg.isError
                    ? 'bg-red-950/40 border border-red-800/60 text-red-300'
                    : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                }`}
              >
                {adminPassMsg.isError ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>{adminPassMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={adminCurrentPass}
                  onChange={(e) => setAdminCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nueva Contraseña (min 6)</label>
                <input
                  type="password"
                  value={adminNewPass}
                  onChange={(e) => setAdminNewPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={adminConfirmPass}
                  onChange={(e) => setAdminConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>

          {/* Business Details & Export Reports */}
          <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-base">Parámetros del Local & Exportaciones</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={settings.shopName}
                  onChange={(e) => updateSettings({ shopName: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => updateSettings({ address: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Informe CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Base de Datos JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: HISTORIAL DE ACTIVIDAD & AUDITORÍA */}
      {activeAdminSubTab === 'activity_logs' && (
        <AdminActivityLogs />
      )}

      {/* MODAL: Eliminar Citas Completadas Confirmation */}
      {showDeleteCompletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-red-500/40 rounded-3xl p-6 text-left max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-black text-white text-base">Confirmar Limpieza de Citas</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Estás seguro de que quieres eliminar las citas completadas? Esta acción no se puede deshacer.
            </p>

            <div className="p-3 bg-red-950/30 rounded-xl border border-red-800/40 text-[11px] text-red-300">
              * Nota: Las citas pendientes, confirmadas o en sillón se conservarán intactas.
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteCompletedModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCompletedAppointments();
                  setShowDeleteCompletedModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs"
              >
                Sí, Eliminar Completadas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Crear Cita Manual */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Registrar Cita Manualmente</h3>
            <form onSubmit={handleCreateWalkin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  value={walkinClient}
                  onChange={(e) => setWalkinClient(e.target.value)}
                  placeholder="Ej: David García"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Servicio</label>
                  <select
                    value={walkinServiceId}
                    onChange={(e) => setWalkinServiceId(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-2 py-2 text-xs text-white"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} - €{s.price}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Barbero</label>
                  <select
                    value={walkinBarberId}
                    onChange={(e) => setWalkinBarberId(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-2 py-2 text-xs text-white"
                  >
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={walkinDate}
                    onChange={(e) => setWalkinDate(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-2 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora</label>
                  <input
                    type="time"
                    value={walkinTime}
                    onChange={(e) => setWalkinTime(e.target.value)}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-2 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Añadir Barbero */}
      {showAddBarberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Crear Cuenta de Barbero</h3>
            <p className="text-xs text-slate-400">
              El barbero recibirá el rol BARBER y podrá iniciar sesión en su portal correspondiente.
            </p>

            <form onSubmit={handleCreateBarber} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={newBarberName}
                  onChange={(e) => setNewBarberName(e.target.value)}
                  placeholder="Ej: Raúl Vega"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico (Login)</label>
                <input
                  type="email"
                  value={newBarberEmail}
                  onChange={(e) => setNewBarberEmail(e.target.value)}
                  placeholder="raul@barberiamadrid.es"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={newBarberPhone}
                  onChange={(e) => setNewBarberPhone(e.target.value)}
                  placeholder="+34 600 111 222"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Inicial</label>
                <input
                  type="password"
                  value={newBarberPassword}
                  onChange={(e) => setNewBarberPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidad</label>
                <input
                  type="text"
                  value={newBarberSpecialty}
                  onChange={(e) => setNewBarberSpecialty(e.target.value)}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBarberModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Crear Barbero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Cambiar Contraseña Barbero */}
      {passwordChangeBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">
              Nueva Contraseña para {passwordChangeBarber.name}
            </h3>
            <input
              type="password"
              value={barberNewPass}
              onChange={(e) => setBarberNewPass(e.target.value)}
              placeholder="Nueva contraseña (min 6)..."
              className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3.5 py-2 text-xs text-white"
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPasswordChangeBarber(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  changeBarberPassword(passwordChangeBarber.id, barberNewPass);
                  setPasswordChangeBarber(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                Guardar Clave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Añadir Servicio */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-md w-full space-y-3 shadow-2xl">
            <h3 className="font-black text-white text-base">Crear Nuevo Servicio</h3>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Ej: Taper Fade + Peinado"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <input
                  type="text"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Detalles del corte..."
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Añadir Producto */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-md w-full space-y-3 shadow-2xl">
            <h3 className="font-black text-white text-base">Añadir Producto a la Tienda</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ej: Cera Mate Modeladora"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <input
                  type="text"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Detalles del producto..."
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Editar Cita */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-md w-full space-y-3 shadow-2xl">
            <h3 className="font-black text-white text-base">Modificar Cita {editingAppointment.id}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente</label>
                <input
                  type="text"
                  value={editingAppointment.clientName}
                  onChange={(e) =>
                    setEditingAppointment({ ...editingAppointment, clientName: e.target.value })
                  }
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, date: e.target.value })
                    }
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-2 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora</label>
                  <input
                    type="time"
                    value={editingAppointment.time}
                    onChange={(e) =>
                      setEditingAppointment({ ...editingAppointment, time: e.target.value })
                    }
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-2 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
                <select
                  value={editingAppointment.status}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      status: e.target.value as AppointmentStatus,
                    })
                  }
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="in_progress">En sillón</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateAppointmentDetails(editingAppointment.id, editingAppointment);
                    setEditingAppointment(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Editar Servicio */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Modificar Servicio: {editingService.name}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateService(editingService.id, editingService);
                setEditingService(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duración (min)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={editingService.duration}
                    onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL de la Imagen</label>
                <input
                  type="url"
                  value={editingService.image}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availService"
                  checked={editingService.availableForBooking !== false}
                  onChange={(e) => setEditingService({ ...editingService, availableForBooking: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <label htmlFor="availService" className="text-xs text-slate-300 cursor-pointer">
                  Disponible para reservas públicas de clientes
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Editar Producto */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Modificar Producto: {editingProduct.name}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct(editingProduct.id, editingProduct);
                setEditingProduct(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock (uds)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL de la Imagen</label>
                <input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availProd"
                  checked={editingProduct.available}
                  onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <label htmlFor="availProd" className="text-xs text-slate-300 cursor-pointer">
                  Activo para la venta en el portal de clientes
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Editar Barbero */}
      {editingBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Modificar Datos de Barbero: {editingBarber.name}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBarber(editingBarber.id, editingBarber);
                setEditingBarber(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingBarber.name}
                  onChange={(e) => setEditingBarber({ ...editingBarber, name: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingBarber.email || ''}
                    onChange={(e) => setEditingBarber({ ...editingBarber, email: e.target.value })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={editingBarber.phone || ''}
                    onChange={(e) => setEditingBarber({ ...editingBarber, phone: e.target.value })}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidad</label>
                <input
                  type="text"
                  value={editingBarber.specialty}
                  onChange={(e) => setEditingBarber({ ...editingBarber, specialty: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Foto / Avatar (URL)</label>
                <input
                  type="url"
                  value={editingBarber.avatar}
                  onChange={(e) => setEditingBarber({ ...editingBarber, avatar: e.target.value })}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBarber(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs"
                >
                  Guardar Barbero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Registrar Cliente Manualmente */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-white text-base">Registrar Nuevo Cliente</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createManualClient({
                  name: newClientName,
                  email: newClientEmail,
                  phone: newClientPhone,
                  initialPassword: newClientPassword,
                  loyaltyPoints: newClientPoints,
                });
                setShowAddClientModal(false);
                setNewClientName('');
                setNewClientEmail('');
                setNewClientPhone('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ej: Marcos García"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+34 600..."
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Puntos VIP Iniciales</label>
                  <input
                    type="number"
                    min="0"
                    value={newClientPoints}
                    onChange={(e) => setNewClientPoints(Number(e.target.value))}
                    className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Inicial</label>
                <input
                  type="text"
                  value={newClientPassword}
                  onChange={(e) => setNewClientPassword(e.target.value)}
                  className="w-full bg-[#16202e] border border-[#253245] rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs cursor-pointer"
                >
                  Dar de Alta Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Historial de Citas del Cliente */}
      {selectedClientForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121822] border border-[#243044] rounded-3xl p-6 text-left max-w-2xl w-full space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedClientForHistory.avatar}
                  alt={selectedClientForHistory.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{selectedClientForHistory.name}</h3>
                  <p className="text-xs text-slate-400">{selectedClientForHistory.email} • {selectedClientForHistory.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClientForHistory(null)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {appointments.filter(
                (a) =>
                  (a.clientEmail && a.clientEmail.toLowerCase() === selectedClientForHistory.email.toLowerCase()) ||
                  (a.clientName && a.clientName.toLowerCase() === selectedClientForHistory.name.toLowerCase()) ||
                  (a.clientPhone && a.clientPhone === selectedClientForHistory.phone)
              ).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Este cliente no tiene citas registradas.</p>
              ) : (
                appointments
                  .filter(
                    (a) =>
                      (a.clientEmail && a.clientEmail.toLowerCase() === selectedClientForHistory.email.toLowerCase()) ||
                      (a.clientName && a.clientName.toLowerCase() === selectedClientForHistory.name.toLowerCase()) ||
                      (a.clientPhone && a.clientPhone === selectedClientForHistory.phone)
                  )
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 bg-[#16202e] border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{apt.id}</span>
                          <span className="font-bold text-white">{apt.serviceName}</span>
                          <span className="text-slate-400">con {apt.barberName}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {apt.date} a las {apt.time} hrs • {formatPrice(apt.servicePrice)}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === 'completed'
                            ? 'bg-blue-950/60 text-blue-400'
                            : apt.status === 'confirmed'
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : apt.status === 'in_progress'
                            ? 'bg-amber-950/60 text-amber-400'
                            : 'bg-red-950/60 text-red-400'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
