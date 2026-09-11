import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone, MapPin, Calendar, UtensilsCrossed } from 'lucide-react';
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
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isHeroTransparent = currentView === 'home' && !isScrolled;

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isHeroTransparent
          ? 'bg-gradient-to-b from-black/60 via-black/30 to-transparent text-white'
          : 'bg-[#FAF8F5]/95 backdrop-blur-md text-[#1E221E] shadow-xs border-b border-[#EBE5DF]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-3"
          >
            <img
              src="/favicon.svg"
              alt="The Grove Bistro Logo"
              className="w-10 h-10 rounded-xs object-cover border border-[#D8B573]/40 shadow-xs group-hover:border-[#D8B573] transition-colors shrink-0"
            />
            <div>
              <span className="block text-xs uppercase tracking-[0.25em] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                Dhaka • Gulshan 2
              </span>
              <span className="font-serif-display text-xl sm:text-2xl tracking-wide font-semibold">
                THE GROVE BISTRO
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
            {navItems.map(item => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  id={`nav-${item.view}-btn`}
                  onClick={() => handleNavClick(item.view)}
                  className={`relative py-1 tracking-wider uppercase text-xs transition-colors duration-200 cursor-pointer ${
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
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Cart Trigger */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              aria-label={`View shopping cart with ${itemCount} items`}
              className={`relative p-2.5 rounded-full transition-colors cursor-pointer ${
                isHeroTransparent
                  ? 'hover:bg-white/15 text-white'
                  : 'hover:bg-[#EFEAE2] text-[#1E221E]'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-[#2D4532] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-scale-in"
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Desktop Order Online CTA */}
            <button
              id="header-order-online-btn"
              onClick={handleOrderOnlineClick}
              className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer ${
                isHeroTransparent
                  ? 'bg-white text-[#1E221E] hover:bg-[#F3EFE9] shadow-sm'
                  : 'bg-[#2D4532] text-white hover:bg-[#233727] shadow-sm'
              }`}
            >
              Order Online
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className={`md:hidden p-2 rounded-md cursor-pointer transition-colors ${
                isHeroTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-[#EFEAE2] text-[#1E221E]'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-Down */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden bg-[#FAF8F5] text-[#1E221E] border-b border-[#E3DDD5] shadow-lg animate-fadeIn px-6 py-6"
        >
          <div className="flex flex-col space-y-4">
            {navItems.map(item => (
              <button
                key={item.view}
                id={`mobile-nav-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`text-left py-2 text-base font-serif-display font-medium tracking-wide flex items-center justify-between border-b border-[#F0EBE3] ${
                  currentView === item.view ? 'text-[#2D4532] font-bold' : 'text-[#2C302D]'
                }`}
              >
                <span>{item.label}</span>
                {currentView === item.view && (
                  <span className="text-xs uppercase font-sans tracking-widest text-[#2D4532]">
                    • active
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 space-y-3">
              <button
                id="mobile-order-cta-btn"
                onClick={handleOrderOnlineClick}
                className="w-full py-3.5 bg-[#2D4532] text-white text-center font-medium text-xs tracking-widest uppercase rounded-sm shadow-sm"
              >
                Order Online
              </button>

              <button
                id="mobile-reserve-cta-btn"
                onClick={() => handleNavClick('reservations')}
                className="w-full py-3 bg-transparent border border-[#2D4532] text-[#2D4532] text-center font-medium text-xs tracking-widest uppercase rounded-sm"
              >
                Reserve a Table
              </button>
            </div>

            <div className="pt-4 text-xs text-[#6F7770] space-y-2 border-t border-[#EAE4DC]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2D4532]" />
                <span>Level 12, Hamid Tower, Gulshan-2, Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#2D4532]" />
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:underline">
                  {RESTAURANT_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
