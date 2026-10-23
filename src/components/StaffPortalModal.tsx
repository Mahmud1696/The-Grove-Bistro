import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  X, 
  Delete, 
  Plus, 
  Bell, 
  Calendar as CalendarIcon,
  ChefHat
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { useReservation } from '../context/ReservationContext';
import { PortalTab, MenuItem } from '../types';

import { PortalSidebar } from './admin/PortalSidebar';
import { PortalHeader } from './admin/PortalHeader';
import { OverviewTab } from './admin/OverviewTab';
import { OrdersTab } from './admin/OrdersTab';
import { KitchenDisplayTab } from './admin/KitchenDisplayTab';
import { DishesMenuTab } from './admin/DishesMenuTab';
import { CategoriesTab } from './admin/CategoriesTab';
import { BookingsTab } from './admin/BookingsTab';
import { CustomersTab } from './admin/CustomersTab';
import { AnalyticsTab } from './admin/AnalyticsTab';
import { ReportsTab } from './admin/ReportsTab';
import { SettingsTab } from './admin/SettingsTab';
import { AddDishModal } from './admin/AddDishModal';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PIN_STORAGE_KEY = 'thegrove_portal_pin_v1';
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'thegrove_portal_sidebar_collapsed';

export function StaffPortalModal({ isOpen, onClose }: StaffPortalModalProps) {
  const { orders, updateOrderStatus } = useOrder();
  const { 
    menuItems, 
    categories,
    addMenuItem, 
    updateMenuItem, 
    toggleDishAvailability, 
    deleteMenuItem, 
    duplicateMenuItem, 
    resetMenuToDefault,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryAddToHome,
    resetCategoriesToDefault
  } = useMenu();
  const { 
    reservations, 
    addAdminReservation, 
    updateReservationStatus, 
    updateReservation 
  } = useReservation();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState<PortalTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals & Notifications State
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [selectedOrderIdForDetail, setSelectedOrderIdForDetail] = useState<string | null>(null);

  // Persist sidebar collapsed preference
  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  // Reset authentication whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setPasswordInput('');
      setPasswordError(false);
      setSelectedOrderIdForDetail(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError(false);
    onClose();
  };

  // Esc key listener to close modals or lock
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

  const getAuthorizedPin = () => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || '12345';
    } catch {
      return '12345';
    }
  };

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const authorizedPin = getAuthorizedPin();
    if (passwordInput.trim() === authorizedPin || passwordInput.trim() === '12345') {
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
    const authorizedPin = getAuthorizedPin();
    if (val.trim() === authorizedPin || val.trim() === '12345') {
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
      const authorizedPin = getAuthorizedPin();
      if (next === authorizedPin || next === '12345') {
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
    }, 4000);
  };

  const handleAddDish = (dishData: Omit<MenuItem, 'id'>) => {
    addMenuItem(dishData);
    triggerNotification(`Dish "${dishData.name}" has been published to the live menu.`);
    setIsAddDishModalOpen(false);
  };

  // Live badge counts
  const activeOrdersCount = orders.filter(
    o => ['Pending', 'Confirmed', 'Preparing'].includes(o.orderStatus)
  ).length;

  const kitchenTicketsCount = orders.filter(
    o => ['Pending', 'Confirmed', 'Preparing', 'Ready'].includes(o.orderStatus)
  ).length;

  const pendingBookingsCount = reservations.filter(
    r => r.status === 'Pending'
  ).length;

  // Contextual action button for current tab
  const getContextualAction = () => {
    if (activeTab === 'dishes') {
      return (
        <button
          type="button"
          onClick={() => setIsAddDishModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Dish</span>
        </button>
      );
    }
    return null;
  };

  // PASSWORD AUTHENTICATION SCREEN
  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative bg-white border border-stone-200 rounded-md shadow-2xl max-w-md w-full p-6 sm:p-8 text-stone-900 space-y-6">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#1B3B2B]/10 border border-[#1B3B2B]/20 mx-auto flex items-center justify-center text-[#1B3B2B] shadow-2xs">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold uppercase tracking-wider mb-1 border border-stone-200">
                <Lock className="w-3 h-3" />
                <span>Restricted Manager Access</span>
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                The Grove Bistro Portal
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter authorized PIN (12345) to open the kitchen display and management dashboard.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                <span>Manager PIN / Passcode</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-stone-500 hover:text-black flex items-center gap-1 cursor-pointer"
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
                  className={`w-full py-3 px-4 text-center font-mono text-xl tracking-[0.3em] font-bold rounded-sm border transition-all focus:outline-none ${
                    passwordError
                      ? 'border-rose-500 bg-rose-50 text-rose-900 focus:ring-1 focus:ring-rose-500'
                      : 'border-stone-300 bg-stone-50 text-stone-900 focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900'
                  }`}
                />
              </div>

              {passwordError && (
                <div className="p-2.5 mt-2 bg-rose-50 border border-rose-200 rounded-sm text-xs text-rose-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Incorrect PIN. Enter PIN 12345 to open the management portal.</span>
                </div>
              )}
            </div>

            {/* Quick Touch Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-2.5 text-base font-bold bg-stone-50 hover:bg-stone-100 active:bg-stone-200 border border-stone-200 rounded-sm text-stone-900 transition-colors cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-2.5 text-xs uppercase font-bold bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-sm text-stone-500 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-2.5 text-base font-bold bg-stone-50 hover:bg-stone-100 active:bg-stone-200 border border-stone-200 rounded-sm text-stone-900 transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="py-2.5 text-xs font-bold bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-sm text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1B3B2B] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Kitchen & Manager Portal</span>
            </button>
          </form>

          {/* Footer exit */}
          <div className="pt-2 text-center border-t border-stone-200">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-stone-500 hover:text-black font-semibold transition-colors cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED PORTAL WITH PERSISTENT SIDEBAR & CONTEXTUAL HEADER
  return (
    <div 
      className="fixed inset-0 z-50 bg-[#F9F9F8] text-stone-900 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Persistent Left Sidebar */}
      <PortalSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeOrdersCount={activeOrdersCount}
        kitchenTicketsCount={kitchenTicketsCount}
        pendingBookingsCount={pendingBookingsCount}
        onLockPortal={handleLockPortal}
        onExitToWebsite={handleClose}
      />

      {/* Main Viewport Container (Offsets smoothly based on sidebar state) */}
      <div 
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-[76px]' : 'md:pl-[250px]'
        }`}
      >
        {/* 2. Compact Contextual Header */}
        <PortalHeader
          activeTab={activeTab}
          isCollapsed={isSidebarCollapsed}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLockPortal={handleLockPortal}
          onExitToWebsite={handleClose}
          contextualAction={getContextualAction()}
          orders={orders}
          reservations={reservations}
          onNavigateTab={setActiveTab}
        />

        {/* Operational Notification Toast */}
        {notificationMsg && (
          <div className="bg-[#142318] text-white text-xs px-6 py-2.5 flex items-center gap-2.5 border-b border-[#24422E] animate-fadeIn shrink-0 shadow-xs">
            <Bell className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-medium tracking-wide">{notificationMsg}</span>
          </div>
        )}

        {/* 3. Scrollable Main Content Space */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <OverviewTab
              orders={orders}
              menuItems={menuItems}
              onNavigateTab={setActiveTab}
              onSelectOrder={(orderId) => {
                setSelectedOrderIdForDetail(orderId);
                setActiveTab('orders');
              }}
            />
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onUpdateOrderStatus={updateOrderStatus}
              onNotification={triggerNotification}
              selectedOrderId={selectedOrderIdForDetail}
              onClearSelectedOrder={() => setSelectedOrderIdForDetail(null)}
            />
          )}

          {/* TAB 3: KITCHEN DISPLAY */}
          {activeTab === 'kitchen' && (
            <KitchenDisplayTab
              orders={orders}
              onUpdateOrderStatus={updateOrderStatus}
              onNotification={triggerNotification}
            />
          )}

          {/* TAB 4: DISHES & MENU */}
          {activeTab === 'dishes' && (
            <DishesMenuTab
              menuItems={menuItems}
              onOpenAddDish={() => setIsAddDishModalOpen(true)}
              onToggleAvailability={toggleDishAvailability}
              onDeleteDish={deleteMenuItem}
              onDuplicateDish={(dishId) => {
                duplicateMenuItem(dishId);
              }}
              onUpdateDish={updateMenuItem}
              onResetDefaultMenu={resetMenuToDefault}
              onNotification={triggerNotification}
            />
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              menuItems={menuItems}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onToggleAddToHome={toggleCategoryAddToHome}
              onResetDefaultCategories={resetCategoriesToDefault}
              onNotification={triggerNotification}
            />
          )}

          {/* TAB 5: BOOKINGS */}
          {activeTab === 'bookings' && (
            <BookingsTab
              reservations={reservations}
              onAddBooking={addAdminReservation}
              onUpdateReservationStatus={updateReservationStatus}
              onUpdateReservation={updateReservation}
              onNotification={triggerNotification}
            />
          )}

          {/* TAB 6: CUSTOMERS */}
          {activeTab === 'customers' && (
            <CustomersTab
              orders={orders}
              reservations={reservations}
              onSelectOrder={(orderId) => {
                setSelectedOrderIdForDetail(orderId);
                setActiveTab('orders');
              }}
              onNotification={triggerNotification}
            />
          )}

          {/* TAB 7: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsTab
              orders={orders}
              menuItems={menuItems}
            />
          )}

          {/* TAB 8: REPORTS */}
          {activeTab === 'reports' && (
            <ReportsTab
              orders={orders}
              menuItems={menuItems}
              reservations={reservations}
              onNotification={triggerNotification}
            />
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsTab
              onNotification={triggerNotification}
            />
          )}
        </main>
      </div>

      {/* Global Add Dish Modal */}
      <AddDishModal
        isOpen={isAddDishModalOpen}
        onClose={() => setIsAddDishModalOpen(false)}
        onAddDish={handleAddDish}
      />
    </div>
  );
}
