import React, { useState, useMemo } from 'react';
import {
  Clock,
  User,
  ShieldCheck,
  Search,
  Filter,
  Image as ImageIcon,
  Settings,
  Palette,
  Scissors,
  ShoppingBag,
  Users,
  Bell,
  Globe,
  Download,
  FileText,
  Trash2,
  RotateCcw,
  PlusCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Code,
  Laptop,
} from 'lucide-react';
import { useBarber } from '../../context/BarberContext';
import { ActivityLog, ActivityLogCategory } from '../../types/barbershop';

export const AdminActivityLogs: React.FC = () => {
  const {
    activityLogs,
    logActivity,
    clearActivityLogs,
    resetActivityLogsToDefault,
    currentUser,
  } = useBarber();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [onlyImages, setOnlyImages] = useState(false);
  const [onlySettings, setOnlySettings] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  // Modal / Expansion states
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; author: string; date: string } | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unique list of authors for filter dropdown
  const authorsList = useMemo(() => {
    const map = new Map<string, { id: string; name: string; role: string }>();
    activityLogs.forEach((log) => {
      if (!map.has(log.userName)) {
        map.set(log.userName, { id: log.userId, name: log.userName, role: log.userRole });
      }
    });
    return Array.from(map.values());
  }, [activityLogs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    const now = Date.now();

    return activityLogs.filter((log) => {
      // Category filter
      if (selectedCategory !== 'all' && log.category !== selectedCategory) {
        return false;
      }

      // User filter
      if (selectedUser !== 'all' && log.userName !== selectedUser) {
        return false;
      }

      // Quick image filter
      if (onlyImages && !log.imageThumbnail && log.category !== 'images' && log.actionType !== 'image_update') {
        return false;
      }

      // Quick settings filter
      if (onlySettings && log.category !== 'settings' && log.actionType !== 'setting_change') {
        return false;
      }

      // Time filter
      if (timeFilter !== 'all') {
        const logTime = new Date(log.timestamp).getTime();
        const diffHours = (now - logTime) / (1000 * 3600);
        if (timeFilter === 'today' && diffHours > 24) return false;
        if (timeFilter === '7days' && diffHours > 24 * 7) return false;
        if (timeFilter === '30days' && diffHours > 24 * 30) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = log.title.toLowerCase().includes(q);
        const inDesc = log.description.toLowerCase().includes(q);
        const inUser = log.userName.toLowerCase().includes(q);
        const inEmail = log.userEmail?.toLowerCase().includes(q) || false;
        const inItem = log.itemAffected?.toLowerCase().includes(q) || false;
        const inOld = log.oldValue?.toLowerCase().includes(q) || false;
        const inNew = log.newValue?.toLowerCase().includes(q) || false;
        const inIp = log.ipAddress?.toLowerCase().includes(q) || false;

        return inTitle || inDesc || inUser || inEmail || inItem || inOld || inNew || inIp;
      }

      return true;
    });
  }, [activityLogs, selectedCategory, selectedUser, onlyImages, onlySettings, timeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = activityLogs.length;
    const settingsChanges = activityLogs.filter(
      (l) => l.category === 'settings' || l.actionType === 'setting_change'
    ).length;
    const imageUpdates = activityLogs.filter(
      (l) => l.category === 'images' || l.actionType === 'image_update' || !!l.imageThumbnail
    ).length;

    // Most active admin
    const authorCounts: { [name: string]: number } = {};
    activityLogs.forEach((l) => {
      authorCounts[l.userName] = (authorCounts[l.userName] || 0) + 1;
    });
    let topAuthor = 'Ninguno';
    let maxCount = 0;
    Object.entries(authorCounts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topAuthor = name;
      }
    });

    return { total, settingsChanges, imageUpdates, topAuthor, maxCount };
  }, [activityLogs]);

  // Relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return 'Reciente';
    }
  };

  const getExactDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Category Icon & Styling badge
  const getCategoryBadge = (category: ActivityLogCategory, actionType: string) => {
    switch (category) {
      case 'images':
        return {
          icon: ImageIcon,
          label: 'Imagen / Logo',
          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          dot: 'bg-cyan-400',
        };
      case 'settings':
        return {
          icon: Settings,
          label: 'Ajustes Web',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-400',
        };
      case 'branding':
        return {
          icon: actionType === 'customization_publish' ? Globe : Palette,
          label: actionType === 'customization_publish' ? 'Publicación' : 'Diseño & Marca',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          dot: 'bg-purple-400',
        };
      case 'catalog':
        return {
          icon: Scissors,
          label: 'Catálogo / Precios',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          dot: 'bg-amber-400',
        };
      case 'team':
        return {
          icon: Users,
          label: 'Equipo & Barberos',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          dot: 'bg-blue-400',
        };
      case 'push':
        return {
          icon: Bell,
          label: 'Campaña Push',
          color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          dot: 'bg-orange-400',
        };
      default:
        return {
          icon: Layers,
          label: 'Sistema',
          color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          dot: 'bg-slate-400',
        };
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (activityLogs.length === 0) {
      showToast('No hay registros de actividad para exportar.');
      return;
    }

    const headers = [
      'ID',
      'Fecha y Hora',
      'Usuario',
      'Rol',
      'Email',
      'Categoría',
      'Tipo de Acción',
      'Título',
      'Descripción',
      'Elemento Afectado',
      'Valor Anterior',
      'Nuevo Valor',
      'URL Imagen / Thumbnail',
      'Dirección IP',
    ];

    const rows = activityLogs.map((log) => [
      log.id,
      getExactDateTime(log.timestamp),
      log.userName,
      log.userRole,
      log.userEmail || '',
      log.category,
      log.actionType,
      `"${log.title.replace(/"/g, '""')}"`,
      `"${log.description.replace(/"/g, '""')}"`,
      `"${(log.itemAffected || '').replace(/"/g, '""')}"`,
      `"${(log.oldValue || '').replace(/"/g, '""')}"`,
      `"${(log.newValue || '').replace(/"/g, '""')}"`,
      log.imageThumbnail || '',
      log.ipAddress || '',
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registro_actividad_barberia_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Archivo CSV generado y descargado con éxito.');
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(activityLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auditoria_actividad_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Informe de auditoría JSON descargado.');
  };

  // Create a manual test log
  const handleCreateSampleTestLog = () => {
    logActivity({
      category: 'settings',
      actionType: 'setting_change',
      title: 'Verificación de Auditoría en Tiempo Real',
      description: `El administrador ${currentUser.name} ejecutó un test de trazabilidad para auditar cambios y permisos.`,
      itemAffected: 'Sistema de Auditoría & Trazabilidad',
      oldValue: 'Estado de verificación anterior',
      newValue: 'Verificado correctamente por el usuario',
    });
    showToast('Nuevo registro de auditoría creado en tiempo real.');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-amber-500 text-black px-4 py-3 rounded-2xl font-bold shadow-2xl animate-fade-in text-xs md:text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-[#121926] via-[#101724] to-[#0c1017] border border-[#233147] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl shadow-inner">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Registro de Actividad & Auditoría
                </h3>
                <span className="text-[10px] uppercase font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Trazabilidad 100%
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Supervisa cada cambio realizado en la página web: quién modificó qué configuración, qué imágenes se subieron o cambiaron, y la fecha exacta para garantizar total responsabilidad en el equipo administrativo.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCreateSampleTestLog}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-sm"
              title="Añade un registro para probar la actualización en tiempo real"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Registrar Prueba</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
              title="Borrar todos los registros"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>

            <button
              onClick={resetActivityLogsToDefault}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Restaurar registros predeterminados"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-[#161f2e]/70 border border-[#233147]/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Registros
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl md:text-2xl font-black text-white">{stats.total}</span>
              <span className="text-[10px] text-slate-400 font-medium">movimientos</span>
            </div>
          </div>

          <div className="bg-[#161f2e]/70 border border-[#233147]/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Settings className="w-3 h-3" />
              Cambios de Ajustes
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl md:text-2xl font-black text-emerald-300">{stats.settingsChanges}</span>
              <span className="text-[10px] text-slate-400 font-medium">modificaciones</span>
            </div>
          </div>

          <div className="bg-[#161f2e]/70 border border-[#233147]/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" />
              Imágenes Subidas
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl md:text-2xl font-black text-cyan-300">{stats.imageUpdates}</span>
              <span className="text-[10px] text-slate-400 font-medium">fotografías/logos</span>
            </div>
          </div>

          <div className="bg-[#161f2e]/70 border border-[#233147]/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              Admin Más Activo
            </span>
            <div className="mt-1 truncate">
              <span className="text-sm md:text-base font-black text-white truncate block">
                {stats.topAuthor}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {stats.maxCount} acciones realizadas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-[#111722] border border-[#202b3d] p-4 md:p-5 rounded-3xl space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por administrador, ajuste modificado, imagen, fecha, IP..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#0d121a] border border-[#253247] text-white placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setOnlyImages((prev) => !prev);
                if (!onlyImages) setOnlySettings(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                onlyImages
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-[#161f2e] text-slate-300 border-[#253247] hover:border-slate-600'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Solo Imágenes ({stats.imageUpdates})</span>
            </button>

            <button
              onClick={() => {
                setOnlySettings((prev) => !prev);
                if (!onlySettings) setOnlyImages(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                onlySettings
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-[#161f2e] text-slate-300 border-[#253247] hover:border-slate-600'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solo Ajustes ({stats.settingsChanges})</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#0d121a] border border-[#253247] rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'timeline'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista en formato timeline con fotos"
              >
                <Clock className="w-3 h-3" />
                <span className="hidden sm:inline">Cronología</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista compacta en tabla"
              >
                <FileText className="w-3 h-3" />
                <span className="hidden sm:inline">Tabla</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/60">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Filtrar por Categoría:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0d121a] border border-[#253247] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas las categorías</option>
              <option value="images">🖼️ Imágenes & Logotipo</option>
              <option value="settings">⚙️ Ajustes de Página</option>
              <option value="branding">🎨 Marca & Paleta de Colores</option>
              <option value="catalog">✂️ Catálogo de Servicios & Productos</option>
              <option value="team">👥 Equipo de Barberos</option>
              <option value="push">🔔 Campañas Push</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Filtrar por Responsable:
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0d121a] border border-[#253247] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos los miembros</option>
              {authorsList.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name} ({author.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Período de Tiempo:
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
              className="w-full px-3 py-2 rounded-xl bg-[#0d121a] border border-[#253247] text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todo el historial</option>
              <option value="today">Hoy (últimas 24 horas)</option>
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Mostrando <strong className="text-white">{filteredLogs.length}</strong> de {activityLogs.length} registros
          {searchQuery && ` para "${searchQuery}"`}
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedUser !== 'all' || timeFilter !== 'all' || onlyImages || onlySettings) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedUser('all');
              setTimeFilter('all');
              setOnlyImages(false);
              setOnlySettings(false);
            }}
            className="text-amber-400 hover:underline font-bold"
          >
            Restablecer filtros
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
            <Filter className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-black text-white">No se encontraron registros de actividad</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No hay movimientos que coincidan con los filtros o término de búsqueda seleccionado.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedUser('all');
              setTimeFilter('all');
              setOnlyImages(false);
              setOnlySettings(false);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar Filtros</span>
          </button>
        </div>
      )}

      {/* TIMELINE VIEW */}
      {viewMode === 'timeline' && filteredLogs.length > 0 && (
        <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-5 md:before:left-7 before:w-0.5 before:bg-[#202b3d] before:z-0">
          {filteredLogs.map((log) => {
            const badge = getCategoryBadge(log.category, log.actionType);
            const BadgeIcon = badge.icon;
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="relative z-10 pl-11 md:pl-16 group transition duration-200"
              >
                {/* Node indicator */}
                <div className="absolute left-2.5 md:left-4 top-4 -translate-x-1/2 w-6 h-6 rounded-full bg-[#121822] border-2 border-amber-500/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <div className={`w-2 h-2 rounded-full ${badge.dot}`} />
                </div>

                {/* Card Container */}
                <div className="bg-[#111722] hover:bg-[#131b28] border border-[#202b3d] hover:border-[#2b3a52] rounded-3xl p-4 md:p-5 shadow-lg transition space-y-3">
                  {/* Top line: Author + Category badge + Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* User author profile */}
                    <div className="flex items-center gap-2.5">
                      {log.userAvatar ? (
                        <img
                          src={log.userAvatar}
                          alt={log.userName}
                          className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shadow-sm"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-700">
                          {log.userName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs md:text-sm font-black text-white">
                            {log.userName}
                          </span>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {log.userRole === 'admin' ? 'Administrador' : log.userRole === 'barber' ? 'Barbero' : 'Usuario'}
                          </span>
                        </div>
                        {log.userEmail && (
                          <span className="text-[10px] text-slate-400 block -mt-0.5">
                            {log.userEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category & Time */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${badge.color}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>

                      <div
                        className="text-[11px] text-slate-400 flex items-center gap-1 bg-[#0b0f17] px-2.5 py-1 rounded-xl border border-slate-800"
                        title={getExactDateTime(log.timestamp)}
                      >
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{getRelativeTime(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Action Title & Description */}
                  <div>
                    <h4 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                      <span>{log.title}</span>
                      {log.itemAffected && (
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                          {log.itemAffected}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                      {log.description}
                    </p>
                  </div>

                  {/* Before / After Value comparison chip */}
                  {(log.oldValue || log.newValue) && (
                    <div className="bg-[#0b0f17] border border-[#1b2434] rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                      {log.oldValue && (
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-rose-400 block mb-0.5">
                            Valor Anterior:
                          </span>
                          <span className="text-slate-300 font-mono text-[11px] break-all bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg block truncate">
                            {log.oldValue}
                          </span>
                        </div>
                      )}

                      {log.oldValue && log.newValue && (
                        <div className="hidden sm:flex text-slate-500 items-center justify-center pt-3">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}

                      {log.newValue && (
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">
                            Nuevo Valor Actualizado:
                          </span>
                          <span className="text-emerald-300 font-mono text-[11px] break-all bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg block truncate font-bold">
                            {log.newValue}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image Thumbnail Preview & Inspection */}
                  {log.imageThumbnail && (
                    <div className="bg-[#0c111a] border border-cyan-500/20 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative group/thumb cursor-pointer" onClick={() => setPreviewImage({
                          url: log.imageThumbnail!,
                          title: log.title,
                          author: log.userName,
                          date: getExactDateTime(log.timestamp),
                        })}>
                          <img
                            src={log.imageThumbnail}
                            alt="Previsualización de imagen"
                            className="w-16 h-16 rounded-xl object-cover border border-cyan-500/30 shadow-md group-hover/thumb:brightness-110 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-cyan-300">
                              Fotografía / Archivo Asociado
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-md">
                              Verificada
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                            Haz clic para inspeccionar en alta definición la imagen subida.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setPreviewImage({
                          url: log.imageThumbnail!,
                          title: log.title,
                          author: log.userName,
                          date: getExactDateTime(log.timestamp),
                        })}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Imagen Completa</span>
                      </button>
                    </div>
                  )}

                  {/* Technical Footer & Accordion Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-slate-500 text-[10px]">
                        ID: {log.id}
                      </span>
                      {log.ipAddress && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Laptop className="w-3 h-3 text-slate-500" />
                          <span>{log.ipAddress}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-slate-400 hover:text-amber-400 font-bold flex items-center gap-1 transition"
                    >
                      <Code className="w-3 h-3" />
                      <span>{isExpanded ? 'Ocultar Metadatos' : 'Detalles JSON'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Expanded Technical Payload */}
                  {isExpanded && (
                    <div className="bg-[#090d14] border border-slate-800 rounded-2xl p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto space-y-1 animate-fade-in">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                        // Metadatos Técnicos del Registro
                      </div>
                      <pre>{JSON.stringify(log, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && filteredLogs.length > 0 && (
        <div className="bg-[#111722] border border-[#202b3d] rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0c111a] text-slate-400 text-[11px] uppercase tracking-wider border-b border-[#202b3d]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Fecha / Hora</th>
                  <th className="py-3.5 px-4 font-bold">Responsable</th>
                  <th className="py-3.5 px-4 font-bold">Categoría</th>
                  <th className="py-3.5 px-4 font-bold">Acción Realizada</th>
                  <th className="py-3.5 px-4 font-bold">Elemento</th>
                  <th className="py-3.5 px-4 font-bold">Imagen</th>
                  <th className="py-3.5 px-4 font-bold text-right">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2535]">
                {filteredLogs.map((log) => {
                  const badge = getCategoryBadge(log.category, log.actionType);
                  const BadgeIcon = badge.icon;

                  return (
                    <tr key={log.id} className="hover:bg-[#141c2b] transition">
                      {/* Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-white">
                          {getRelativeTime(log.timestamp)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {getExactDateTime(log.timestamp)}
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {log.userAvatar ? (
                            <img
                              src={log.userAvatar}
                              alt={log.userName}
                              className="w-6 h-6 rounded-full object-cover border border-amber-500/30 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">
                              {log.userName.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <span className="font-bold text-white truncate block">
                              {log.userName}
                            </span>
                            <span className="text-[9px] text-slate-400 capitalize">
                              {log.userRole}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border inline-flex items-center gap-1 ${badge.color}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-white truncate">{log.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {log.description}
                        </div>
                      </td>

                      {/* Item Affected */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.itemAffected ? (
                          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            {log.itemAffected}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.imageThumbnail ? (
                          <button
                            onClick={() =>
                              setPreviewImage({
                                url: log.imageThumbnail!,
                                title: log.title,
                                author: log.userName,
                                date: getExactDateTime(log.timestamp),
                              })
                            }
                            className="group relative"
                            title="Ver imagen completa"
                          >
                            <img
                              src={log.imageThumbnail}
                              alt="miniatura"
                              className="w-8 h-8 rounded-lg object-cover border border-cyan-500/40 group-hover:scale-105 transition"
                            />
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[10px]">Sin imagen</span>
                        )}
                      </td>

                      {/* Inspect details */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition"
                        >
                          {expandedLogId === log.id ? 'Cerrar' : 'Ver'}
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

      {/* FULL IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#121926] border border-[#2b3a52] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative text-left">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-800 bg-[#0d121c]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-black text-white">
                    {previewImage.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Subida por {previewImage.author} el {previewImage.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Area */}
            <div className="p-4 md:p-6 bg-black/50 flex items-center justify-center min-h-[260px] max-h-[60vh] overflow-hidden">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[50vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
              />
            </div>

            {/* Footer with actions */}
            <div className="p-4 border-t border-slate-800 bg-[#0d121c] flex items-center justify-between gap-3 flex-wrap">
              <div className="font-mono text-[10px] text-slate-400 truncate max-w-xs md:max-w-md">
                URL: {previewImage.url}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Abrir Original</span>
                </a>

                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR CONFIRMATION MODAL */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121926] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-black text-white">¿Limpiar Historial de Actividad?</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Esta acción vaciará todos los registros de auditoría guardados localmente. Puedes restaurar el historial predeterminado en cualquier momento con el botón de restauración.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearActivityLogs();
                  setShowClearConfirmModal(false);
                  showToast('Historial de actividad vaciado.');
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black transition shadow-lg shadow-rose-500/20"
              >
                Sí, Limpiar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
