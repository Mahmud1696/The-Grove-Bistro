import { useState, useEffect } from 'react';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReservationProvider } from './context/ReservationContext';

import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { GalleryLightbox } from './components/GalleryLightbox';
import { StaffPortalModal } from './components/StaffPortalModal';
import { LegalModal } from './components/LegalModal';
import { OrderTrackerModal } from './views/OrderTrackerModal';

import { HomeView } from './views/HomeView';
import { MenuView } from './views/MenuView';
import { AboutView } from './views/AboutView';
import { GalleryView } from './views/GalleryView';
import { ReservationsView } from './views/ReservationsView';
import { CheckoutView } from './views/CheckoutView';
import { ContactView } from './views/ContactView';

import { GALLERY_ITEMS } from './data/restaurantData';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [staffPortalOpen, setStaffPortalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [trackerOrderId, setTrackerOrderId] = useState<string | null>(null);

  // Sync hash routing on popstate / initial load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'menu', 'about', 'gallery', 'reservations', 'order', 'checkout', 'contact'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevImage = () => {
    setLightboxIndex(prev => (prev === 0 ? GALLERY_ITEMS.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setLightboxIndex(prev => (prev === GALLERY_ITEMS.length - 1 ? 0 : prev + 1));
  };

  const handleOpenOrderTracker = (orderId: string) => {
    setTrackerOrderId(orderId);
  };

  return (
    <MenuProvider>
      <CartProvider>
        <OrderProvider>
          <ReservationProvider>
            <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1E1B] selection:bg-[#2D4532] selection:text-white">
            {/* Main Sticky Header */}
            <Header currentView={currentView} onNavigate={navigateTo} />

            {/* View Switching */}
            <main className="flex-1">
              {currentView === 'home' && (
                <HomeView onNavigate={navigateTo} onOpenLightbox={handleOpenLightbox} />
              )}
              {currentView === 'menu' && <MenuView onNavigate={navigateTo} />}
              {currentView === 'about' && <AboutView onNavigate={navigateTo} />}
              {currentView === 'gallery' && (
                <GalleryView onOpenLightbox={handleOpenLightbox} onNavigate={navigateTo} />
              )}
              {currentView === 'reservations' && <ReservationsView onNavigate={navigateTo} />}
              {(currentView === 'order' || currentView === 'checkout') && (
                <CheckoutView
                  onNavigate={navigateTo}
                  onOpenOrderTracker={handleOpenOrderTracker}
                />
              )}
              {currentView === 'contact' && <ContactView />}
            </main>

            {/* Footer */}
            <Footer
              onNavigate={navigateTo}
              onOpenPrivacy={() => setLegalModalType('privacy')}
              onOpenTerms={() => setLegalModalType('terms')}
              onOpenStaffPortal={() => setStaffPortalOpen(true)}
            />

            {/* Fixed Mobile Bottom Action Bar */}
            <MobileBottomNav currentView={currentView} onNavigate={navigateTo} />

            {/* Slide-out Cart Drawer */}
            <CartDrawer
              onProceedToCheckout={() => navigateTo('checkout')}
              onExploreMenu={() => navigateTo('menu')}
            />

            {/* Lightbox Modal */}
            <GalleryLightbox
              items={GALLERY_ITEMS}
              currentIndex={lightboxIndex}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
            />

            {/* Staff / Kitchen Management Console */}
            <StaffPortalModal
              isOpen={staffPortalOpen}
              onClose={() => setStaffPortalOpen(false)}
            />

            {/* Privacy / Terms Modal */}
            <LegalModal
              type={legalModalType}
              onClose={() => setLegalModalType(null)}
            />

            {/* Live Order Tracker Modal */}
            <OrderTrackerModal
              orderId={trackerOrderId}
              isOpen={Boolean(trackerOrderId)}
              onClose={() => setTrackerOrderId(null)}
            />
          </div>
        </ReservationProvider>
      </OrderProvider>
    </CartProvider>
  </MenuProvider>
);
}
