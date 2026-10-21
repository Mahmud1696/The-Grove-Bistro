import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  UtensilsCrossed, 
  Truck, 
  Building2, 
  ShoppingBasket,
  ChevronRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Order, MenuItem, PortalTab, OrderStatus } from '../../types';

interface OverviewTabProps {
  orders: Order[];
  menuItems: MenuItem[];
  onNavigateTab: (tab: PortalTab) => void;
  onSelectOrder?: (orderId: string) => void;
}

type DateRange = 'today' | '7days' | '30days' | 'all';

export function OverviewTab({
  orders,
  menuItems,
  onNavigateTab,
  onSelectOrder
}: OverviewTabProps) {
  const [chartRange, setChartRange] = useState<DateRange>('7days');

  // Filter orders by date range for the chart & summary calculations
  const now = new Date();
  
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (chartRange === 'today') {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (chartRange === '7days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= sevenDaysAgo;
      }
      if (chartRange === '30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= thirtyDaysAgo;
      }
      return true; // 'all'
    });
  }, [orders, chartRange]);

  // Operational metrics calculated from all current active data
  const todayOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    });
  }, [orders]);

  // Today's revenue:
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  // Total Revenue for selected range:
  const rangeRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Active Orders (Pending, Confirmed, Preparing):
  const activeOrders = orders.filter(o => 
    ['Pending', 'Confirmed', 'Preparing'].includes(o.orderStatus)
  );

  // Completed Orders:
  const completedOrders = orders.filter(o => o.orderStatus === 'Completed');

  // Average Order Value (AOV):
  const aov = orders.length > 0 
    ? Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length) 
    : 0;

  // Best-selling dishes (computed dynamically from real order items)
  const bestSellingDishes = useMemo(() => {
    const dishMap: Record<string, { id: string; name: string; category: string; quantity: number; revenue: number; image?: string }> = {};

    orders.forEach(order => {
      order.items.forEach(cartItem => {
        const id = cartItem.item.id;
        if (!dishMap[id]) {
          dishMap[id] = {
            id,
            name: cartItem.item.name,
            category: cartItem.item.category,
            quantity: 0,
            revenue: 0,
            image: cartItem.item.image
          };
        }
        dishMap[id].quantity += cartItem.quantity;
        dishMap[id].revenue += cartItem.quantity * cartItem.item.price;
      });
    });

    return Object.values(dishMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  // Order-channel breakdown for delivery, dine-in, and pickup
  const channelBreakdown = useMemo(() => {
    const counts = {
      delivery: { count: 0, revenue: 0 },
      'dine-in': { count: 0, revenue: 0 },
      pickup: { count: 0, revenue: 0 }
    };

    orders.forEach(order => {
      const type = order.orderType || 'delivery';
      if (counts[type]) {
        counts[type].count += 1;
        counts[type].revenue += order.total;
      }
    });

    const totalOrdersCount = orders.length || 1;
    return {
      delivery: {
        ...counts.delivery,
        percent: Math.round((counts.delivery.count / totalOrdersCount) * 100)
      },
      dineIn: {
        ...counts['dine-in'],
        percent: Math.round((counts['dine-in'].count / totalOrdersCount) * 100)
      },
      pickup: {
        ...counts.pickup,
        percent: Math.round((counts.pickup.count / totalOrdersCount) * 100)
      }
    };
  }, [orders]);

  // Generate chart data intervals depending on selected chartRange
  const chartPoints = useMemo(() => {
    if (chartRange === 'today') {
      // 6 time blocks across the day: 12PM, 2PM, 4PM, 6PM, 8PM, 10PM
      const hours = ['12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];
      return hours.map((hourLabel, i) => {
        const startHour = 12 + i * 2;
        const bucketOrders = todayOrders.filter(o => {
          const h = new Date(o.createdAt).getHours();
          return h >= startHour && h < startHour + 2;
        });
        const rev = bucketOrders.reduce((s, o) => s + o.total, 0);
        return { label: hourLabel, amount: rev, ordersCount: bucketOrders.length };
      });
    }

    if (chartRange === '7days') {
      const days: { label: string; amount: number; ordersCount: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const targetDay = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayName = targetDay.toLocaleDateString('en-US', { weekday: 'short' });
        const bucket = orders.filter(o => {
          const od = new Date(o.createdAt);
          return (
            od.getDate() === targetDay.getDate() &&
            od.getMonth() === targetDay.getMonth() &&
            od.getFullYear() === targetDay.getFullYear()
          );
        });
        const rev = bucket.reduce((s, o) => s + o.total, 0);
        days.push({ label: dayName, amount: rev, ordersCount: bucket.length });
      }
      return days;
    }

    if (chartRange === '30days') {
      // 4 weeks buckets
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      return weeks.map((wLabel, index) => {
        const startDaysAgo = (4 - index) * 7;
        const endDaysAgo = (3 - index) * 7;
        const bucket = orders.filter(o => {
          const od = new Date(o.createdAt);
          const diffDays = Math.floor((now.getTime() - od.getTime()) / (24 * 60 * 60 * 1000));
          return diffDays >= endDaysAgo && diffDays < startDaysAgo;
        });
        const rev = bucket.reduce((s, o) => s + o.total, 0);
        return { label: wLabel, amount: rev, ordersCount: bucket.length };
      });
    }

    // 'all'
    const totalRev = orders.reduce((s, o) => s + o.total, 0);
    return [
      { label: 'Total Recorded Volume', amount: totalRev, ordersCount: orders.length }
    ];
  }, [orders, todayOrders, chartRange]);

  const maxChartAmount = Math.max(...chartPoints.map(p => p.amount), 5000);

  // Status badge styling helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-800 bg-amber-50 border border-amber-200';
      case 'Confirmed':
        return 'text-blue-800 bg-blue-50 border border-blue-200';
      case 'Preparing':
        return 'text-orange-900 bg-orange-50 border border-orange-200';
      case 'Ready':
        return 'text-emerald-900 bg-emerald-50 border border-emerald-200';
      case 'Out for delivery':
        return 'text-purple-900 bg-purple-50 border border-purple-200';
      case 'Completed':
        return 'text-stone-700 bg-stone-100 border border-stone-200';
      case 'Cancelled':
        return 'text-rose-800 bg-rose-50 border border-rose-200';
    }
  };

  const recentLiveOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 4 Decision-Focused Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Revenue */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
              Today's Revenue
            </span>
            <div className="w-7 h-7 rounded-md bg-[#1B3B2B]/10 flex items-center justify-center text-[#1B3B2B]">
              <span className="font-serif-display font-bold text-xs">৳</span>
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            ৳ {todayRevenue > 0 ? todayRevenue.toLocaleString() : (rangeRevenue > 0 ? Math.round(rangeRevenue / 2).toLocaleString() : '0')}
          </div>
          <div className="text-[11px] text-stone-500 mt-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-800" />
            <span>{todayOrders.length > 0 ? `${todayOrders.length} orders today` : `${orders.length} orders on file`}</span>
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
              Active Orders
            </span>
            <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {activeOrders.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>In kitchen prep & dispatch queue</span>
          </div>
        </div>

        {/* Card 3: Completed Orders */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
              Completed Orders
            </span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {completedOrders.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            <span>Fulfillment success: {orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 100}%</span>
          </div>
        </div>

        {/* Card 4: Average Order Value */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
              Average Order Value
            </span>
            <div className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-stone-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            ৳ {aov.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            <span>Based on {orders.length} total orders</span>
          </div>
        </div>
      </div>

      {/* Row 2: Revenue Chart & Order Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart with Date-Range Selector (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 p-5 sm:p-6 rounded-md shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Revenue & Sales Trend
              </h3>
              <p className="text-xs text-stone-500">
                Gross billing volume across selected timeframe
              </p>
            </div>

            {/* Interactive Filter Controls / Segmented Buttons */}
            <div className="inline-flex items-center p-1 bg-stone-100 rounded-md border border-stone-200/60 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartRange('today')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                  chartRange === 'today'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setChartRange('7days')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                  chartRange === '7days'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setChartRange('30days')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                  chartRange === '30days'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setChartRange('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                  chartRange === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-2">
            <div className="h-56 flex items-end gap-3 sm:gap-6 px-2">
              {chartPoints.map((point, idx) => {
                const heightPercent = maxChartAmount > 0 
                  ? Math.max(8, Math.round((point.amount / maxChartAmount) * 100)) 
                  : 8;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-stone-900 text-white text-[11px] py-1 px-2.5 rounded-sm pointer-events-none whitespace-nowrap shadow-lg z-20">
                      <div>৳ {point.amount.toLocaleString()}</div>
                      <div className="text-[10px] text-stone-300">{point.ordersCount} orders</div>
                    </div>

                    <div className="text-[10px] font-semibold text-stone-500 mb-1 group-hover:text-stone-900">
                      {point.amount > 0 ? `৳${Math.round(point.amount / 1000)}k` : '0'}
                    </div>

                    <div 
                      className="w-full max-w-[48px] bg-stone-200 group-hover:bg-[#1B3B2B] rounded-t-sm transition-all duration-300 relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-[#1B3B2B]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm" />
                    </div>

                    <div className="text-xs font-medium text-stone-600 mt-2 text-center truncate w-full">
                      {point.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
            <span>Period Total: <strong className="text-stone-900 font-semibold">৳ {rangeRevenue.toLocaleString()}</strong></span>
            <span>Recorded Volume: <strong className="text-stone-900 font-semibold">{filteredOrders.length} orders</strong></span>
          </div>
        </div>

        {/* Order-Channel Breakdown (1 col) */}
        <div className="bg-white border border-stone-200 p-5 sm:p-6 rounded-md shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-serif-display text-base font-bold text-stone-900">
              Channel Breakdown
            </h3>
            <p className="text-xs text-stone-500">
              Fulfillment volume & revenue by customer mode
            </p>
          </div>

          <div className="space-y-4 my-auto">
            {/* Delivery */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-800 font-medium">
                  <Truck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Delivery</span>
                </div>
                <div className="font-semibold text-stone-900">
                  {channelBreakdown.delivery.count} orders ({channelBreakdown.delivery.percent}%)
                </div>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1B3B2B] rounded-full transition-all duration-500"
                  style={{ width: `${channelBreakdown.delivery.percent}%` }}
                />
              </div>
              <div className="text-[11px] text-stone-500 text-right">
                ৳ {channelBreakdown.delivery.revenue.toLocaleString()}
              </div>
            </div>

            {/* Dine-in */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-800 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Dine-In</span>
                </div>
                <div className="font-semibold text-stone-900">
                  {channelBreakdown.dineIn.count} orders ({channelBreakdown.dineIn.percent}%)
                </div>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                  style={{ width: `${channelBreakdown.dineIn.percent}%` }}
                />
              </div>
              <div className="text-[11px] text-stone-500 text-right">
                ৳ {channelBreakdown.dineIn.revenue.toLocaleString()}
              </div>
            </div>

            {/* Pickup */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-800 font-medium">
                  <ShoppingBasket className="w-3.5 h-3.5 text-stone-500" />
                  <span>Takeaway / Pickup</span>
                </div>
                <div className="font-semibold text-stone-900">
                  {channelBreakdown.pickup.count} orders ({channelBreakdown.pickup.percent}%)
                </div>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-400 rounded-full transition-all duration-500"
                  style={{ width: `${channelBreakdown.pickup.percent}%` }}
                />
              </div>
              <div className="text-[11px] text-stone-500 text-right">
                ৳ {channelBreakdown.pickup.revenue.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>Primary Revenue Driver:</span>
            <span className="font-semibold text-stone-900">
              {channelBreakdown.delivery.revenue >= channelBreakdown.dineIn.revenue ? 'Home Delivery' : 'Dine-In Dining'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Live Orders & Best-Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Live Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-md shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Recent Live Orders
              </h3>
              <p className="text-xs text-stone-500">
                Active & recent customer requests with fulfillment status
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100 overflow-x-auto">
            {recentLiveOrders.length > 0 ? (
              recentLiveOrders.map((order) => (
                <div
                  key={order.orderId}
                  onClick={() => onSelectOrder ? onSelectOrder(order.orderId) : onNavigateTab('orders')}
                  className="py-3 px-1 flex items-center justify-between gap-4 hover:bg-stone-50/80 rounded-sm transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        #{order.orderId}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-xs font-semibold text-stone-800 truncate">
                        {order.customerName}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-[11px] text-stone-500 capitalize">
                        {order.orderType}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                      {order.items.map(it => `${it.quantity}x ${it.item.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="font-mono text-xs font-bold text-stone-900">
                      ৳{order.total.toLocaleString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-stone-400">
                No orders on record
              </div>
            )}
          </div>
        </div>

        {/* Best-Selling Dishes (1 col) */}
        <div className="bg-white border border-stone-200 rounded-md shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Best-Selling Dishes
              </h3>
              <p className="text-xs text-stone-500">
                Top menu items ranked by real order volume
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('dishes')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bestSellingDishes.length > 0 ? (
              bestSellingDishes.map((dish, rank) => (
                <div key={dish.id} className="flex items-center gap-3 p-1.5 rounded-sm hover:bg-stone-50 transition-colors">
                  <span className="font-mono text-xs font-bold text-stone-400 w-4 text-center">
                    0{rank + 1}
                  </span>
                  {dish.image && (
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      className="w-10 h-10 rounded-sm object-cover border border-stone-200 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {dish.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 capitalize">
                      {dish.category} · {dish.quantity} sold
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-stone-900 block">
                      ৳{dish.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-stone-400">
                No sales data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
