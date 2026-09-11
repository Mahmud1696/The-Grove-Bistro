import { MapPin, Phone, Clock, ArrowUp, ShieldCheck, ChefHat, ArrowUpRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenStaffPortal: () => void;
}

export function Footer({ onNavigate, onOpenPrivacy, onOpenTerms, onOpenStaffPortal }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#141A15] text-[#FAF8F5] pt-16 pb-24 md:pb-16 border-t border-[#252E26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#242C25]">
          {/* Column 1: Brand */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#A3B899] font-medium block">
              Dhaka • Gulshan Circle 2
            </span>
            <h3 className="font-serif-display text-2xl tracking-wide font-normal">
              THE GROVE BISTRO
            </h3>
            <p className="font-sans-ui text-sm text-[#A8B2AA] font-light leading-relaxed max-w-sm">
              A contemporary culinary sanctuary perched on Level 12 of Hamid Tower. Thoughtfully prepared slow-cooked meats, artisanal pasta, and unhurried hospitality.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3B899]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8D1CA] font-light">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reservations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('order')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Order Online
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Visit */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3B899]">
              Visit
            </h4>
            <div className="space-y-3 text-sm text-[#C8D1CA] font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A3B899] shrink-0 mt-0.5" />
                <span>
                  {RESTAURANT_INFO.address.line1}, {RESTAURANT_INFO.address.line2}, Dhaka 1212
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#A3B899] shrink-0 mt-0.5" />
                <span>Daily 12:00 PM – 10:30 PM (Weekend Brunch 11 AM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A3B899] shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-white transition-colors">
                  {RESTAURANT_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Follow */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A3B899]">
              Follow
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C8D1CA] font-light">
              <li>
                <a
                  href={RESTAURANT_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram (@thegrovebistro.dhaka)
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT_INFO.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>

            {/* Intentional Executive & Kitchen Portal Entry */}
            <div className="pt-3">
              <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#828F84] mb-2">
                Executive & Kitchen
              </div>
              <button
                id="footer-staff-portal-btn"
                onClick={onOpenStaffPortal}
                className="group w-full p-3 rounded-sm bg-[#1A231C] hover:bg-[#233126] border border-[#2D3F30] hover:border-[#425C47] transition-all duration-200 text-left cursor-pointer shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xs bg-[#2D4532] flex items-center justify-center text-[#A3B899] group-hover:text-white transition-colors shrink-0">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#A3B899] transition-colors flex items-center gap-1.5">
                      <span>Manager / Kitchen Portal</span>
                    </div>
                    <div className="text-[10px] text-[#828F84] mt-0.5">
                      Orders • Dishes • BDT Analytics
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#828F84] group-hover:text-[#A3B899] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A958C] font-light gap-4">
          <p>© 2026 The Grove Bistro. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
