import React, { useState, useMemo, useEffect } from 'react';
import { BarberProvider, useBarber } from './context/BarberContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { HeroBanner } from './components/home/HeroBanner';
import { ServicesRow } from './components/home/ServicesRow';
import { QuickBookingCard } from './components/home/QuickBookingCard';
import { ShopInfoCard } from './components/home/ShopInfoCard';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { GalleryPreview } from './components/home/GalleryPreview';
import { NextAppointmentBanner } from './components/home/NextAppointmentBanner';
import { BarbersRow } from './components/home/BarbersRow';
import { HomeProductsRow } from './components/home/HomeProductsRow';
import { Footer } from './components/layout/Footer';
import { BookingModal } from './components/modals/BookingModal';
import { BiometricModal } from './components/modals/BiometricModal';
import { PortfolioModal } from './components/modals/PortfolioModal';
import { VideoModal } from './components/modals/VideoModal';
import { SupportModal } from './components/support/SupportModal';
import { AuthModal } from './components/modals/AuthModal';
import { PushToastBanner } from './components/notifications/PushToastBanner';
import { MyAppointmentsView } from './components/appointments/MyAppointmentsView';
import { LoyaltyView } from './components/loyalty/LoyaltyView';
import { UserProfileView } from './components/profile/UserProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ClientProductsView } from './components/products/ClientProductsView';
import { BarberPortalView } from './components/barber/BarberPortalView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, openBookingModal, settings } = useBarber();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Security guard: If a barber tries to access admin, redirect to their barber portal
  if (currentUser.role === 'barber' && activeTab === 'admin') {
    setActiveTab('barber-portal');
  }

  // Sync SEO metadata and document title
  useEffect(() => {
    if (settings.shopName) {
      document.title = settings.seoTitle || `${settings.shopName} - ${settings.tagline || 'Cuidado Masculino'}`;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.seoDescription) {
      metaDesc.setAttribute('content', settings.seoDescription);
    }
  }, [settings.shopName, settings.tagline, settings.seoTitle, settings.seoDescription]);

  // Dynamic Primary Theme Color overrides
  const primaryColorStyles = useMemo(() => {
    const color = settings.themePrimaryColor || 'amber';
    if (color === 'amber') return '';

    const colorDefs: Record<string, { base: string; hover: string; text: string; bgSoft: string; border: string }> = {
      gold: {
        base: '#eab308',
        hover: '#ca8a04',
        text: '#fde047',
        bgSoft: 'rgba(234, 179, 8, 0.18)',
        border: 'rgba(234, 179, 8, 0.4)',
      },
      emerald: {
        base: '#10b981',
        hover: '#059669',
        text: '#34d399',
        bgSoft: 'rgba(16, 185, 129, 0.18)',
        border: 'rgba(16, 185, 129, 0.4)',
      },
      blue: {
        base: '#3b82f6',
        hover: '#2563eb',
        text: '#60a5fa',
        bgSoft: 'rgba(59, 130, 246, 0.18)',
        border: 'rgba(59, 130, 246, 0.4)',
      },
      rose: {
        base: '#f43f5e',
        hover: '#e11d48',
        text: '#fb7185',
        bgSoft: 'rgba(244, 63, 94, 0.18)',
        border: 'rgba(244, 63, 94, 0.4)',
      },
      bronze: {
        base: '#d97706',
        hover: '#b45309',
        text: '#f59e0b',
        bgSoft: 'rgba(217, 119, 6, 0.18)',
        border: 'rgba(217, 119, 6, 0.4)',
      },
    };

    const def = colorDefs[color];
    if (!def) return '';

    return `
      .text-amber-400, .text-amber-300, .text-amber-500 { color: ${def.text} !important; }
      .bg-amber-500, .bg-[#e5a93c], .bg-amber-400 { background-color: ${def.base} !important; }
      .hover\\:bg-amber-400:hover, .hover\\:bg-amber-500:hover, .hover\\:bg-\\[\\#f5b849\\]:hover { background-color: ${def.hover} !important; }
      .border-amber-500, .border-amber-400, .border-amber-500\\/40, .border-amber-500\\/30, .border-amber-600\\/30 { border-color: ${def.border} !important; }
      .bg-amber-500\\/20, .bg-amber-950\\/40, .bg-amber-950\\/60, .bg-amber-500\\/10 { background-color: ${def.bgSoft} !important; }
      .fill-amber-400 { fill: ${def.text} !important; }
    `;
  }, [settings.themePrimaryColor]);

  const bgClass =
    settings.themeBackgroundColor === 'black'
      ? 'bg-black'
      : settings.themeBackgroundColor === 'navy'
      ? 'bg-[#060a12]'
      : settings.themeBackgroundColor === 'slate'
      ? 'bg-[#121620]'
      : 'bg-[#090d14]';

  const fontClass =
    settings.themeFontFamily === 'serif'
      ? 'font-serif'
      : settings.themeFontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const fontSizeClass =
    settings.themeFontSize === 'sm'
      ? 'text-[13px]'
      : settings.themeFontSize === 'lg'
      ? 'text-[15px]'
      : '';

  const radiusClass =
    settings.themeBorderRadius === 'sm'
      ? 'rounded-md'
      : settings.themeBorderRadius === 'md'
      ? 'rounded-xl'
      : settings.themeBorderRadius === 'full'
      ? 'rounded-3xl'
      : 'rounded-2xl';

  const vis = settings.visibleSections || {
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

  // Dynamic Section Rendering based on sectionOrder
  const defaultOrder = ['hero', 'services', 'quickBooking', 'barbers', 'products', 'portfolio', 'reviews'];
  const orderedSections = settings.sectionOrder && settings.sectionOrder.length > 0 ? settings.sectionOrder : defaultOrder;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return vis.hero !== false ? <HeroBanner key="hero" /> : null;

      case 'services':
        return vis.services !== false ? <ServicesRow key="services" /> : null;

      case 'quickBooking':
        return vis.quickBooking !== false || vis.contact !== false ? (
          <div key="quickBooking" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {vis.quickBooking !== false && (
              <div className={vis.contact !== false ? 'lg:col-span-6 xl:col-span-7' : 'lg:col-span-12'}>
                <QuickBookingCard />
              </div>
            )}
            {vis.contact !== false && (
              <div className={vis.quickBooking !== false ? 'lg:col-span-6 xl:col-span-5' : 'lg:col-span-12'}>
                <ShopInfoCard />
              </div>
            )}
          </div>
        ) : null;

      case 'barbers':
        return vis.barbers !== false ? <BarbersRow key="barbers" /> : null;

      case 'products':
        return vis.products !== false ? <HomeProductsRow key="products" /> : null;

      case 'portfolio':
        return vis.portfolio !== false ? (
          <div key="portfolio" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8">
              <GalleryPreview />
            </div>
            <div className="lg:col-span-4">
              <NextAppointmentBanner />
            </div>
          </div>
        ) : null;

      case 'reviews':
        return vis.reviews !== false ? <WhyChooseUs key="reviews" /> : null;

      case 'contact':
        // Only render standalone if quickBooking was not rendered
        if (vis.quickBooking === false && vis.contact !== false) {
          return (
            <div key="contact" className="max-w-md mx-auto">
              <ShopInfoCard />
            </div>
          );
        }
        return null;

      case 'loyalty':
        // Standalone loyalty banner if portfolio was not rendered
        if (vis.portfolio === false && vis.loyalty !== false) {
          return (
            <div key="loyalty" className="max-w-md mx-auto">
              <NextAppointmentBanner />
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} ${fontClass} ${fontSizeClass} text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black`}>
      {/* Primary Color CSS Injections */}
      {primaryColorStyles && (
        <style dangerouslySetInnerHTML={{ __html: primaryColorStyles }} />
      )}

      {/* Admin Custom CSS */}
      {settings.customCss && (
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
      )}

      {/* Left Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Container - offset by sidebar on large screens */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
        {/* Top Header */}
        <TopHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Maintenance Banner if enabled and non-admin */}
        {settings.maintenanceMode && currentUser.role !== 'admin' && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-300 px-4 py-2 text-xs text-center font-bold">
            🚧 Modo de mantenimiento activo: Estamos realizando mejoras en nuestras instalaciones para tu comodidad.
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* TAB 1: INICIO (HOME) - Dynamic Sections Rendering */}
          {activeTab === 'home' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {orderedSections.map((sectionId) => renderSection(sectionId))}
            </div>
          )}

          {/* TAB 2: SERVICIOS */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <ServicesRow />
              <div className="mt-8">
                <WhyChooseUs />
              </div>
            </div>
          )}

          {/* TAB 3: RESERVAR CITA */}
          {activeTab === 'book' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              <QuickBookingCard />
            </div>
          )}

          {/* TAB 4: MIS CITAS */}
          {activeTab === 'appointments' && (
            <div className="animate-in fade-in duration-200">
              <MyAppointmentsView filterType="upcoming" />
            </div>
          )}

          {/* TAB 5: HISTORIAL */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-200">
              <MyAppointmentsView filterType="history" />
            </div>
          )}

          {/* TAB 6: MI PERFIL */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-200">
              <UserProfileView />
            </div>
          )}

          {/* TAB 7: PORTAFOLIO DE CORTES */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <GalleryPreview />
              <NextAppointmentBanner />
            </div>
          )}

          {/* TAB 8: CLUB VIP & LEALTAD */}
          {activeTab === 'loyalty' && (
            <div className="animate-in fade-in duration-200">
              <LoyaltyView />
            </div>
          )}

          {/* TAB 9: PRODUCTOS DE BARBERÍA (Público / Clientes) */}
          {activeTab === 'products' && (
            <div className="animate-in fade-in duration-200">
              <ClientProductsView />
            </div>
          )}

          {/* TAB 10: PORTAL DEL BARBERO */}
          {(activeTab === 'barber' || activeTab === 'barber-portal') && (
            <div className="animate-in fade-in duration-200">
              <BarberPortalView />
            </div>
          )}

          {/* TAB 11: PANEL ADMINISTRATIVO (Solo para Admin) */}
          {activeTab === 'admin' && currentUser.role === 'admin' && (
            <div className="animate-in fade-in duration-200">
              <AdminDashboard />
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Global Interactive Modals & Push Toast */}
      <PushToastBanner />
      <BookingModal />
      <BiometricModal />
      <PortfolioModal />
      <VideoModal />
      <SupportModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <BarberProvider>
      <MainLayout />
    </BarberProvider>
  );
}
