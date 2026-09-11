import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  UtensilsCrossed,
  ArrowRight
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
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.orderId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.toLowerCase().includes(query) ||
      (order.email && order.email.toLowerCase().includes(query)) ||
      (order.area && order.area.toLowerCase().includes(query));

    const matchesStatus = 
      selectedStatus === 'all' || order.orderStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'Preparing':
        return 'bg-amber-100 text-amber-950 border-amber-400';
      case 'Ready':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'Out for delivery':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xs text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 text-xs rounded-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              selectedStatus === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
                className={`px-3 py-1.5 text-xs rounded-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedStatus === st
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
        <div className="bg-white border border-gray-200 p-12 text-center rounded-sm shadow-xs">
          <UtensilsCrossed className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900">No orders match the selected filter.</p>
          <p className="text-xs text-gray-500 mt-1">Try resetting the status filter or search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.orderId}
              className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs hover:border-gray-300 transition-colors"
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif-display font-bold text-lg text-gray-900">
                    {order.orderId}
                  </span>
                  <span className={`text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-xs bg-gray-100 text-gray-800 uppercase tracking-wider border border-gray-200">
                    {order.orderType}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} • {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">Update Status:</span>
                  <select
                    value={order.orderStatus}
                    onChange={e => {
                      const newStatus = e.target.value as OrderStatus;
                      onUpdateOrderStatus(order.orderId, newStatus);
                      onNotification(`Order ${order.orderId} status set to ${newStatus}`);
                    }}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-xs text-xs text-gray-900 font-medium focus:outline-none focus:border-gray-900 cursor-pointer shadow-xs"
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
                <div className="space-y-1.5 p-3.5 bg-gray-50/80 border border-gray-200 rounded-xs">
                  <div className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                    Guest Details
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    {order.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <a href={`tel:${order.phone}`} className="hover:text-black font-medium transition-colors">
                      {order.phone}
                    </a>
                  </div>
                  {order.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{order.email}</span>
                    </div>
                  )}
                </div>

                {/* Column 2: Fulfillment & Instructions */}
                <div className="space-y-1.5 p-3.5 bg-gray-50/80 border border-gray-200 rounded-xs">
                  <div className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                    Fulfillment Specifics
                  </div>
                  {order.orderType === 'delivery' && (
                    <>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Zone: {order.area || 'Dhaka Metropolitan'}</span>
                      </div>
                      <div className="text-gray-700">{order.address}</div>
                    </>
                  )}
                  {order.orderType === 'pickup' && (
                    <div className="text-gray-700">
                      Pickup time: <span className="text-gray-900 font-semibold">{order.pickupTime || 'Within 25 mins'}</span> (Level 12, Hamid Tower)
                    </div>
                  )}
                  {order.orderType === 'dine-in' && (
                    <div className="text-gray-700">
                      Table assigned: <span className="text-gray-900 font-semibold">{order.tableReference || 'Counter Assigned'}</span>
                    </div>
                  )}
                  {order.specialInstructions && (
                    <div className="mt-1 p-1.5 bg-amber-50 border border-amber-200 rounded-xs text-amber-900 italic">
                      "{order.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* Column 3: Items, Payment & Total */}
                <div className="space-y-2 p-3.5 bg-gray-50/80 border border-gray-200 rounded-xs flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">
                      Ordered Dishes ({order.items.reduce((s, it) => s + it.quantity, 0)})
                    </div>
                    <ul className="space-y-1 text-gray-800">
                      {order.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between font-medium">
                          <span>
                            {it.quantity}x {it.item.name}
                          </span>
                          <span className="text-gray-600 font-normal">৳ {(it.quantity * it.item.price).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-gray-500 text-[11px]">
                      <span>Delivery Fee</span>
                      <span>৳ {order.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-1 font-serif-display font-bold text-sm text-gray-900">
                      <span>Grand Total</span>
                      <span className="text-emerald-700 text-base">৳ {order.total.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 capitalize font-medium">
                      Method: {order.paymentMethod.replace(/_/g, ' ')} • Status: {order.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Quick Action Buttons */}
              <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-gray-500 font-medium">
                  Kitchen SLA: Est. preparation ~{order.estimatedTimeMinutes || 30} mins
                </span>

                <div className="flex items-center gap-2">
                  {order.orderStatus === 'Pending' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.orderId, 'Confirmed');
                        onNotification(`Order ${order.orderId} confirmed.`);
                      }}
                      className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-xs"
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
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-xs"
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
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-xs"
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
                      className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-xs"
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
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-xs"
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
                      className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs border border-transparent hover:border-red-200 transition-colors cursor-pointer font-medium"
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
