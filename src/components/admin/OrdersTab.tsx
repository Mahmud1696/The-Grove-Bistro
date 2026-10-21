import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Building2, 
  ShoppingBasket, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  Check, 
  RotateCcw, 
  ShieldAlert,
  CreditCard,
  Banknote,
  DollarSign
} from 'lucide-react';
import { Order, OrderStatus, OrderType } from '../../types';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onNotification: (msg: string) => void;
  selectedOrderId?: string | null;
  onClearSelectedOrder?: () => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for delivery',
  'Completed',
  'Cancelled'
];

export function OrdersTab({
  orders,
  onUpdateOrderStatus,
  onNotification,
  selectedOrderId: initialSelectedId,
  onClearSelectedOrder
}: OrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');

  const [activeOrderDetail, setActiveOrderDetail] = useState<Order | null>(() => {
    if (initialSelectedId) {
      return orders.find(o => o.orderId === initialSelectedId) || null;
    }
    return null;
  });

  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);

  // Sync if initialSelectedId changes
  React.useEffect(() => {
    if (initialSelectedId) {
      const found = orders.find(o => o.orderId === initialSelectedId);
      if (found) setActiveOrderDetail(found);
    }
  }, [initialSelectedId, orders]);

  // Keep activeOrderDetail updated if order status changes in background
  React.useEffect(() => {
    if (activeOrderDetail) {
      const current = orders.find(o => o.orderId === activeOrderDetail.orderId);
      if (current) setActiveOrderDetail(current);
    }
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        // Search
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (
          order.orderId.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.phone.includes(q) ||
          (order.email && order.email.toLowerCase().includes(q)) ||
          (order.address && order.address.toLowerCase().includes(q)) ||
          order.items.some(it => it.item.name.toLowerCase().includes(q))
        );

        // Status
        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

        // Channel
        const matchesChannel = channelFilter === 'all' || order.orderType === channelFilter;

        // Payment
        const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

        return matchesSearch && matchesStatus && matchesChannel && matchesPayment;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'amount_high') return b.total - a.total;
        if (sortBy === 'amount_low') return a.total - b.total;
        return 0;
      });
  }, [orders, searchQuery, statusFilter, channelFilter, paymentFilter, sortBy]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
    onNotification(`Order #${orderId} moved to ${newStatus}.`);
  };

  const confirmCancelOrder = () => {
    if (!cancelModalOrder) return;
    onUpdateOrderStatus(cancelModalOrder.orderId, 'Cancelled');
    onNotification(`Order #${cancelModalOrder.orderId} was cancelled.`);
    setCancelModalOrder(null);
  };

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'Preparing':
        return 'bg-orange-50 text-orange-950 border-orange-300';
      case 'Ready':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'Out for delivery':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'Completed':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search, Filter Tabs and Secondary Controls */}
      <div className="bg-white border border-stone-200 p-4 rounded-md shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer, phone, item..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-stone-900"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Selectors: Channel & Sort */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Channel filter */}
            <select
              value={channelFilter}
              onChange={e => setChannelFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="delivery">Delivery</option>
              <option value="dine-in">Dine-In</option>
              <option value="pickup">Pickup</option>
            </select>

            {/* Payment filter */}
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="pending">Payment Pending</option>
              <option value="completed">Payment Settled</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount_high">Sort: Highest Amount</option>
              <option value="amount_low">Sort: Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {ORDER_STATUSES.map(st => {
            const count = orders.filter(o => o.orderStatus === st).length;
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{st}</span>
                <span className={`text-[10px] ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table & Detail Drawer Layout */}
      <div className="bg-white border border-stone-200 rounded-md shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  const isSelected = activeOrderDetail?.orderId === order.orderId;
                  const itemSummary = order.items.map(it => `${it.quantity}x ${it.item.name}`).join(', ');

                  return (
                    <tr
                      key={order.orderId}
                      className={`hover:bg-stone-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                      onClick={() => setActiveOrderDetail(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                        #{order.orderId}
                        <div className="text-[10px] text-stone-400 font-sans font-normal mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-stone-900">
                        <div className="font-semibold">{order.customerName}</div>
                        <div className="text-[11px] text-stone-500">{order.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 capitalize">
                        <div className="flex items-center gap-1.5 font-medium text-stone-800">
                          {order.orderType === 'delivery' && <Truck className="w-3.5 h-3.5 text-stone-500" />}
                          {order.orderType === 'dine-in' && <Building2 className="w-3.5 h-3.5 text-stone-500" />}
                          {order.orderType === 'pickup' && <ShoppingBasket className="w-3.5 h-3.5 text-stone-500" />}
                          <span>{order.orderType}</span>
                        </div>
                        {order.tableReference && (
                          <div className="text-[10px] text-stone-500">{order.tableReference}</div>
                        )}
                        {order.area && (
                          <div className="text-[10px] text-stone-500 truncate max-w-[120px]">{order.area}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate" title={itemSummary}>
                        <span className="text-stone-800">{itemSummary}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900 text-right whitespace-nowrap">
                        ৳ {order.total.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'completed' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                          <span className="capitalize text-[11px] font-medium text-stone-700">
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400 capitalize">
                          {order.paymentMethod.replace(/_/g, ' ')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrderDetail(order);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:text-white hover:bg-emerald-900 rounded-sm transition-colors cursor-pointer border border-emerald-800/30"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders match your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span>Click any order row to inspect full modifiers, payment safeguards & dispatch flow</span>
        </div>
      </div>

      {/* Order Details Slide-Over Drawer / Modal */}
      {activeOrderDetail && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
          onClick={() => {
            setActiveOrderDetail(null);
            if (onClearSelectedOrder) onClearSelectedOrder();
          }}
        >
          <div 
            className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-stone-900">
                    #{activeOrderDetail.orderId}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${getStatusBadgeStyle(activeOrderDetail.orderStatus)}`}>
                    {activeOrderDetail.orderStatus}
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Placed on {new Date(activeOrderDetail.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveOrderDetail(null);
                  if (onClearSelectedOrder) onClearSelectedOrder();
                }}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-200 transition-colors"
                aria-label="Close order details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Customer & Fulfillment Info */}
              <div className="bg-stone-50 p-4 rounded-sm border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Customer & Fulfillment Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Guest Name</span>
                    <span className="font-semibold text-stone-900">{activeOrderDetail.customerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Contact Phone</span>
                    <a href={`tel:${activeOrderDetail.phone}`} className="font-semibold text-emerald-800 hover:underline">
                      {activeOrderDetail.phone}
                    </a>
                  </div>
                  {activeOrderDetail.email && (
                    <div>
                      <span className="text-stone-400 block text-[11px]">Email</span>
                      <span className="text-stone-800">{activeOrderDetail.email}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-stone-400 block text-[11px]">Channel</span>
                    <span className="font-semibold text-stone-900 capitalize">{activeOrderDetail.orderType}</span>
                  </div>
                </div>

                {activeOrderDetail.address && (
                  <div className="pt-2 border-t border-stone-200/70 text-xs">
                    <span className="text-stone-400 block text-[11px]">Delivery Destination</span>
                    <span className="text-stone-800">{activeOrderDetail.address}</span>
                    {activeOrderDetail.area && (
                      <span className="text-stone-500 font-medium"> ({activeOrderDetail.area})</span>
                    )}
                  </div>
                )}

                {activeOrderDetail.specialInstructions && (
                  <div className="pt-2 border-t border-stone-200/70 text-xs bg-amber-50/70 p-2 rounded-xs border-amber-200">
                    <span className="font-bold text-amber-900 block text-[11px]">Special Kitchen Instructions</span>
                    <span className="text-amber-950 font-medium">{activeOrderDetail.specialInstructions}</span>
                  </div>
                )}
              </div>

              {/* Itemized Order List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Ordered Items ({activeOrderDetail.items.reduce((s, it) => s + it.quantity, 0)})
                </h4>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-sm">
                  {activeOrderDetail.items.map((cartItem, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 font-mono font-bold flex items-center justify-center text-[11px] shrink-0">
                          {cartItem.quantity}
                        </span>
                        <div>
                          <div className="font-semibold text-stone-900">{cartItem.item.name}</div>
                          <div className="text-stone-500 text-[11px] capitalize">{cartItem.item.category}</div>
                          {cartItem.notes && (
                            <div className="text-amber-800 text-[10px] italic mt-0.5">
                              Note: {cartItem.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-stone-900 shrink-0">
                        ৳ {(cartItem.item.price * cartItem.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Safeguard & Financials */}
              <div className="bg-stone-50 p-4 rounded-sm border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Food Subtotal</span>
                  <span className="font-mono">৳ {activeOrderDetail.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="font-mono">৳ {activeOrderDetail.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span className="font-mono text-base">৳ {activeOrderDetail.total.toLocaleString()}</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Method: <strong className="text-stone-800 capitalize">{activeOrderDetail.paymentMethod.replace(/_/g, ' ')}</strong></span>
                  <span className="flex items-center gap-1 font-medium">
                    Payment Safeguard: 
                    <strong className={activeOrderDetail.paymentStatus === 'completed' ? 'text-emerald-800' : 'text-amber-700'}>
                      {activeOrderDetail.paymentStatus.toUpperCase()}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Status Transition Actions */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Update Operational Status
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {activeOrderDetail.orderStatus === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrderDetail.orderId, 'Confirmed')}
                      className="w-full py-2.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Order</span>
                    </button>
                  )}

                  {(activeOrderDetail.orderStatus === 'Pending' || activeOrderDetail.orderStatus === 'Confirmed') && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrderDetail.orderId, 'Preparing')}
                      className="w-full py-2.5 bg-orange-700 hover:bg-orange-800 text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Send to Kitchen</span>
                    </button>
                  )}

                  {activeOrderDetail.orderStatus === 'Preparing' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrderDetail.orderId, 'Ready')}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Mark Ready</span>
                    </button>
                  )}

                  {activeOrderDetail.orderStatus === 'Ready' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrderDetail.orderId, activeOrderDetail.orderType === 'delivery' ? 'Out for delivery' : 'Completed')}
                      className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{activeOrderDetail.orderType === 'delivery' ? 'Dispatch Courier' : 'Serve & Complete'}</span>
                    </button>
                  )}

                  {activeOrderDetail.orderStatus === 'Out for delivery' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeOrderDetail.orderId, 'Completed')}
                      className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  {/* Cancel Safeguard Button */}
                  {activeOrderDetail.orderStatus !== 'Cancelled' && activeOrderDetail.orderStatus !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => setCancelModalOrder(activeOrderDetail)}
                      className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Cancel Order...</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Safeguard Modal */}
      {cancelModalOrder && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">Confirm Order Cancellation</h4>
                <p className="text-xs text-stone-500">Action is logged in audit records</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to cancel order <strong className="text-stone-900">#{cancelModalOrder.orderId}</strong> for <strong className="text-stone-900">{cancelModalOrder.customerName}</strong> (৳{cancelModalOrder.total.toLocaleString()})? If paid online, a refund alert will be registered.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={confirmCancelOrder}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white rounded-sm transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
