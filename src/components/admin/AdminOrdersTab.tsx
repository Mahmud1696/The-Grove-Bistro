import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onNotification: (msg: string) => void;
}

const ORDER_STATUS_LIST: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for delivery',
  'Completed',
  'Cancelled'
];

export function AdminOrdersTab({
  orders,
  onUpdateOrderStatus,
  onNotification
}: AdminOrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      !searchQuery ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      (order.area && order.area.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all' || order.orderStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'Confirmed':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
      case 'Preparing':
        return 'bg-amber-900/60 text-amber-300 border-amber-600/60';
      case 'Ready':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      case 'Out for delivery':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/80';
      case 'Completed':
        return 'bg-[#243327] text-[#A3B899] border-[#384C3C]';
      case 'Cancelled':
        return 'bg-red-950/80 text-red-300 border-red-800/80';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar */}
      <div className="bg-[#18211A] border border-[#2D3F30] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828F84]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-[#121713] border border-[#2D3F30] rounded-xs text-xs text-white placeholder-[#828F84] focus:outline-none focus:border-[#A3B899]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              selectedStatus === 'all'
                ? 'bg-[#2D4532] text-white'
                : 'bg-[#141A15] text-[#828F84] hover:text-white border border-[#243327]'
            }`}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUS_LIST.map(st => {
            const count = orders.filter(o => o.orderStatus === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs rounded-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedStatus === st
                    ? 'bg-[#2D4532] text-white'
                    : 'bg-[#141A15] text-[#828F84] hover:text-white border border-[#243327]'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#18211A] border border-[#2D3F30] p-12 text-center rounded-sm">
          <UtensilsCrossed className="w-8 h-8 text-[#828F84] mx-auto mb-3" />
          <p className="text-sm text-[#C8D1CA]">No orders match the selected filter.</p>
          <p className="text-xs text-[#828F84] mt-1">Try resetting the status filter or search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.orderId}
              className="bg-[#18211A] border border-[#2D3F30] rounded-sm p-5 space-y-4 hover:border-[#3E5542] transition-colors"
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#243327] gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif-display font-bold text-lg text-white">
                    {order.orderId}
                  </span>
                  <span className={`text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-xs bg-[#141A15] text-[#A3B899] uppercase tracking-wider border border-[#243327]">
                    {order.orderType}
                  </span>
                  <span className="text-xs text-[#828F84] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} • {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#828F84]">Update Status:</span>
                  <select
                    value={order.orderStatus}
                    onChange={e => {
                      const newStatus = e.target.value as OrderStatus;
                      onUpdateOrderStatus(order.orderId, newStatus);
                      onNotification(`Order ${order.orderId} status set to ${newStatus}`);
                    }}
                    className="px-3 py-1 bg-[#121713] border border-[#2D3F30] rounded-xs text-xs text-white focus:outline-none focus:border-[#A3B899] cursor-pointer"
                  >
                    {ORDER_STATUS_LIST.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* Column 1: Customer Contact */}
                <div className="space-y-1.5 p-3.5 bg-[#141A15] border border-[#243327] rounded-xs">
                  <div className="font-semibold text-[#A3B899] uppercase tracking-wider text-[10px]">
                    Guest Details
                  </div>
                  <div className="font-medium text-white text-sm">
                    {order.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-[#C8D1CA]">
                    <Phone className="w-3.5 h-3.5 text-[#828F84]" />
                    <a href={`tel:${order.phone}`} className="hover:text-white transition-colors">
                      {order.phone}
                    </a>
                  </div>
                  {order.email && (
                    <div className="flex items-center gap-2 text-[#828F84]">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{order.email}</span>
                    </div>
                  )}
                </div>

                {/* Column 2: Fulfillment & Instructions */}
                <div className="space-y-1.5 p-3.5 bg-[#141A15] border border-[#243327] rounded-xs">
                  <div className="font-semibold text-[#A3B899] uppercase tracking-wider text-[10px]">
                    Fulfillment Specifics
                  </div>
                  {order.orderType === 'delivery' && (
                    <>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Zone: {order.area || 'Dhaka Metropolitan'}</span>
                      </div>
                      <div className="text-[#C8D1CA]">{order.address}</div>
                    </>
                  )}
                  {order.orderType === 'pickup' && (
                    <div className="text-[#C8D1CA]">
                      Pickup time: <span className="text-white font-medium">{order.pickupTime || 'Within 25 mins'}</span> (Level 12, Hamid Tower)
                    </div>
                  )}
                  {order.orderType === 'dine-in' && (
                    <div className="text-[#C8D1CA]">
                      Table assigned: <span className="text-white font-medium">{order.tableReference || 'Counter Assigned'}</span>
                    </div>
                  )}
                  {order.specialInstructions && (
                    <div className="mt-1 p-1.5 bg-amber-950/40 border border-amber-900/60 rounded-xs text-amber-200 italic">
                      "{order.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* Column 3: Items, Payment & Total */}
                <div className="space-y-2 p-3.5 bg-[#141A15] border border-[#243327] rounded-xs flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-[#A3B899] uppercase tracking-wider text-[10px] mb-1">
                      Ordered Dishes ({order.items.reduce((s, it) => s + it.quantity, 0)})
                    </div>
                    <ul className="space-y-1 text-[#C8D1CA]">
                      {order.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>
                            {it.quantity}x {it.item.name}
                          </span>
                          <span className="text-[#828F84]">৳ {(it.quantity * it.item.price).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-[#243327]">
                    <div className="flex justify-between text-[#828F84] text-[11px]">
                      <span>Delivery Fee</span>
                      <span>৳ {order.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-1 font-serif-display font-bold text-sm text-white">
                      <span>Grand Total</span>
                      <span className="text-emerald-400">৳ {order.total.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-[#828F84] mt-0.5 capitalize">
                      Method: {order.paymentMethod.replace(/_/g, ' ')} • Status: {order.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Quick Action Buttons */}
              <div className="pt-2 border-t border-[#243327] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-[#828F84]">
                  Kitchen SLA: Est. preparation ~{order.estimatedTimeMinutes || 30} mins
                </span>

                <div className="flex items-center gap-2">
                  {order.orderStatus === 'Pending' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.orderId, 'Confirmed');
                        onNotification(`Order ${order.orderId} confirmed.`);
                      }}
                      className="px-3 py-1.5 bg-[#2D4532] hover:bg-[#39573f] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.orderStatus === 'Confirmed' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.orderId, 'Preparing');
                        onNotification(`Order ${order.orderId} marked in preparation.`);
                      }}
                      className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      Start Kitchen Cooking
                    </button>
                  )}
                  {order.orderStatus === 'Preparing' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.orderId, 'Ready');
                        onNotification(`Order ${order.orderId} is now ready for handoff!`);
                      }}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.orderStatus === 'Ready' && (
                    <button
                      onClick={() => {
                        const next = order.orderType === 'delivery' ? 'Out for delivery' : 'Completed';
                        onUpdateOrderStatus(order.orderId, next);
                        onNotification(`Order ${order.orderId} ${next}.`);
                      }}
                      className="px-3 py-1.5 bg-[#2D4532] hover:bg-[#39573f] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      {order.orderType === 'delivery' ? 'Dispatch with Courier' : 'Complete Pickup / Dine-In'}
                    </button>
                  )}
                  {order.orderStatus === 'Out for delivery' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.orderId, 'Completed');
                        onNotification(`Order ${order.orderId} marked completed.`);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Completed' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.orderId, 'Cancelled');
                        onNotification(`Order ${order.orderId} cancelled.`);
                      }}
                      className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xs transition-colors cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
