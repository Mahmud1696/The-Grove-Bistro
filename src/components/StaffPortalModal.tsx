import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  ShoppingBag, 
  UtensilsCrossed, 
  TrendingUp, 
  Calendar, 
  ArrowLeft, 
  Plus, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Search,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Delete
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { useReservation } from '../context/ReservationContext';
import { AdminDashboardTab } from './admin/AdminDashboardTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminDishesTab } from './admin/AdminDishesTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { AdminReservationsTab } from './admin/AdminReservationsTab';
import { AddDishModal } from './admin/AddDishModal';
import { MenuItem } from '../types';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type StaffPortalTab = 'dashboard' | 'orders' | 'dishes' | 'analytics' | 'reservations';

export function StaffPortalModal({ isOpen, onClose }: StaffPortalModalProps) {
  const { orders, updateOrderStatus } = useOrder();
  const { menuItems, addMenuItem, toggleDishAvailability, deleteMenuItem, resetMenuToDefault } = useMenu();
  const { reservations, cancelReservation } = useReservation();

  // Always require PIN verification on modal open
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<StaffPortalTab>('dashboard');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Reset authentication state whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setPasswordInput('');
      setPasswordError(false);
      try {
        sessionStorage.removeItem('thegrove_portal_auth');
      } catch (err) {}
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError(false);
    onClose();
  };

  // Esc key listener to close or return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddDishModalOpen) {
          setIsAddDishModalOpen(false);
        } else {
          handleClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isAddDishModalOpen]);

  if (!isOpen) return null;

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim() === '12345') {
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const handleInputChange = (val: string) => {
    setPasswordInput(val);
    setPasswordError(false);
    if (val.trim() === '12345') {
      setIsAuthenticated(true);
      setPasswordInput('');
      setPasswordError(false);
    }
  };

  const handleKeypadPress = (num: string) => {
    if (passwordInput.length < 10) {
      const next = passwordInput + num;
      setPasswordInput(next);
      setPasswordError(false);
      if (next === '12345') {
        setIsAuthenticated(true);
        setPasswordInput('');
        setPasswordError(false);
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPasswordInput(prev => prev.slice(0, -1));
    setPasswordError(false);
  };

  const handleKeypadClear = () => {
    setPasswordInput('');
    setPasswordError(false);
  };

  const handleLockPortal = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError(false);
  };

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3500);
  };

  const handleAddDish = (dishData: Omit<MenuItem, 'id'>) => {
    addMenuItem(dishData);
    triggerNotification(`Dish "${dishData.name}" has been published to the live menu.`);
  };

  const activeOrdersCount = orders.filter(
    o => ['Pending', 'Confirmed', 'Preparing'].includes(o.orderStatus)
  ).length;

  // PASSWORD AUTHENTICATION SCREEN (LIGHT THEME)
  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative bg-white border border-gray-200 rounded-sm shadow-2xl max-w-md w-full p-6 sm:p-8 text-gray-900 space-y-6">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 rounded-xs hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-gray-900 shadow-xs">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-wider mb-1 border border-gray-200">
                <Lock className="w-3 h-3" />
                <span>Restricted Access</span>
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-gray-900">
                Manager & Kitchen Portal
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter PIN (12345) to access the manager dashboard, kitchen dispatch & analytics.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                <span>Manager PIN / Passcode</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  maxLength={10}
                  value={passwordInput}
                  onChange={e => handleInputChange(e.target.value)}
                  placeholder="Enter PIN: 12345"
                  className={`w-full py-3 px-4 text-center font-mono text-xl tracking-[0.3em] font-bold rounded-xs border transition-all focus:outline-none ${
                    passwordError
                      ? 'border-red-500 bg-red-50 text-red-900 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-300 bg-gray-50 text-gray-900 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
                  }`}
                />
              </div>

              {passwordError && (
                <div className="p-2.5 mt-2 bg-red-50 border border-red-200 rounded-xs text-xs text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Incorrect PIN. Please enter PIN 12345 to access the dashboard.</span>
                </div>
              )}
            </div>

            {/* Quick Numeric Keypad for POS Touch Screens */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-2.5 text-base font-bold bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-xs text-gray-900 transition-colors cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-2.5 text-xs uppercase font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xs text-gray-500 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-2.5 text-base font-bold bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-xs text-gray-900 transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="py-2.5 text-xs font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xs text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Kitchen & Manager Portal</span>
            </button>
          </form>

          {/* Footer cancel / back */}
          <div className="pt-2 text-center border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-gray-500 hover:text-black font-semibold transition-colors cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN AUTHENTICATED PORTAL (LIGHT THEME)
  return (
    <div 
      className="fixed inset-0 z-50 bg-[#F9FAFB] text-gray-900 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white shrink-0 shadow-xs">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-display text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Manager & Kitchen Portal
              </h2>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                Live Operations
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              Dhaka Kitchen Command & Executive Operations Dashboard
            </p>
          </div>
        </div>

        {/* Center: Desktop Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-gray-100 p-1 rounded-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
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
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dishes</span>
            <span className="text-[10px] text-gray-500">({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-white text-gray-900 shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings</span>
            <span className="text-[10px] text-gray-500">({reservations.length})</span>
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddDishModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish</span>
          </button>

          <button
            onClick={handleLockPortal}
            title="Lock Portal (requires authorized passcode to re-enter)"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 hover:text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lock Portal</span>
          </button>

          <button
            onClick={handleClose}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 hover:text-black text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Website</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-600 bg-gray-100'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-gray-900 text-white' : 'text-gray-600 bg-gray-100'
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
          className={`px-3 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'dishes' ? 'bg-gray-900 text-white' : 'text-gray-600 bg-gray-100'
          }`}
        >
          Dishes ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'analytics' ? 'bg-gray-900 text-white' : 'text-gray-600 bg-gray-100'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-3 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer ${
            activeTab === 'reservations' ? 'bg-gray-900 text-white' : 'text-gray-600 bg-gray-100'
          }`}
        >
          Bookings ({reservations.length})
        </button>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="bg-gray-900 text-white text-xs px-6 py-2.5 flex items-center gap-2 border-b border-gray-800 animate-fadeIn shrink-0">
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
      <footer className="bg-white border-t border-gray-200 px-6 py-2.5 flex items-center justify-between text-xs text-gray-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">The Grove Bistro Operations</span>
          <span>•</span>
          <span className="text-emerald-700 font-medium">Database Synchronized Locally</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
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
