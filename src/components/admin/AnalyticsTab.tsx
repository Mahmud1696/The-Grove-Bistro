import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  PieChart, 
  CreditCard, 
  Clock, 
  Calendar, 
  Truck, 
  Building2, 
  ShoppingBasket,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import { Order, MenuItem } from '../../types';

interface AnalyticsTabProps {
  orders: Order[];
  menuItems: MenuItem[];
}

type DateRange = 'today' | '7days' | '30days' | 'all';

export function AnalyticsTab({ orders, menuItems }: AnalyticsTabProps) {
  const [dateRange, setDateRange] = useState<DateRange>('7days');

  const now = new Date();

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (dateRange === 'today') {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (dateRange === '7days') {
        const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= d;
      }
      if (dateRange === '30days') {
        const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= d;
      }
      return true;
    });
  }, [orders, dateRange]);

  // Aggregate Metrics (Mathematically consistent with Overview & Orders)
  const grossSales = filteredOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const deliveryFees = filteredOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
  const netSales = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const aov = totalOrdersCount > 0 ? Math.round(netSales / totalOrdersCount) : 0;

  const totalItemsSold = filteredOrders.reduce((sum, o) => {
    return sum + o.items.reduce((s, it) => s + (it.quantity || 1), 0);
  }, 0);

  // Category Breakdown
  const categorySales = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach(order => {
      order.items.forEach(it => {
        const cat = it.item.category || 'other';
        if (!map[cat]) map[cat] = { count: 0, revenue: 0 };
        map[cat].count += it.quantity;
        map[cat].revenue += it.quantity * it.item.price;
      });
    });

    const entries = Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue);
    const totalCatRev = entries.reduce((s, [, d]) => s + d.revenue, 0) || 1;

    return entries.map(([cat, data]) => ({
      category: cat,
      count: data.count,
      revenue: data.revenue,
      percent: Math.round((data.revenue / totalCatRev) * 100)
    }));
  }, [filteredOrders]);

  // Dish Performance Ranking
  const topDishes = useMemo(() => {
    const dishMap: Record<string, { name: string; category: string; count: number; revenue: number }> = {};
    filteredOrders.forEach(order => {
      order.items.forEach(it => {
        const id = it.item.id;
        if (!dishMap[id]) {
          dishMap[id] = {
            name: it.item.name,
            category: it.item.category,
            count: 0,
            revenue: 0
          };
        }
        dishMap[id].count += it.quantity;
        dishMap[id].revenue += it.quantity * it.item.price;
      });
    });

    return Object.values(dishMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [filteredOrders]);

  // Fulfillment Channels Comparison
  const channelData = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {
      delivery: { count: 0, revenue: 0 },
      'dine-in': { count: 0, revenue: 0 },
      pickup: { count: 0, revenue: 0 }
    };

    filteredOrders.forEach(o => {
      const ch = o.orderType || 'delivery';
      if (map[ch]) {
        map[ch].count += 1;
        map[ch].revenue += o.total;
      }
    });

    const totalOrders = filteredOrders.length || 1;
    return Object.entries(map).map(([channel, data]) => ({
      channel,
      count: data.count,
      revenue: data.revenue,
      percent: Math.round((data.count / totalOrders) * 100),
      aov: data.count > 0 ? Math.round(data.revenue / data.count) : 0
    }));
  }, [filteredOrders]);

  // Payment Methods Breakdown
  const paymentData = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach(o => {
      const pm = o.paymentMethod || 'cash_on_delivery';
      if (!map[pm]) map[pm] = { count: 0, revenue: 0 };
      map[pm].count += 1;
      map[pm].revenue += o.total;
    });

    const totalRev = filteredOrders.reduce((s, o) => s + o.total, 0) || 1;
    return Object.entries(map).map(([method, d]) => ({
      method: method.replace(/_/g, ' '),
      count: d.count,
      revenue: d.revenue,
      percent: Math.round((d.revenue / totalRev) * 100)
    }));
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      {/* Date Filter & Overview Header */}
      <div className="bg-white border border-stone-200 p-4 rounded-md shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-display text-base font-bold text-stone-900">
            Financial & Operational Intelligence
          </h3>
          <p className="text-xs text-stone-500">
            Revenue reconciliation, dish velocity & channel performance
          </p>
        </div>

        {/* Date Filter Segmented Buttons */}
        <div className="inline-flex items-center p-1 bg-stone-100 rounded-md border border-stone-200">
          <button
            type="button"
            onClick={() => setDateRange('today')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              dateRange === 'today' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setDateRange('7days')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              dateRange === '7days' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setDateRange('30days')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              dateRange === '30days' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setDateRange('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
              dateRange === 'all' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Sales */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Net Sales
          </div>
          <div className="font-serif-display text-2xl font-bold text-stone-900">
            ৳ {netSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Food sales + delivery fees collected
          </div>
        </div>

        {/* Gross Food Sales */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Gross Food Sales
          </div>
          <div className="font-serif-display text-2xl font-bold text-stone-900">
            ৳ {grossSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Across {totalItemsSold} prepared portions
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Orders Processed
          </div>
          <div className="font-serif-display text-2xl font-bold text-stone-900">
            {totalOrdersCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            In selected reporting period
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs">
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
            Average Ticket (AOV)
          </div>
          <div className="font-serif-display text-2xl font-bold text-stone-900">
            ৳ {aov.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Average billing per guest receipt
          </div>
        </div>
      </div>

      {/* Middle Row: Category Performance & Channel Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-serif-display text-sm font-bold text-stone-900">
              Menu Category Sales Distribution
            </h4>
            <p className="text-xs text-stone-500">
              Portion volume and revenue split by culinary section
            </p>
          </div>

          <div className="space-y-3.5">
            {categorySales.map(cat => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 capitalize">
                    {cat.category} ({cat.count} sold)
                  </span>
                  <span className="font-mono font-bold text-stone-900">
                    ৳ {cat.revenue.toLocaleString()} ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1B3B2B] rounded-full"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Channel Comparison */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-serif-display text-sm font-bold text-stone-900">
              Fulfillment Channel Comparison
            </h4>
            <p className="text-xs text-stone-500">
              Delivery vs Dine-in vs Takeaway average ticket size
            </p>
          </div>

          <div className="space-y-3">
            {channelData.map(ch => (
              <div key={ch.channel} className="p-3 bg-stone-50 border border-stone-200 rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-white border border-stone-300 flex items-center justify-center text-stone-700">
                    {ch.channel === 'delivery' && <Truck className="w-4 h-4" />}
                    {ch.channel === 'dine-in' && <Building2 className="w-4 h-4" />}
                    {ch.channel === 'pickup' && <ShoppingBasket className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-stone-900 capitalize">
                      {ch.channel}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {ch.count} orders ({ch.percent}%)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-stone-900">
                    ৳ {ch.revenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    AOV: ৳{ch.aov.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Dish Velocity & Payment Reconciliation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dish Velocity */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-serif-display text-sm font-bold text-stone-900">
              Top Selling Dishes By Revenue
            </h4>
            <p className="text-xs text-stone-500">
              Leading culinary items ranked by gross sales
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {topDishes.map((dish, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900">{dish.name}</div>
                  <div className="text-[11px] text-stone-500 capitalize">{dish.category} · {dish.count} sold</div>
                </div>
                <div className="font-mono font-bold text-stone-900">
                  ৳ {dish.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border border-stone-200 p-5 rounded-md shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-serif-display text-sm font-bold text-stone-900">
              Settlement & Payment Methods
            </h4>
            <p className="text-xs text-stone-500">
              Breakdown of guest payment instruments
            </p>
          </div>

          <div className="space-y-3">
            {paymentData.map((pm, idx) => (
              <div key={idx} className="p-3 rounded-sm border border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900 capitalize">{pm.method}</div>
                  <div className="text-[11px] text-stone-500">{pm.count} transactions ({pm.percent}%)</div>
                </div>
                <div className="font-mono font-bold text-stone-900">
                  ৳ {pm.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
