import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Bell, 
  Globe, 
  FileText, 
  KeyRound, 
  Check, 
  AlertCircle, 
  Lock, 
  Save, 
  RotateCcw,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { RestaurantSettings, AuditLogEntry } from '../../types';
import { RESTAURANT_INFO } from '../../data/restaurantData';

interface SettingsTabProps {
  onNotification: (msg: string) => void;
}

type SettingsSection = 
  | 'profile' 
  | 'staff' 
  | 'payments' 
  | 'fulfillment' 
  | 'notifications' 
  | 'website' 
  | 'audit';

const SETTINGS_STORAGE_KEY = 'thegrove_bistro_settings_v1';
const PIN_STORAGE_KEY = 'thegrove_portal_pin_v1';

const DEFAULT_SETTINGS: RestaurantSettings = {
  profile: {
    name: RESTAURANT_INFO.name,
    tagline: RESTAURANT_INFO.tagline,
    phone: RESTAURANT_INFO.phone,
    email: RESTAURANT_INFO.email,
    address: `${RESTAURANT_INFO.address.line1}, ${RESTAURANT_INFO.address.line2}, ${RESTAURANT_INFO.address.city}`,
    operatingHours: RESTAURANT_INFO.hours.regular,
    kitchenCloses: RESTAURANT_INFO.hours.kitchenCloses,
    currencySymbol: '৳'
  },
  fulfillment: {
    isOnlineOrderingActive: true,
    announcementBanner: 'Welcome to The Grove Bistro — Now accepting online delivery orders across Gulshan, Banani, and Baridhara.',
    baseDeliveryFee: 100,
    freeDeliveryThreshold: 3500,
    defaultPrepTimeMinutes: 20,
    deliveryPrepTimeMinutes: 35,
    deliveryAreas: ['Gulshan 1 & 2', 'Banani', 'Baridhara', 'Bashundhara', 'Mohakhali', 'Dhanmondi', 'Uttara']
  },
  payments: {
    enableCashOnDelivery: true,
    enablePayOnPickup: true,
    enableOnlinePayment: true,
    taxPercentage: 5,
    serviceChargePercentage: 0
  },
  notifications: {
    soundAlertsEnabled: true,
    kitchenAutoPrint: false,
    lowStockWarnings: true
  }
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    action: 'Portal Access Authenticated',
    category: 'security',
    user: 'Afif Rahman (Manager)',
    details: 'Verified manager PIN at Executive Terminal 1.'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    action: 'Order #GV-8419 Status Transition',
    category: 'order',
    user: 'Kitchen Line 1',
    details: 'Advanced ticket status to "Preparing".'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    action: 'Table Booking Confirmed',
    category: 'booking',
    user: 'Front Desk Host',
    details: 'Confirmed reservation #RSV-7712 for Zubair Hossain (Table T4).'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    action: 'Menu Item Availability Updated',
    category: 'menu',
    user: 'Chef Executive',
    details: 'Verified stock inventory for all signature prime grills.'
  }
];

export function SettingsTab({ onNotification }: SettingsTabProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // PIN settings
  const [currentPin, setCurrentPin] = useState(() => {
    return localStorage.getItem(PIN_STORAGE_KEY) || '12345';
  });
  const [pinOldInput, setPinOldInput] = useState('');
  const [pinNewInput, setPinNewInput] = useState('');
  const [pinConfirmInput, setPinConfirmInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState(false);

  // Audit Logs
  const [auditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const handleSaveSettings = () => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      onNotification('Restaurant settings saved successfully.');
    } catch (e) {
      onNotification('Failed to save settings.');
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(false);

    if (pinOldInput.trim() !== currentPin) {
      setPinError('Existing PIN is incorrect.');
      return;
    }
    if (pinNewInput.length < 4) {
      setPinError('New PIN must be at least 4 digits.');
      return;
    }
    if (pinNewInput !== pinConfirmInput) {
      setPinError('New PIN confirmation does not match.');
      return;
    }

    localStorage.setItem(PIN_STORAGE_KEY, pinNewInput.trim());
    setCurrentPin(pinNewInput.trim());
    setPinSuccess(true);
    setPinOldInput('');
    setPinNewInput('');
    setPinConfirmInput('');
    onNotification('Manager PIN updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation Bar */}
      <div className="bg-white border border-stone-200 p-2 rounded-md shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'profile', label: 'Restaurant Profile', icon: Building2 },
            { id: 'staff', label: 'Staff & PIN', icon: KeyRound },
            { id: 'payments', label: 'Payments & Tax', icon: CreditCard },
            { id: 'fulfillment', label: 'Delivery & Dispatch', icon: Truck },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'website', label: 'Website & Menu', icon: Globe },
            { id: 'audit', label: 'Security & Audit Log', icon: ShieldCheck },
          ].map(sec => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id as SettingsSection)}
                className={`px-3 py-2 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="bg-white border border-stone-200 rounded-md shadow-2xs p-5 sm:p-6 space-y-6">
        {/* Section 1: RESTAURANT PROFILE */}
        {activeSection === 'profile' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Restaurant Profile & Operational Details
              </h3>
              <p className="text-xs text-stone-500">
                Brand identity, contact numbers, and guest dining address
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={e => setSettings({
                    ...settings,
                    profile: { ...settings.profile, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={settings.profile.tagline}
                  onChange={e => setSettings({
                    ...settings,
                    profile: { ...settings.profile, tagline: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={settings.profile.phone}
                  onChange={e => setSettings({
                    ...settings,
                    profile: { ...settings.profile, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={e => setSettings({
                    ...settings,
                    profile: { ...settings.profile, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={settings.profile.address}
                  onChange={e => setSettings({
                    ...settings,
                    profile: { ...settings.profile, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Dining Hours
                </label>
                <input
                  type="text"
                  value={settings.profile.operatingHours}
                  onChange={e => setSettings({
                    ...settings,
                    profile: { ...settings.profile, operatingHours: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Kitchen Cutoff
                </label>
                <input
                  type="text"
                  value={settings.profile.kitchenCloses}
                  onChange={e => setSettings({
                    ...settings,
                    profile: { ...settings.profile, kitchenCloses: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 2: STAFF & PIN CODE */}
        {activeSection === 'staff' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Staff Terminals & Access Security
              </h3>
              <p className="text-xs text-stone-500">
                Manage portal passcodes, authorized roles, and terminal security
              </p>
            </div>

            {/* Change Manager PIN Form */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-sm space-y-4 max-w-md">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-emerald-800" />
                <span>Manager / Kitchen Access PIN</span>
              </div>
              <p className="text-xs text-stone-500">
                Default PIN is <strong className="text-stone-900">12345</strong>. Enter the existing PIN and your new passcode below to update it.
              </p>

              {pinSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Passcode updated successfully!</span>
                </div>
              )}

              {pinError && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-700" />
                  <span>{pinError}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePin} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Existing PIN
                  </label>
                  <input
                    type="password"
                    required
                    value={pinOldInput}
                    onChange={e => setPinOldInput(e.target.value)}
                    placeholder="Enter current PIN (e.g. 12345)"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    New PIN (minimum 4 digits)
                  </label>
                  <input
                    type="password"
                    required
                    value={pinNewInput}
                    onChange={e => setPinNewInput(e.target.value)}
                    placeholder="Enter new PIN"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    required
                    value={pinConfirmInput}
                    onChange={e => setPinConfirmInput(e.target.value)}
                    placeholder="Repeat new PIN"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm font-mono focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-black text-white font-semibold rounded-sm transition-colors cursor-pointer"
                >
                  Update Passcode
                </button>
              </form>
            </div>

            {/* Active Staff Roles */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Registered Staff & Permission Roles
              </h4>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-sm text-xs">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">Afif Rahman</div>
                    <div className="text-stone-500 text-[11px]">General Manager & Culinary Director</div>
                  </div>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-sm">
                    Full Admin Access
                  </span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">Head Chef & Line Dispatch</div>
                    <div className="text-stone-500 text-[11px]">KDS Screen & Ticket Clearance</div>
                  </div>
                  <span className="font-semibold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-sm">
                    Kitchen Display Operator
                  </span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">Hostess & Front of House</div>
                    <div className="text-stone-500 text-[11px]">Table Reservations & Seating Assignment</div>
                  </div>
                  <span className="font-semibold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-sm">
                    Bookings Coordinator
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: PAYMENTS & TAX */}
        {activeSection === 'payments' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Payment Gateways & Tax Configurations
              </h3>
              <p className="text-xs text-stone-500">
                Active customer checkout payment methods and fiscal parameters
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-sm border border-stone-200 bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Cash on Delivery (COD)</div>
                  <div className="text-stone-500 text-[11px]">Accept cash payment upon courier arrival at customer address</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.payments.enableCashOnDelivery}
                  onChange={e => setSettings({
                    ...settings,
                    payments: { ...settings.payments, enableCashOnDelivery: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-800 rounded-xs"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-sm border border-stone-200 bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Pay on Pickup / Takeaway Counter</div>
                  <div className="text-stone-500 text-[11px]">Pay via counter POS card or cash when picking up food in person</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.payments.enablePayOnPickup}
                  onChange={e => setSettings({
                    ...settings,
                    payments: { ...settings.payments, enablePayOnPickup: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-800 rounded-xs"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-sm border border-stone-200 bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Online Payment Gateway (bKash, Nagad, Visa/Mastercard)</div>
                  <div className="text-stone-500 text-[11px]">Direct digital payment processing at checkout</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.payments.enableOnlinePayment}
                  onChange={e => setSettings({
                    ...settings,
                    payments: { ...settings.payments, enableOnlinePayment: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-800 rounded-xs"
                />
              </label>

              <div className="grid grid-cols-2 gap-4 pt-3">
                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    VAT / Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={settings.payments.taxPercentage}
                    onChange={e => setSettings({
                      ...settings,
                      payments: { ...settings.payments, taxPercentage: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm font-mono text-stone-900 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Service Charge (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={settings.payments.serviceChargePercentage}
                    onChange={e => setSettings({
                      ...settings,
                      payments: { ...settings.payments, serviceChargePercentage: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm font-mono text-stone-900 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Payment Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 4: DELIVERY & FULFILLMENT */}
        {activeSection === 'fulfillment' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Delivery Surcharges & Kitchen Prep Timing
              </h3>
              <p className="text-xs text-stone-500">
                Fulfillment fees, free delivery limits, and target kitchen times
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Base Delivery Surcharge (BDT ৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={settings.fulfillment.baseDeliveryFee}
                  onChange={e => setSettings({
                    ...settings,
                    fulfillment: { ...settings.fulfillment, baseDeliveryFee: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm font-mono text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Free Delivery Spending Threshold (BDT ৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={settings.fulfillment.freeDeliveryThreshold}
                  onChange={e => setSettings({
                    ...settings,
                    fulfillment: { ...settings.fulfillment, freeDeliveryThreshold: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm font-mono text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Dine-In Target Prep Time (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  value={settings.fulfillment.defaultPrepTimeMinutes}
                  onChange={e => setSettings({
                    ...settings,
                    fulfillment: { ...settings.fulfillment, defaultPrepTimeMinutes: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm font-mono text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Delivery Courier Prep Time (Minutes)
                </label>
                <input
                  type="number"
                  min={10}
                  value={settings.fulfillment.deliveryPrepTimeMinutes}
                  onChange={e => setSettings({
                    ...settings,
                    fulfillment: { ...settings.fulfillment, deliveryPrepTimeMinutes: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm font-mono text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Covered Delivery Areas
                </label>
                <input
                  type="text"
                  value={settings.fulfillment.deliveryAreas.join(', ')}
                  onChange={e => setSettings({
                    ...settings,
                    fulfillment: { ...settings.fulfillment, deliveryAreas: e.target.value.split(',').map(s => s.trim()) }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">Comma-separated delivery zones in Dhaka</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Fulfillment Rules</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 5: NOTIFICATIONS */}
        {activeSection === 'notifications' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Audible Chimes & Kitchen Alerts
              </h3>
              <p className="text-xs text-stone-500">
                Manage audio signals for incoming orders and kitchen pass bumps
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-sm border border-stone-200 bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Audible Kitchen Chime (Web Audio Synthesizer)</div>
                  <div className="text-stone-500 text-[11px]">Play audio alert when new orders arrive and when tickets advance</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.soundAlertsEnabled}
                  onChange={e => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, soundAlertsEnabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-800 rounded-xs"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-sm border border-stone-200 bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Low Stock / 86 Warnings</div>
                  <div className="text-stone-500 text-[11px]">Alert kitchen when inventory items are marked out of stock</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.lowStockWarnings}
                  onChange={e => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, lowStockWarnings: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-800 rounded-xs"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notification Preferences</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 6: WEBSITE & MENU */}
        {activeSection === 'website' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Public Website & Online Ordering Master Switch
              </h3>
              <p className="text-xs text-stone-500">
                Control guest checkout availability and site announcement banners
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 rounded-sm border border-stone-200 bg-stone-50 cursor-pointer">
                <div>
                  <div className="font-semibold text-stone-900">Online Ordering Acceptance (Master Switch)</div>
                  <div className="text-stone-500 text-[11px]">When disabled, customers can view menu but cannot submit new checkout orders</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.fulfillment.isOnlineOrderingActive}
                  onChange={e => setSettings({
                    ...settings,
                    fulfillment: { ...settings.fulfillment, isOnlineOrderingActive: e.target.checked }
                  })}
                  className="w-4 h-4 text-emerald-800 rounded-xs"
                />
              </label>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Public Announcement Banner Text
                </label>
                <textarea
                  rows={3}
                  value={settings.fulfillment.announcementBanner}
                  onChange={e => setSettings({
                    ...settings,
                    fulfillment: { ...settings.fulfillment, announcementBanner: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Website Controls</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 7: SECURITY & AUDIT LOG */}
        {activeSection === 'audit' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Operational Security & Audit Log
              </h3>
              <p className="text-xs text-stone-500">
                Chronological ledger of managerial updates, status changes, and terminal logins
              </p>
            </div>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-sm">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 text-xs hover:bg-stone-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{log.action}</span>
                      <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded-xs border border-stone-200">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px]">{log.details}</p>
                    <div className="text-[10px] text-stone-400">Authorized by {log.user}</div>
                  </div>

                  <div className="text-right whitespace-nowrap text-[11px] text-stone-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
