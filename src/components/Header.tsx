import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone, MapPin, Calendar, UtensilsCrossed, Lock, ChefHat, ArrowRight, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenStaffPortal?: () => void;
}

export function Header({ currentView, onNavigate, onOpenStaffPortal }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Menu', view: 'menu' },
    { label: 'About', view: 'about' },
    { label: 'Gallery', view: 'gallery' },
    { label: 'Reservations', view: 'reservations' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderOnlineClick = () => {
    if (itemCount > 0) {
      onNavigate('checkout');
    } else {
      onNavigate('menu');
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHeroTransparent = currentView === 'home' && !isScrolled && !mobileMenuOpen;

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isHeroTransparent
            ? 'bg-gradient-to-b from-black/70 via-black/40 to-transparent text-white'
            : 'bg-[#FAF8F5]/95 backdrop-blur-md text-[#1E221E] shadow-xs border-b border-[#EBE5DF]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5 sm:gap-3 py-1"
            >
              <img
                src="/favicon.svg"
                alt="The Grove Bistro Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xs object-cover border border-[#D8B573]/40 shadow-xs group-hover:border-[#D8B573] transition-colors shrink-0"
              />
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-xs uppercase tracking-[0.22em] font-medium opacity-80 group-hover:opacity-100 transition-opacity truncate">
                  Dhaka • Gulshan 2
                </span>
                <span className="font-serif-display text-lg sm:text-xl lg:text-2xl tracking-wide font-semibold block truncate">
                  THE GROVE BISTRO
                </span>
              </div>
            </button>

            {/* Desktop & Tablet Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-7 text-xs lg:text-sm font-medium">
              {navItems.map(item => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`nav-${item.view}-btn`}
                    onClick={() => handleNavClick(item.view)}
                    className={`relative py-2 tracking-wider uppercase text-[11px] lg:text-xs transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? isHeroTransparent
                          ? 'text-white font-semibold'
                          : 'text-[#2D4532] font-semibold'
                        : isHeroTransparent
                        ? 'text-white/80 hover:text-white'
                        : 'text-[#5A635B] hover:text-[#1E221E]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] transition-all ${
                          isHeroTransparent ? 'bg-white' : 'bg-[#2D4532]'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Area */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Cart Trigger */}
              <button
                id="header-cart-btn"
                onClick={openCart}
                aria-label={`View shopping cart with ${itemCount} items`}
                className={`relative min-w-[44px] min-h-[44px] p-2.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isHeroTransparent
                    ? 'hover:bg-white/15 text-white'
                    : 'hover:bg-[#EFEAE2] text-[#1E221E]'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute top-1.5 right-1.5 bg-[#2D4532] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white"
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Order Online CTA (Desktop / Tablet) */}
              <button
                id="header-order-online-btn"
                onClick={handleOrderOnlineClick}
                className={`hidden sm:inline-flex items-center justify-center px-4 lg:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all duration-200 cursor-pointer min-h-[40px] ${
                  isHeroTransparent
                    ? 'bg-white text-[#1E221E] hover:bg-[#F3EFE9] shadow-sm'
                    : 'bg-[#2D4532] text-white hover:bg-[#233727] shadow-sm'
                }`}
              >
                Order Online
              </button>

              {/* Discreet Manager Portal Trigger */}
              {onOpenStaffPortal && (
                <button
                  id="header-staff-portal-btn"
                  onClick={onOpenStaffPortal}
                  title="Manager & Kitchen Portal (PIN: 12345)"
                  aria-label="Manager & Kitchen Portal"
                  className={`hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center p-2.5 rounded-full transition-colors cursor-pointer ${
                    isHeroTransparent
                      ? 'hover:bg-white/15 text-white/80 hover:text-white'
                      : 'hover:bg-[#EFEAE2] text-[#4A534B] hover:text-[#1E221E]'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-panel"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className={`md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xs cursor-pointer transition-colors ${
                  isHeroTransparent ? 'hover:bg-white/15 text-white' : 'hover:bg-[#EFEAE2] text-[#1E221E]'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-20 bg-black/60 backdrop-blur-xs md:hidden z-40 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed top-20 left-0 right-0 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-[#FAF8F5] text-[#1E221E] border-b border-[#E3DDD5] shadow-2xl md:hidden z-50 px-5 sm:px-6 py-6 animate-fadeIn"
        >
          <div className="flex flex-col space-y-2">
            {/* Nav Links with Large Touch Targets */}
            {navItems.map(item => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  id={`mobile-nav-${item.view}`}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full text-left min-h-[48px] px-3 py-2.5 rounded-xs text-base font-serif-display font-medium tracking-wide flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#2D4532]/10 text-[#2D4532] font-bold border-l-3 border-[#2D4532]'
                      : 'text-[#1E221E] hover:bg-[#EFEAE2] hover:text-[#2D4532]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#2D4532] font-semibold bg-[#2D4532]/15 px-2 py-0.5 rounded-xs">
                      Active
                    </span>
                  )}
                </button>
              );
            })}

            {/* Primary Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                id="mobile-order-cta-btn"
                onClick={handleOrderOnlineClick}
                className="w-full min-h-[48px] py-3.5 px-4 bg-[#2D4532] text-white text-center font-semibold text-xs tracking-widest uppercase rounded-xs shadow-sm hover:bg-[#233727] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Order Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="mobile-reserve-cta-btn"
                onClick={() => handleNavClick('reservations')}
                className="w-full min-h-[48px] py-3.5 px-4 bg-transparent border border-[#2D4532] text-[#2D4532] text-center font-semibold text-xs tracking-widest uppercase rounded-xs hover:bg-[#2D4532]/5 transition-colors cursor-pointer"
              >
                Reserve a Table
              </button>

              {onOpenStaffPortal && (
                <button
                  type="button"
                  id="mobile-staff-portal-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStaffPortal();
                  }}
                  className="w-full min-h-[44px] py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xs flex items-center justify-center gap-2 cursor-pointer border border-stone-200 transition-colors"
                >
                  <ChefHat className="w-4 h-4 text-[#2D4532]" />
                  <span>Manager & Kitchen Portal (PIN: 12345)</span>
                </button>
              )}
            </div>

            {/* Quick Contact & Directions Bar */}
            <div className="pt-5 mt-2 border-t border-[#EAE4DC] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#555E57]">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="flex items-center gap-2.5 p-2 rounded-xs bg-[#F4EFE8] hover:bg-[#EBE5DC] text-[#1E221E] font-medium transition-colors"
              >
                <Phone className="w-4 h-4 text-[#2D4532] shrink-0" />
                <span className="truncate">{RESTAURANT_INFO.phone}</span>
              </a>

              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xs bg-[#F4EFE8] hover:bg-[#EBE5DC] text-[#1E221E] font-medium transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#2D4532] shrink-0" />
                <span className="truncate">Hamid Tower, Level 12</span>
                <ExternalLink className="w-3 h-3 text-stone-400 ml-auto shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

