import React, { useState, useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  TrendingUp, 
  Calendar, 
  ChefHat, 
  Bell, 
  Plus, 
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { useReservation } from '../context/ReservationContext';
import { OrderStatus, MenuItem } from '../types';

import { AdminDashboardTab } from './admin/AdminDashboardTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminDishesTab } from './admin/AdminDishesTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { AdminReservationsTab } from './admin/AdminReservationsTab';
import { AddDishModal } from './admin/AddDishModal';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'dashboard' | 'orders' | 'dishes' | 'analytics' | 'reservations';

export function StaffPortalModal({ isOpen, onClose }: StaffPortalModalProps) {
  const { orders, updateOrderStatus } = useOrder();
  const { menuItems, addMenuItem, toggleDishAvailability, deleteMenuItem, resetMenuToDefault } = useMenu();
  const { reservations, cancelReservation } = useReservation();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live Dhaka digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleAddDish = (dishData: Omit<MenuItem, 'id'>) => {
    const created = addMenuItem(dishData);
    triggerNotification(`Dish "${created.name}" published! It is now live on the customer website.`);
  };

  const activeOrdersCount = orders.filter(
    o => ['Pending', 'Confirmed', 'Preparing'].includes(o.orderStatus)
  ).length;

  return (
    <div
      id="staff-portal-fullscreen"
      className="fixed inset-0 z-50 bg-[#101511] text-[#FAF8F5] flex flex-col overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label="The Grove Bistro Executive Management Portal"
    >
      {/* Top Navigation Bar */}
      <header className="bg-[#141A15] border-b border-[#243327] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#2D4532] flex items-center justify-center text-[#A3B899] shadow-inner">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-display text-base sm:text-lg font-bold tracking-tight text-white">
                THE GROVE BISTRO
              </h2>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2D4532] text-[#A3B899] font-semibold border border-[#3E5C44]">
                Executive Console
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#828F84]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#C8D1CA]">Hamid Tower, Gulshan 2</span>
              </span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:flex items-center gap-1 text-[#A3B899]">
                <Clock className="w-3 h-3" />
                <span>Dhaka Time: {currentTime || 'Live'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#101511] p-1 rounded-sm border border-[#243327]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#2D4532] text-white shadow-xs'
                : 'text-[#828F84] hover:text-white hover:bg-[#18211A]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#2D4532] text-white shadow-xs'
                : 'text-[#828F84] hover:text-white hover:bg-[#18211A]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dishes'
                ? 'bg-[#2D4532] text-white shadow-xs'
                : 'text-[#828F84] hover:text-white hover:bg-[#18211A]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dishes</span>
            <span className="text-[10px] text-[#828F84]">({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-[#2D4532] text-white shadow-xs'
                : 'text-[#828F84] hover:text-white hover:bg-[#18211A]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-[#2D4532] text-white shadow-xs'
                : 'text-[#828F84] hover:text-white hover:bg-[#18211A]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings</span>
            <span className="text-[10px] text-[#828F84]">({reservations.length})</span>
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddDishModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2D4532] hover:bg-[#39573f] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#18211A] hover:bg-[#243327] border border-[#2D3F30] text-[#C8D1CA] hover:text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Website</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-[#141A15] border-b border-[#243327] px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-xs text-xs font-medium uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-[#2D4532] text-white' : 'text-[#828F84]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-xs text-xs font-medium uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-[#2D4532] text-white' : 'text-[#828F84]'
          }`}
        >
          <span>Orders</span>
          {activeOrdersCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
              {activeOrdersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`px-3 py-1.5 rounded-xs text-xs font-medium uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'dishes' ? 'bg-[#2D4532] text-white' : 'text-[#828F84]'
          }`}
        >
          Dishes ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-xs text-xs font-medium uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'analytics' ? 'bg-[#2D4532] text-white' : 'text-[#828F84]'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-3 py-1.5 rounded-xs text-xs font-medium uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'reservations' ? 'bg-[#2D4532] text-white' : 'text-[#828F84]'
          }`}
        >
          Bookings ({reservations.length})
        </button>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="bg-[#2D4532] text-white text-xs px-6 py-2.5 flex items-center gap-2 border-b border-[#3E5C44] animate-fadeIn shrink-0">
          <Bell className="w-4 h-4 text-amber-300" />
          <span className="font-medium">{notificationMsg}</span>
        </div>
      )}

      {/* Scrollable Main Content View */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <AdminDashboardTab
            orders={orders}
            menuItems={menuItems}
            onNavigateTab={setActiveTab}
            onOpenAddDish={() => setIsAddDishModalOpen(true)}
            onUpdateOrderStatus={updateOrderStatus}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            onUpdateOrderStatus={updateOrderStatus}
            onNotification={triggerNotification}
          />
        )}

        {activeTab === 'dishes' && (
          <AdminDishesTab
            menuItems={menuItems}
            onOpenAddDish={() => setIsAddDishModalOpen(true)}
            onToggleAvailability={toggleDishAvailability}
            onDeleteDish={deleteMenuItem}
            onResetDefaultMenu={resetMenuToDefault}
            onNotification={triggerNotification}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsTab
            orders={orders}
            menuItems={menuItems}
          />
        )}

        {activeTab === 'reservations' && (
          <AdminReservationsTab
            reservations={reservations}
            onCancelReservation={cancelReservation}
            onNotification={triggerNotification}
          />
        )}
      </main>

      {/* Footer status bar */}
      <footer className="bg-[#141A15] border-t border-[#243327] px-6 py-2.5 flex items-center justify-between text-xs text-[#828F84] shrink-0">
        <div className="flex items-center gap-3">
          <span>The Grove Bistro Operations</span>
          <span>•</span>
          <span className="text-emerald-400">Database Synchronized Locally</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Level 12, Hamid Tower, 22 DIT II Circle, Dhaka</span>
        </div>
      </footer>

      {/* Add Dish Modal */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        onClose={() => setIsAddDishModalOpen(false)}
        onAddDish={handleAddDish}
      />
    </div>
  );
}
