import { useState } from 'react';
import { X, Clock, CheckCircle, ChefHat, Truck, ShoppingBag, Search } from 'lucide-react';
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

  if (!isOpen) return null;

  const currentOrder = (orderId ? getOrderById(orderId) : null) || orders[0];

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
            <div className="text-center py-10">
              <p className="text-sm text-[#666F67]">No recent order found.</p>
            </div>
          ) : (
            <>
              {/* Order Reference Card */}
              <div className="p-4 bg-white border border-[#E3DDD4] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

              {/* Progress Stepper */}
              <div className="py-4">
                <div className="relative flex justify-between items-center">
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
