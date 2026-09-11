import { useState } from 'react';
import { X, ShoppingBag, Calendar, CheckCircle2, Clock, Truck, ChefHat, Bell, Search, RefreshCw } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useReservation } from '../context/ReservationContext';
import { OrderStatus } from '../types';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffPortalModal({ isOpen, onClose }: StaffPortalModalProps) {
  const { orders, updateOrderStatus } = useOrder();
  const { reservations, cancelReservation } = useReservation();
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const filteredOrders = orders.filter(
    o =>
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery)
  );

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for delivery',
    'Completed',
    'Cancelled'
  ];

  return (
    <div
      id="staff-portal-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Staff & Kitchen Management Portal"
    >
      <div className="bg-[#FAF8F5] text-[#1E221E] w-full max-w-5xl rounded-sm shadow-2xl border border-[#E3DDD4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#18211A] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2D4532] flex items-center justify-center text-[#A3B899]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg sm:text-xl font-semibold">
                The Grove Bistro — Operational Console
              </h3>
              <p className="text-xs text-[#A3B899]">
                Live Orders & Reservations Dispatch • Hamid Tower, Gulshan 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Banner */}
        {notificationMsg && (
          <div className="bg-[#2D4532] text-white text-xs px-6 py-2.5 flex items-center gap-2 animate-fadeIn">
            <Bell className="w-4 h-4 text-amber-300" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Sub-Header Tabs & Search */}
        <div className="p-4 bg-[#F5F1EB] border-b border-[#E6E0D6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-[#2D4532] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#1E221E] hover:bg-[#EFEAE2]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Incoming Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'reservations'
                  ? 'bg-[#2D4532] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#1E221E] hover:bg-[#EFEAE2]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Table Bookings ({reservations.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828B83]" />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD6CB] rounded-xs focus:outline-none focus:border-[#2D4532]"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'orders' ? (
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-[#7F8881] text-sm">
                  No orders match current search filter.
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.orderId}
                    className="p-5 bg-white border border-[#E3DDD4] rounded-xs shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE3] gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-serif-display font-bold text-base text-[#1A1E1B]">
                          {order.orderId}
                        </span>
                        <span className="text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#EFEAE2] font-semibold text-[#2D4532]">
                          {order.orderType}
                        </span>
                        <span className="text-xs text-[#7F8881]">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[#6F7770]">Status:</label>
                        <select
                          value={order.orderStatus}
                          onChange={e => {
                            const newStatus = e.target.value as OrderStatus;
                            updateOrderStatus(order.orderId, newStatus);
                            triggerNotification(
                              `Order ${order.orderId} updated to ${newStatus}. Customer status synchronized.`
                            );
                          }}
                          className="text-xs font-semibold py-1 px-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs text-[#1A1E1B] focus:outline-none focus:border-[#2D4532] cursor-pointer"
                        >
                          {statuses.map(st => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-[#525953]">
                      <div>
                        <p className="font-semibold text-[#1A1E1B]">Customer</p>
                        <p>{order.customerName}</p>
                        <p>{order.phone}</p>
                        {order.email && <p className="text-[#7F8881]">{order.email}</p>}
                      </div>

                      <div>
                        <p className="font-semibold text-[#1A1E1B]">Destination / Details</p>
                        {order.orderType === 'delivery' && (
                          <>
                            <p>{order.address}</p>
                            <p className="text-[#2D4532] font-medium">{order.area}</p>
                          </>
                        )}
                        {order.orderType === 'pickup' && (
                          <p>Pickup Time: {order.pickupTime || 'Within 25 mins'}</p>
                        )}
                        {order.orderType === 'dine-in' && (
                          <p>Table Ref: {order.tableReference || 'Counter Assigned'}</p>
                        )}
                        {order.specialInstructions && (
                          <p className="italic text-amber-800 mt-1">"{order.specialInstructions}"</p>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-[#1A1E1B]">Items & Total</p>
                        <ul className="space-y-0.5">
                          {order.items.map((it, i) => (
                            <li key={i}>
                              {it.quantity}x {it.item.name}
                            </li>
                          ))}
                        </ul>
                        <p className="font-bold text-sm text-[#1A1E1B] mt-1 pt-1 border-t border-[#F0EBE3]">
                          Total: ৳ {order.total.toLocaleString()} ({order.paymentMethod.replace(/_/g, ' ')})
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Reservations Tab */
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-center py-12 text-[#7F8881] text-sm">
                  No reservations currently on record.
                </div>
              ) : (
                reservations.map(res => (
                  <div
                    key={res.id}
                    className="p-5 bg-white border border-[#E3DDD4] rounded-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif-display font-bold text-base text-[#1A1E1B]">
                          {res.referenceNumber}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                          {res.status}
                        </span>
                        <span className="text-xs text-[#7F8881]">
                          Date: {res.date} • {res.time}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#1A1E1B]">
                        {res.name} — {res.guests} Guests ({res.occasion})
                      </p>
                      <p className="text-xs text-[#6F7770]">
                        Phone: {res.phone} • Email: {res.email}
                      </p>
                      {res.specialRequest && (
                        <p className="text-xs italic text-stone-600">
                          Special request: "{res.specialRequest}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cancelReservation(res.id);
                          triggerNotification(`Reservation ${res.referenceNumber} cancelled.`);
                        }}
                        className="px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 border border-red-200 rounded-xs transition-colors cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F1EB] border-t border-[#E6E0D6] flex items-center justify-between text-xs text-[#7F8881]">
          <span>Synced locally in browser session storage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2D4532] text-white text-xs font-semibold rounded-xs hover:bg-[#223626] transition-colors cursor-pointer"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
