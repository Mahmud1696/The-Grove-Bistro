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
        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#828F84] mb-3">
            <span className="text-xs uppercase tracking-wider font-medium text-[#A3B899]">
              Total Revenue (BDT)
            </span>
            <div className="w-8 h-8 rounded-full bg-[#243327] flex items-center justify-center text-[#A3B899]">
              <span className="font-serif-display font-bold text-sm">৳</span>
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ৳ {totalAmountSold.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Gross billing across {totalOrders} recorded orders</span>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tl from-[#2D4532]/20 to-transparent pointer-events-none" />
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#828F84] mb-3">
            <span className="text-xs uppercase tracking-wider font-medium text-[#A3B899]">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-full bg-[#243327] flex items-center justify-center text-[#A3B899]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {totalOrders} <span className="text-sm font-normal text-[#828F84]">Tickets</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#828F84] mt-2">
            <span className="text-amber-400 font-medium">{activeOrdersCount} in preparation</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">{completedOrdersCount} fulfilled</span>
          </div>
        </div>

        {/* Metric 3: Total Dishes / Items Sold */}
        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#828F84] mb-3">
            <span className="text-xs uppercase tracking-wider font-medium text-[#A3B899]">
              Total Dishes Sold
            </span>
            <div className="w-8 h-8 rounded-full bg-[#243327] flex items-center justify-center text-[#A3B899]">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {totalDishesSold} <span className="text-sm font-normal text-[#828F84]">Portions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#828F84] mt-2">
            <span>Catalog contains {menuItems.length} active dishes</span>
          </div>
        </div>

        {/* Metric 4: Average Order Value */}
        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#828F84] mb-3">
            <span className="text-xs uppercase tracking-wider font-medium text-[#A3B899]">
              Average Ticket (AOV)
            </span>
            <div className="w-8 h-8 rounded-full bg-[#243327] flex items-center justify-center text-[#A3B899]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ৳ {averageOrderValue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#828F84] mt-2">
            <span>Avg spend per guest / delivery order</span>
          </div>
        </div>
      </div>

      {/* Operational Dispatch Banner */}
      <div className="bg-[#141A15] border border-[#243327] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <span className="font-medium text-white">Hamid Tower Culinary Dispatch:</span>{' '}
            <span className="text-[#A3B899]">
              {activeOrdersCount} in kitchen • {readyOrdersCount} ready for handoff • {completedOrdersCount} fulfilled
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddDish}
            className="px-3.5 py-1.5 bg-[#2D4532] hover:bg-[#39573f] text-white text-xs font-medium uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish to Website</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-1.5 bg-[#1C251E] hover:bg-[#28362B] text-[#C8D1CA] hover:text-white text-xs font-medium uppercase tracking-wider rounded-xs border border-[#2D3F30] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Manage Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Top Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-[#18211A] border border-[#2D3F30] rounded-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#243327] pb-3">
            <div>
              <h3 className="font-serif-display text-base font-semibold text-white">
                Live Kitchen & Delivery Feed
              </h3>
              <p className="text-xs text-[#828F84]">
                Latest incoming customer orders from Dhaka diners
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#A3B899] hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>View All ({orders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentOrders.map(order => (
              <div
                key={order.orderId}
                className="p-4 bg-[#141A15] border border-[#243327] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#384c3c] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-display font-bold text-sm text-white">
                      {order.orderId}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                      order.orderStatus === 'Preparing'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                        : order.orderStatus === 'Confirmed'
                        ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                        : order.orderStatus === 'Ready'
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                        : 'bg-[#243327] text-[#A3B899]'
                    }`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-xs text-[#828F84] capitalize">
                      • {order.orderType} ({order.tableReference || order.area || 'Pickup'})
                    </span>
                  </div>

                  <div className="text-xs text-[#C8D1CA]">
                    <span className="font-medium text-white">{order.customerName}</span> ({order.phone})
                  </div>

                  <div className="text-xs text-[#828F84]">
                    {order.items.map(it => `${it.quantity}x ${it.item.name}`).join(', ')}
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="font-serif-display font-semibold text-base text-white">
                    ৳ {order.total.toLocaleString()}
                  </div>

                  {/* Quick status stepper */}
                  {order.orderStatus === 'Pending' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Confirmed')}
                      className="px-2.5 py-1 text-[11px] bg-[#2D4532] text-white rounded-xs hover:bg-[#39573f] transition-colors cursor-pointer"
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.orderStatus === 'Confirmed' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Preparing')}
                      className="px-2.5 py-1 text-[11px] bg-amber-800 text-white rounded-xs hover:bg-amber-700 transition-colors cursor-pointer"
                    >
                      Start Cooking
                    </button>
                  )}
                  {order.orderStatus === 'Preparing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Ready')}
                      className="px-2.5 py-1 text-[11px] bg-emerald-800 text-white rounded-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.orderStatus === 'Ready' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, order.orderType === 'delivery' ? 'Out for delivery' : 'Completed')}
                      className="px-2.5 py-1 text-[11px] bg-[#2D4532] text-white rounded-xs hover:bg-[#39573f] transition-colors cursor-pointer"
                    >
                      {order.orderType === 'delivery' ? 'Dispatch' : 'Complete'}
                    </button>
                  )}
                  {order.orderStatus === 'Out for delivery' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'Completed')}
                      className="px-2.5 py-1 text-[11px] bg-emerald-700 text-white rounded-xs hover:bg-emerald-600 transition-colors cursor-pointer"
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
        <div className="bg-[#18211A] border border-[#2D3F30] rounded-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#243327] pb-3 mb-4">
              <div>
                <h3 className="font-serif-display text-base font-semibold text-white">
                  Top Performing Dishes
                </h3>
                <p className="text-xs text-[#828F84]">
                  Best sellers ranked by order volume
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('dishes')}
                className="text-xs text-[#A3B899] hover:text-white transition-colors"
              >
                Dishes
              </button>
            </div>

            <div className="space-y-3">
              {topDishes.length === 0 ? (
                <div className="text-xs text-[#828F84] py-6 text-center">
                  Order items will generate popularity statistics here.
                </div>
              ) : (
                topDishes.map((dish, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 bg-[#141A15] border border-[#243327] rounded-xs"
                  >
                    <div className="font-serif-display font-bold text-xs text-[#828F84] w-4 text-center">
                      #{i + 1}
                    </div>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-10 h-10 object-cover rounded-xs border border-[#243327] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-white truncate">
                        {dish.name}
                      </div>
                      <div className="text-[11px] text-[#828F84]">
                        {dish.count} sold • ৳ {dish.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#243327]">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="w-full py-2.5 bg-[#243327] hover:bg-[#2e4032] text-xs text-[#E4EDE6] hover:text-white rounded-xs border border-[#2D3F30] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#A3B899]" />
              <span>Explore Detailed Sales Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
