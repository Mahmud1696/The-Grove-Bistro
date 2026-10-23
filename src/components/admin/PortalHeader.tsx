import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  Calendar, 
  UtensilsCrossed, 
  X,
  ExternalLink
} from 'lucide-react';
import { PortalTab, Order, Reservation } from '../../types';

interface PortalHeaderProps {
  activeTab: PortalTab;
  isCollapsed: boolean;
  onOpenMobileSidebar: () => void;
  onLockPortal: () => void;
  onExitToWebsite: () => void;
  contextualAction?: React.ReactNode;
  orders: Order[];
  reservations: Reservation[];
  onNavigateTab: (tab: PortalTab) => void;
}

export function PortalHeader({
  activeTab,
  isCollapsed,
  onOpenMobileSidebar,
  onLockPortal,
  onExitToWebsite,
  contextualAction,
  orders,
  reservations,
  onNavigateTab
}: PortalHeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitleAndBreadcrumb = (tab: PortalTab) => {
    switch (tab) {
      case 'overview':
        return { title: 'Executive Overview', breadcrumb: 'Dashboard' };
      case 'orders':
        return { title: 'Order Management', breadcrumb: 'Operations / Orders' };
      case 'kitchen':
        return { title: 'Kitchen Display System (KDS)', breadcrumb: 'Live Dispatch' };
      case 'dishes':
        return { title: 'Dishes & Menu Engineering', breadcrumb: 'Catalog / Menu' };
      case 'categories':
        return { title: 'Categories & Homepage Showcase', breadcrumb: 'Catalog / Categories' };
      case 'bookings':
        return { title: 'Table Reservations & Seating', breadcrumb: 'Front of House' };
      case 'customers':
        return { title: 'Customer Directory', breadcrumb: 'Guest Records' };
      case 'analytics':
        return { title: 'Financial & Operational Analytics', breadcrumb: 'Intelligence' };
      case 'reports':
        return { title: 'Executive Reports & Reconciliation', breadcrumb: 'Reporting' };
      case 'settings':
        return { title: 'Restaurant & System Settings', breadcrumb: 'Administration' };
    }
  };

  const { title, breadcrumb } = getPageTitleAndBreadcrumb(activeTab);

  // Assemble dynamic notifications from real data
  const dynamicNotifications = [
    ...orders.slice(0, 4).map(o => ({
      id: `order-${o.orderId}`,
      title: `Order #${o.orderId} · ৳${o.total.toLocaleString()}`,
      detail: `${o.customerName} (${o.orderType}) - Status: ${o.orderStatus}`,
      time: 'Recent',
      type: 'order' as const,
      tab: 'orders' as PortalTab
    })),
    ...reservations.filter(r => r.status === 'Pending').slice(0, 2).map(r => ({
      id: `res-${r.id}`,
      title: `Pending Booking: ${r.name}`,
      detail: `${r.guests} guests · ${r.date} at ${r.time}`,
      time: 'Awaiting Confirmation',
      type: 'booking' as const,
      tab: 'bookings' as PortalTab
    }))
  ];

  const unreadCount = dynamicNotifications.filter(n => !readNotifications.has(n.id)).length;

  const markAllRead = () => {
    setReadNotifications(new Set(dynamicNotifications.map(n => n.id)));
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-stone-200/90 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle, Breadcrumb & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600 truncate">
            <span>The Grove Bistro</span>
            <span aria-hidden="true" className="text-stone-400">/</span>
            <span className="text-stone-700">{breadcrumb}</span>
          </div>
          <h2 className="font-serif-display text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-tight truncate">
            {title}
          </h2>
        </div>
      </div>

      {/* Center: Restaurant Operational Status (Visible without dominating) */}
      <div className="hidden xl:flex items-center gap-2 text-xs text-stone-600 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
        <span>Kitchen Active</span>
        <span aria-hidden="true" className="text-stone-300">·</span>
        <span>Accepting Orders</span>
        <span aria-hidden="true" className="text-stone-300">·</span>
        <span>Gulshan 2, Dhaka</span>
      </div>

      {/* Right: Contextual Action + Notification Center + Profile Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Page-Specific Contextual Action Button (e.g. Add Dish, New Booking) */}
        {contextualAction && (
          <div className="shrink-0">
            {contextualAction}
          </div>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-md shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Live Operational Activity
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {unreadCount} new alerts
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-emerald-800 hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                {dynamicNotifications.length > 0 ? (
                  dynamicNotifications.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onNavigateTab(item.tab);
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-stone-50 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-stone-900 leading-snug">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-stone-600 font-medium shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-700 mt-0.5 line-clamp-1 font-medium">
                        {item.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-stone-400">
                    No active notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Manager Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-md hover:bg-stone-100 transition-colors cursor-pointer border border-transparent hover:border-stone-200"
          >
            <div className="w-7 h-7 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              AF
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-stone-900 leading-tight">Afif Rahman</div>
              <div className="text-[10px] text-stone-500">Executive Manager</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-md shadow-xl py-1 z-50 animate-fadeIn text-xs">
              <div className="px-4 py-3 border-b border-stone-100">
                <div className="font-semibold text-stone-900">Afif Rahman</div>
                <div className="text-stone-500 text-[11px]">Executive Operations & Kitchen</div>
                <div className="mt-1 text-[10px] font-medium text-emerald-800">PIN Authorized: #12345</div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full text-left px-4 py-2 text-stone-700 hover:bg-stone-50 hover:text-stone-950 flex items-center justify-between cursor-pointer"
                >
                  <span>Portal Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLockPortal();
                  }}
                  className="w-full text-left px-4 py-2 text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Portal</span>
                </button>
              </div>

              <div className="border-t border-stone-100 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onExitToWebsite();
                  }}
                  className="w-full text-left px-4 py-2 text-stone-600 hover:bg-stone-50 hover:text-stone-900 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Website</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
