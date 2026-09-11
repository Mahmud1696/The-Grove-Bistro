import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  UtensilsCrossed, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  DollarSign, 
  AlertCircle,
  Truck,
  ChefHat
} from 'lucide-react';
import { Order, OrderStatus, MenuItem } from '../../types';

interface AdminDashboardTabProps {
  orders: Order[];
  menuItems: MenuItem[];
  onNavigateTab: (tab: 'dashboard' | 'orders' | 'dishes' | 'analytics' | 'reservations') => void;
  onOpenAddDish: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export function AdminDashboardTab({
  orders,
  menuItems,
  onNavigateTab,
  onOpenAddDish,
  onUpdateOrderStatus
}: AdminDashboardTabProps) {
  // Financial & Operational Metrics
  const totalAmountSold = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  
  const totalDishesSold = orders.reduce((sum, o) => {
    return sum + o.items.reduce((itemSum, it) => itemSum + (it.quantity || 1), 0);
  }, 0);

  const averageOrderValue = totalOrders > 0 ? Math.round(totalAmountSold / totalOrders) : 0;

  // Active status counts
  const activeOrdersCount = orders.filter(
    o => ['Pending', 'Confirmed', 'Preparing'].includes(o.orderStatus)
  ).length;

  const readyOrdersCount = orders.filter(
    o => ['Ready', 'Out for delivery'].includes(o.orderStatus)
  ).length;

  const completedOrdersCount = orders.filter(o => o.orderStatus === 'Completed').length;

  // Popular items calculated from orders
  const itemSalesMap: Record<string, { name: string; category: string; count: number; revenue: number; image: string }> = {};
  orders.forEach(order => {
    order.items.forEach(it => {
      const id = it.item.id;
      if (!itemSalesMap[id]) {
        itemSalesMap[id] = {
          name: it.item.name,
          category: it.item.category,
          count: 0,
          revenue: 0,
          image: it.item.image
        };
      }
      itemSalesMap[id].count += it.quantity;
      itemSalesMap[id].revenue += it.quantity * it.item.price;
    });
  });

  const topDishes = Object.values(itemSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const recentOrders = [...orders].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 4 Primary Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Amount Sold */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-600">
              Total Revenue (BDT)
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
              <span className="font-serif-display font-bold text-sm">৳</span>
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            ৳ {totalAmountSold.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Gross billing across {totalOrders} recorded orders</span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-600">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {totalOrders} <span className="text-sm font-normal text-gray-500">Tickets</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
            <span className="text-amber-700 font-semibold">{activeOrdersCount} in kitchen</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{completedOrdersCount} fulfilled</span>
          </div>
        </div>

        {/* Metric 3: Total Dishes / Items Sold */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-600">
              Total Dishes Sold
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {totalDishesSold} <span className="text-sm font-normal text-gray-500">Portions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
            <span>Catalog contains {menuItems.length} active dishes</span>
          </div>
        </div>

        {/* Metric 4: Average Order Value */}
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-600">
              Average Ticket (AOV)
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            ৳ {averageOrderValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
            <span>Avg spend per guest / delivery order</span>
          </div>
        </div>
      </div>

      {/* Operational Dispatch Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
          <div className="text-xs">
            <span className="font-bold text-gray-900">Hamid Tower Culinary Dispatch:</span>{' '}
            <span className="text-gray-700 font-medium">
              {activeOrdersCount} in kitchen • {readyOrdersCount} ready for handoff • {completedOrdersCount} fulfilled
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddDish}
            className="px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish to Website</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold uppercase tracking-wider rounded-xs border border-gray-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Manage Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Top Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-serif-display text-base font-bold text-gray-900">
                Live Kitchen & Delivery Feed
              </h3>
              <p className="text-xs text-gray-500">
                Latest incoming customer orders from Dhaka diners
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-gray-700 hover:text-black flex items-center gap-1 font-semibold transition-colors"
            >
              <span>View All ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentOrders.map(order => (
              <div
                key={order.orderId}
                className="p-4 bg-gray-50/70 border border-gray-200 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 hover:bg-white transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-display font-bold text-sm text-gray-900">
                      {order.orderId}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                      order.orderStatus === 'Preparing'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : order.orderStatus === 'Confirmed'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : order.orderStatus === 'Ready'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-gray-200 text-gray-800 border-gray-300'
                    }`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-xs text-gray-600 font-medium capitalize">
                      • {order.orderType} ({order.tableReference || order.area || 'Pickup'})
                    </span>
                  </div>

                  <div className="text-xs text-gray-800">
                    <span className="font-semibold text-gray-900">{order.customerName}</span> ({order.phone})
                  </div>

                  <div className="text-xs text-gray-600">
                    {order.items.map(it => `${it.quantity}x ${it.item.name}`).join(', ')}
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="font-serif-display font-bold text-base text-gray-900">
                    ৳ {order.total.toLocaleString()}
                  </div>

                  {/* Quick status stepper */}
                  {order.orderStatus === 'Pending' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Confirmed')}
                      className="px-2.5 py-1 text-[11px] bg-gray-900 text-white rounded-xs hover:bg-black transition-colors cursor-pointer font-medium"
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.orderStatus === 'Confirmed' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Preparing')}
                      className="px-2.5 py-1 text-[11px] bg-amber-600 text-white rounded-xs hover:bg-amber-700 transition-colors cursor-pointer font-medium"
                    >
                      Start Cooking
                    </button>
                  )}
                  {order.orderStatus === 'Preparing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Ready')}
                      className="px-2.5 py-1 text-[11px] bg-emerald-700 text-white rounded-xs hover:bg-emerald-800 transition-colors cursor-pointer font-medium"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.orderStatus === 'Ready' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, order.orderType === 'delivery' ? 'Out for delivery' : 'Completed')}
                      className="px-2.5 py-1 text-[11px] bg-gray-900 text-white rounded-xs hover:bg-black transition-colors cursor-pointer font-medium"
                    >
                      {order.orderType === 'delivery' ? 'Dispatch' : 'Complete'}
                    </button>
                  )}
                  {order.orderStatus === 'Out for delivery' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Completed')}
                      className="px-2.5 py-1 text-[11px] bg-emerald-700 text-white rounded-xs hover:bg-emerald-800 transition-colors cursor-pointer font-medium"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Dishes (1 Column) */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <h3 className="font-serif-display text-base font-bold text-gray-900">
                  Top Performing Dishes
                </h3>
                <p className="text-xs text-gray-500">
                  Best sellers ranked by order volume
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('dishes')}
                className="text-xs text-gray-700 hover:text-black font-semibold transition-colors"
              >
                Dishes
              </button>
            </div>

            <div className="space-y-3">
              {topDishes.length === 0 ? (
                <div className="text-xs text-gray-500 py-6 text-center">
                  Order items will generate popularity statistics here.
                </div>
              ) : (
                topDishes.map((dish, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-xs"
                  >
                    <div className="font-serif-display font-bold text-xs text-gray-500 w-4 text-center">
                      #{i + 1}
                    </div>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-10 h-10 object-cover rounded-xs border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-gray-900 truncate">
                        {dish.name}
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {dish.count} sold • ৳ {dish.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-xs text-gray-900 rounded-xs border border-gray-200 font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5 text-gray-700" />
              <span>Explore Detailed Sales Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
