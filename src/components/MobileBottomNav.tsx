import { Home, Utensils, ShoppingBag, Calendar, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function MobileBottomNav({ currentView, onNavigate }: MobileBottomNavProps) {
  const { itemCount } = useCart();

  const handleNav = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderNav = () => {
    if (itemCount > 0) {
      onNavigate('checkout');
    } else {
      onNavigate('menu');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile primary navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E6DFD5] px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-around">
        <button
          id="mob-nav-home"
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[#2D4532]' : 'text-[#6F7770] hover:text-[#1E221E]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">Home</span>
        </button>

        <button
          id="mob-nav-menu"
          onClick={() => handleNav('menu')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors cursor-pointer ${
            currentView === 'menu' ? 'text-[#2D4532]' : 'text-[#6F7770] hover:text-[#1E221E]'
          }`}
        >
          <Utensils className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">Menu</span>
        </button>

        {/* ORDER - visually emphasized */}
        <button
          id="mob-nav-order"
          onClick={handleOrderNav}
          className="flex flex-col items-center -mt-4 cursor-pointer focus:outline-none"
        >
          <div className="relative w-12 h-12 rounded-full bg-[#2D4532] text-white flex items-center justify-center shadow-md hover:bg-[#233727] transition-transform active:scale-95">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#2D4532] mt-0.5">
            Order
          </span>
        </button>

        <button
          id="mob-nav-reserve"
          onClick={() => handleNav('reservations')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors cursor-pointer ${
            currentView === 'reservations' ? 'text-[#2D4532]' : 'text-[#6F7770] hover:text-[#1E221E]'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">Reserve</span>
        </button>

        <button
          id="mob-nav-more"
          onClick={() => handleNav('contact')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors cursor-pointer ${
            currentView === 'contact' || currentView === 'about' || currentView === 'gallery'
              ? 'text-[#2D4532]'
              : 'text-[#6F7770] hover:text-[#1E221E]'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">Contact</span>
        </button>
      </div>
    </nav>
  );
}
