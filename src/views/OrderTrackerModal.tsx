import React, { useState } from 'react';
import { X, Clock, CheckCircle, ChefHat, Truck, ShoppingBag, Search, Copy, Check, Link2 } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { OrderStatus } from '../types';

interface OrderTrackerModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackerModal({ orderId, isOpen, onClose }: OrderTrackerModalProps) {
  const { orders, getOrderById } = useOrder();
  const [searchId, setSearchId] = useState('');
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lock body scroll when tracker modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Resolve target order: specific searched/prop ID first, otherwise latest order
  const targetId = activeSearchId || orderId;
  const currentOrder = targetId ? getOrderById(targetId) : (orders.length > 0 ? orders[0] : null);

  const trackingUrl = currentOrder 
    ? `${window.location.origin}${window.location.pathname}#track-${currentOrder.orderId}`
    : '';

  const handleCopyLink = async () => {
    if (!trackingUrl) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(trackingUrl);
      } else {
        throw new Error('Clipboard fallback');
      }
    } catch {
      const el = document.createElement('textarea');
      el.value = trackingUrl;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setActiveSearchId(searchId.trim());
      window.location.hash = `track-${searchId.trim()}`;
    }
  };

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle },
    { status: 'Preparing', label: 'Kitchen Preparing', icon: ChefHat },
    { status: 'Ready', label: 'Ready / Packed', icon: ShoppingBag },
    { status: 'Out for delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'Completed', label: 'Delivered / Completed', icon: CheckCircle },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
        return 2;
      case 'Out for delivery':
        return 3;
      case 'Completed':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.orderStatus) : 1;

  return (
    <div
      id="order-tracker-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Order Tracking Status"
    >
      <div className="bg-[#FAF8F5] text-[#1E221E] w-full max-w-2xl rounded-sm shadow-2xl border border-[#E3DDD4] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#1B241D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#A3B899]" />
            <div>
              <h3 className="font-serif-display text-lg sm:text-xl font-semibold">
                Live Order Tracking
              </h3>
              <p className="text-xs text-[#A3B899]">Level 12 Kitchen, Hamid Tower, Gulshan-2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!currentOrder ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1E1B]">Order {targetId ? `"${targetId}"` : ''} not found</p>
                <p className="text-xs text-[#666F67] mt-1">
                  Please check the reference number or look up with your order code below.
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="max-w-xs mx-auto flex gap-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  placeholder="e.g. GV-8419"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#DDD5CA] rounded-xs font-mono uppercase focus:outline-none focus:border-[#1B241D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B241D] text-white text-xs font-semibold rounded-xs hover:bg-black transition-colors"
                >
                  Track
                </button>
              </form>

              {orders.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-stone-500 mb-2">Recent available orders:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {orders.slice(0, 3).map(o => (
                      <button
                        key={o.orderId}
                        type="button"
                        onClick={() => {
                          setActiveSearchId(o.orderId);
                          window.location.hash = `track-${o.orderId}`;
                        }}
                        className="text-xs font-mono px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs border border-stone-200 transition-colors"
                      >
                        {o.orderId} ({o.customerName})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Order Reference & Tracking Link Header */}
              <div className="p-4 bg-white border border-[#E3DDD4] rounded-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#7F8881] uppercase tracking-wider">
                      Order Reference
                    </div>
                    <div className="font-serif-display text-2xl font-bold text-[#1A1E1B]">
                      {currentOrder.orderId}
                    </div>
                    <p className="text-xs text-[#555E57] mt-0.5">
                      Ordered for {currentOrder.customerName} • {currentOrder.orderType.toUpperCase()}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs text-[#7F8881] uppercase tracking-wider">Current Status</div>
                    <span className="inline-block px-3 py-1 bg-[#2D4532] text-white text-xs font-semibold rounded-full mt-0.5">
                      {currentOrder.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking Link Bar */}
                <div className="pt-2 border-t border-[#F0EBE3] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 truncate min-w-0">
                    <Link2 className="w-3.5 h-3.5 text-[#2D4532] shrink-0" />
                    <span className="font-mono text-[11px] truncate text-stone-700 select-all">
                      {trackingUrl}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xs text-[11px] font-semibold text-stone-800 transition-colors cursor-pointer"
                    title="Copy unique tracking link"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-4 overflow-x-auto scrollbar-none">
                <div className="relative flex justify-between items-center min-w-[340px] sm:min-w-0">
                  {/* Progress Line */}
                  <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#E2DBD1] -z-0" />
                  <div
                    className="absolute left-6 top-5 h-0.5 bg-[#2D4532] -z-0 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (currentStepIdx / (steps.length - 1)) * 100)}%`
                    }}
                  />

                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.status} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#2D4532] text-white ring-4 ring-[#2D4532]/20'
                              : isDone
                              ? 'bg-[#2D4532] text-white'
                              : 'bg-[#FAF8F5] border-2 border-[#D9D2C7] text-[#9A9F9A]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs mt-2 text-center max-w-[70px] sm:max-w-[80px] leading-tight font-medium ${
                            isDone ? 'text-[#1A1E1B] font-semibold' : 'text-[#8C938C]'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Destination Summary */}
              <div className="bg-white border border-[#E3DDD4] p-4 rounded-xs text-xs space-y-3">
                <div className="flex justify-between font-medium text-[#1A1E1B] pb-2 border-b border-[#F0EBE3]">
                  <span>Items in this order:</span>
                  <span>৳ {currentOrder.total.toLocaleString()}</span>
                </div>
                <ul className="space-y-1 text-[#5F6660]">
                  {currentOrder.items.map((ci, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {ci.quantity}x {ci.item.name}
                      </span>
                      <span>৳ {(ci.item.price * ci.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>

                {currentOrder.orderType === 'delivery' && (
                  <div className="pt-2 border-t border-[#F0EBE3] text-[#6F7770]">
                    <span className="font-semibold text-[#1A1E1B] block">Delivery Location:</span>
                    <p>{currentOrder.address}, {currentOrder.area}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F1EB] border-t border-[#E6E0D6] flex items-center justify-between text-xs text-[#7F8881]">
          <span>Need adjustments? Call +880 1315-063084</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2D4532] text-white font-semibold rounded-xs hover:bg-[#233727] cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
