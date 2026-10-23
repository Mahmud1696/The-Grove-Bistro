import { BookOpen, ShoppingBag, Calendar, Compass } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface QuickActionBarProps {
  onNavigate: (view: string) => void;
}

export function QuickActionBar({ onNavigate }: QuickActionBarProps) {
  const actions = [
    {
      id: 'quick-action-menu',
      label: 'View Menu',
      sub: 'Browse culinary creations',
      icon: BookOpen,
      action: () => onNavigate('menu'),
    },
    {
      id: 'quick-action-order',
      label: 'Order Online',
      sub: 'Delivery & takeaway in Dhaka',
      icon: ShoppingBag,
      action: () => onNavigate('order'),
    },
    {
      id: 'quick-action-reserve',
      label: 'Reserve a Table',
      sub: 'Level 12 seating',
      icon: Calendar,
      action: () => onNavigate('reservations'),
    },
  ];

  return (
    <section
      id="quick-action-bar"
      className="relative z-20 -mt-8 sm:-mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-[#FAF8F5] border border-[#E3DDD4] rounded-sm shadow-md overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E8E2D9]">
          {actions.map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                id={act.id}
                onClick={act.action}
                className="group flex flex-col items-center sm:items-start text-center sm:text-left p-4 sm:p-6 hover:bg-[#F3EFE9] transition-colors duration-200 cursor-pointer focus:outline-none min-h-[96px] justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#EFEAE2] group-hover:bg-[#2D4532] text-[#2D4532] group-hover:text-white flex items-center justify-center transition-colors mb-2.5 sm:mb-3 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display text-sm sm:text-base font-semibold text-[#1E221E] group-hover:text-[#2D4532] transition-colors leading-tight">
                  {act.label}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#6B726C] mt-1 line-clamp-1">
                  {act.sub}
                </p>
              </button>
            );
          })}

          {/* 4th Action: Get Directions as accessible link */}
          <a
            id="quick-action-directions"
            href={RESTAURANT_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center sm:items-start text-center sm:text-left p-4 sm:p-6 hover:bg-[#F3EFE9] transition-colors duration-200 cursor-pointer focus:outline-none min-h-[96px] justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-[#EFEAE2] group-hover:bg-[#2D4532] text-[#2D4532] group-hover:text-white flex items-center justify-center transition-colors mb-2.5 sm:mb-3 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-serif-display text-sm sm:text-base font-semibold text-[#1E221E] group-hover:text-[#2D4532] transition-colors leading-tight">
              Get Directions
            </h3>
            <p className="text-[11px] sm:text-xs text-[#6B726C] mt-1 line-clamp-1">
              Hamid Tower, Gulshan-2
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
