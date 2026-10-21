import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Flame, 
  BookOpen, 
  Calendar, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  ArrowLeft,
  X,
  ChefHat
} from 'lucide-react';
import { PortalTab } from '../../types';

interface PortalSidebarProps {
  activeTab: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeOrdersCount: number;
  kitchenTicketsCount: number;
  pendingBookingsCount: number;
  onLockPortal: () => void;
  onExitToWebsite: () => void;
}

interface NavItemConfig {
  id: PortalTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export function PortalSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  activeOrdersCount,
  kitchenTicketsCount,
  pendingBookingsCount,
  onLockPortal,
  onExitToWebsite
}: PortalSidebarProps) {
  const [hoveredTab, setHoveredTab] = useState<PortalTab | null>(null);

  const navItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badgeCount: activeOrdersCount },
    { id: 'kitchen', label: 'Kitchen Display', icon: Flame, badgeCount: kitchenTicketsCount },
    { id: 'dishes', label: 'Dishes & Menu', icon: BookOpen },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badgeCount: pendingBookingsCount },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: PortalTab) => {
    onSelectTab(tab);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#142318] text-[#E8ECE9] select-none border-r border-[#223829]">
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-[#223829] px-4 shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-md bg-[#24422E] border border-[#376145] flex items-center justify-center text-white shrink-0 shadow-xs">
              <ChefHat className="w-5 h-5 text-[#C4D9BC]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#93AF8B] truncate">
                Gulshan 2 · Dhaka
              </div>
              <h1 className="font-serif-display text-sm font-bold tracking-wide text-white truncate">
                THE GROVE BISTRO
              </h1>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-md bg-[#24422E] border border-[#376145] flex items-center justify-center text-white shadow-xs" title="The Grove Bistro Operations">
            <ChefHat className="w-5 h-5 text-[#C4D9BC]" />
          </div>
        )}

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-stone-400 hover:text-white hover:bg-[#223829] rounded-md transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-none" aria-label="Portal Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const hasBadge = typeof item.badgeCount === 'number' && item.badgeCount > 0;

          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center rounded-md transition-all duration-150 cursor-pointer text-left font-medium text-xs ${
                  isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5 gap-3'
                } ${
                  isActive
                    ? 'bg-[#25462F] text-white shadow-xs font-semibold'
                    : 'text-[#B8C7BA] hover:text-white hover:bg-[#1D3323]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#8FE0A5]' : 'text-[#8E9F90] group-hover:text-white'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 tracking-wide">{item.label}</span>
                )}

                {/* Badge count in expanded mode */}
                {!isCollapsed && hasBadge && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6A23C] text-stone-950 shadow-xs">
                    {item.badgeCount}
                  </span>
                )}

                {/* Micro indicator dot in collapsed mode */}
                {isCollapsed && hasBadge && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E6A23C] ring-2 ring-[#142318]" />
                )}
              </button>

              {/* Floating Tooltip for Collapsed Mode */}
              {isCollapsed && hoveredTab === item.id && (
                <div className="hidden md:flex absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 items-center gap-2 bg-[#0E1A11] text-white border border-[#2B4B34] px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shadow-xl animate-fadeIn">
                  <span>{item.label}</span>
                  {hasBadge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#E6A23C] text-stone-950">
                      {item.badgeCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-[#223829] space-y-1.5 shrink-0 bg-[#101D14]">
        {/* Collapse / Expand Toggle on Desktop */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`hidden md:flex w-full items-center rounded-md text-xs font-medium text-[#A6B8A8] hover:text-white hover:bg-[#1A2E20] py-2 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : 'px-3 gap-2.5'
          }`}
          title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#A6B8A8]" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-[#A6B8A8]" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>

        {/* Lock Portal */}
        <button
          type="button"
          onClick={onLockPortal}
          className={`w-full flex items-center rounded-md text-xs font-medium text-[#B8C7BA] hover:text-white hover:bg-[#1A2E20] py-2 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : 'px-3 gap-2.5'
          }`}
          title="Lock Portal (PIN required to unlock)"
        >
          <Lock className="w-4 h-4 text-amber-400/90" />
          {!isCollapsed && <span>Lock Portal</span>}
        </button>

        {/* Exit to Public Website */}
        <button
          type="button"
          onClick={onExitToWebsite}
          className={`w-full flex items-center rounded-md text-xs font-medium text-[#B8C7BA] hover:text-white hover:bg-[#1A2E20] py-2 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : 'px-3 gap-2.5'
          }`}
          title="Return to Public Website"
        >
          <ArrowLeft className="w-4 h-4 text-stone-400" />
          {!isCollapsed && <span>Exit to Website</span>}
        </button>

        {/* Manager User Identity Card */}
        {!isCollapsed ? (
          <div className="pt-2 mt-1 border-t border-[#1C3222] flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-[#274830] text-[#A8E2BC] flex items-center justify-center text-[11px] font-bold border border-[#3C6949]">
              AF
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">Afif Rahman</div>
              <div className="text-[10px] text-[#869E89] truncate">Executive Manager</div>
            </div>
          </div>
        ) : (
          <div className="pt-1 flex justify-center">
            <div 
              className="w-7 h-7 rounded-full bg-[#274830] text-[#A8E2BC] flex items-center justify-center text-[10px] font-bold border border-[#3C6949]"
              title="Afif Rahman · Executive Manager"
            >
              AF
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[76px]' : 'w-[250px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex"
          onClick={onCloseMobile}
        >
          <div 
            className="w-[270px] max-w-[85vw] h-full shadow-2xl animate-slideRight"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
