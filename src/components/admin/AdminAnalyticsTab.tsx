import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  UtensilsCrossed, 
  PieChart, 
  MapPin, 
  CreditCard, 
  Clock, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Order, MenuItem } from '../../types';

interface AdminAnalyticsTabProps {
  orders: Order[];
  menuItems: MenuItem[];
}

export function AdminAnalyticsTab({ orders, menuItems }: AdminAnalyticsTabProps) {
  // Aggregate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalItemSales = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const totalDeliveryFees = orders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
  const totalOrders = orders.length;

  const totalDishesSold = orders.reduce((sum, o) => {
    return sum + o.items.reduce((acc, it) => acc + (it.quantity || 1), 0);
  }, 0);

  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Category Breakdown
  const categorySalesMap: Record<string, { count: number; revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(it => {
      const cat = it.item.category || 'other';
      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { count: 0, revenue: 0 };
      }
      categorySalesMap[cat].count += it.quantity;
      categorySalesMap[cat].revenue += it.quantity * it.item.price;
    });
  });

  const categoryEntries = Object.entries(categorySalesMap).sort((a, b) => b[1].revenue - a[1].revenue);

  // Fulfillment Channel Breakdown
  const channelMap: Record<string, { count: number; revenue: number }> = {
    delivery: { count: 0, revenue: 0 },
    pickup: { count: 0, revenue: 0 },
    'dine-in': { count: 0, revenue: 0 }
  };
  orders.forEach(order => {
    const ch = order.orderType || 'delivery';
    if (channelMap[ch]) {
      channelMap[ch].count += 1;
      channelMap[ch].revenue += order.total;
    }
  });

  // Top Dishes Sold
  const dishSalesMap: Record<string, { name: string; category: string; count: number; revenue: number; image: string }> = {};
  orders.forEach(order => {
    order.items.forEach(it => {
      const id = it.item.id;
      if (!dishSalesMap[id]) {
        dishSalesMap[id] = {
          name: it.item.name,
          category: it.item.category,
          count: 0,
          revenue: 0,
          image: it.item.image
        };
      }
      dishSalesMap[id].count += it.quantity;
      dishSalesMap[id].revenue += it.quantity * it.item.price;
    });
  });

  const rankedDishes = Object.values(dishSalesMap).sort((a, b) => b.revenue - a.revenue);

  // Payment Breakdown
  const onlinePaymentsCount = orders.filter(o => o.paymentMethod === 'online_payment').length;
  const cashPaymentsCount = orders.filter(o => o.paymentMethod !== 'online_payment').length;

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#A3B899] mb-1">
            Gross BDT Turnover
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
            ৳ {totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-[#828F84] mt-2">
            Inclusive of food & Dhaka delivery surcharge
          </p>
        </div>

        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#A3B899] mb-1">
            Food & Beverage Subtotal
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
            ৳ {totalItemSales.toLocaleString()}
          </div>
          <p className="text-xs text-[#828F84] mt-2">
            Net menu revenue across {totalDishesSold} dishes
          </p>
        </div>

        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#A3B899] mb-1">
            Total Dishes Sold
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
            {totalDishesSold} <span className="text-sm font-normal text-[#828F84]">Dishes</span>
          </div>
          <p className="text-xs text-[#828F84] mt-2">
            {menuItems.length} items in active catalog
          </p>
        </div>

        <div className="bg-[#18211A] border border-[#2D3F30] p-5 rounded-sm">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#A3B899] mb-1">
            Average Ticket Spend
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
            ৳ {aov.toLocaleString()}
          </div>
          <p className="text-xs text-[#828F84] mt-2">
            Per customer transaction across {totalOrders} orders
          </p>
        </div>
      </div>

      {/* Two Column Layout: Category Sales & Fulfillment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-[#18211A] border border-[#2D3F30] rounded-sm p-5 space-y-4">
          <div className="border-b border-[#243327] pb-3">
            <h3 className="font-serif-display text-base font-semibold text-white">
              Revenue by Menu Category
            </h3>
            <p className="text-xs text-[#828F84]">
              Performance distribution across culinary sections
            </p>
          </div>

          {/* Visual Bar Distribution */}
          <div className="space-y-3">
            {categoryEntries.map(([cat, data]) => {
              const percent = totalItemSales > 0 ? Math.round((data.revenue / totalItemSales) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-white capitalize">{cat.replace('-', ' ')}</span>
                    <span className="text-[#A3B899]">
                      ৳ {data.revenue.toLocaleString()} <span className="text-[#828F84]">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#121713] rounded-full overflow-hidden border border-[#243327]">
                    <div
                      className="h-full bg-gradient-to-r from-[#2D4532] to-[#4B6E52] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, 4)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#828F84]">
                    {data.count} items sold
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fulfillment Channels & Payment Stats */}
        <div className="bg-[#18211A] border border-[#2D3F30] rounded-sm p-5 space-y-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#243327] pb-3 mb-4">
              <h3 className="font-serif-display text-base font-semibold text-white">
                Fulfillment Channels & Logistics
              </h3>
              <p className="text-xs text-[#828F84]">
                Order volume and revenue split by service type
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-5">
              <div className="p-3 bg-[#141A15] border border-[#243327] rounded-xs">
                <div className="text-[10px] uppercase tracking-wider text-[#A3B899] font-medium">
                  Delivery
                </div>
                <div className="font-serif-display font-bold text-lg text-white mt-0.5">
                  {channelMap.delivery.count}
                </div>
                <div className="text-[11px] text-[#828F84]">
                  ৳ {channelMap.delivery.revenue.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-[#141A15] border border-[#243327] rounded-xs">
                <div className="text-[10px] uppercase tracking-wider text-[#A3B899] font-medium">
                  Dine-In
                </div>
                <div className="font-serif-display font-bold text-lg text-white mt-0.5">
                  {channelMap['dine-in'].count}
                </div>
                <div className="text-[11px] text-[#828F84]">
                  ৳ {channelMap['dine-in'].revenue.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-[#141A15] border border-[#243327] rounded-xs">
                <div className="text-[10px] uppercase tracking-wider text-[#A3B899] font-medium">
                  Pickup
                </div>
                <div className="font-serif-display font-bold text-lg text-white mt-0.5">
                  {channelMap.pickup.count}
                </div>
                <div className="text-[11px] text-[#828F84]">
                  ৳ {channelMap.pickup.revenue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Payment Distribution */}
            <div className="p-3.5 bg-[#141A15] border border-[#243327] rounded-xs space-y-2">
              <div className="text-xs font-semibold text-[#A3B899] uppercase tracking-wider">
                Payment Method Split
              </div>
              <div className="flex justify-between text-xs text-[#C8D1CA]">
                <span>Online (bKash, Nagad, Visa, Mastercard)</span>
                <span className="text-white font-medium">{onlinePaymentsCount} ({totalOrders > 0 ? Math.round((onlinePaymentsCount / totalOrders) * 100) : 0}%)</span>
              </div>
              <div className="flex justify-between text-xs text-[#C8D1CA]">
                <span>Cash on Delivery / Pay at Restaurant</span>
                <span className="text-white font-medium">{cashPaymentsCount} ({totalOrders > 0 ? Math.round((cashPaymentsCount / totalOrders) * 100) : 0}%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#243327] text-[11px] text-[#828F84] flex items-center justify-between">
            <span>Primary Delivery Radius: Gulshan, Banani, Baridhara</span>
            <span className="text-emerald-400">● Real-time Active</span>
          </div>
        </div>
      </div>

      {/* Ranked Dishes Leaderboard */}
      <div className="bg-[#18211A] border border-[#2D3F30] rounded-sm p-5 space-y-4">
        <div className="border-b border-[#243327] pb-3">
          <h3 className="font-serif-display text-base font-semibold text-white">
            Comprehensive Dishes Leaderboard
          </h3>
          <p className="text-xs text-[#828F84]">
            Ranking all ordered culinary offerings by turnover and volume
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#243327] text-[#828F84] uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Dish</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Gross Sales (BDT)</th>
                <th className="py-2.5 px-3 text-right">Share of Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243327] text-[#C8D1CA]">
              {rankedDishes.map((dish, i) => {
                const share = totalItemSales > 0 ? Math.round((dish.revenue / totalItemSales) * 100) : 0;
                return (
                  <tr key={i} className="hover:bg-[#141A15] transition-colors">
                    <td className="py-3 px-3 font-serif-display font-bold text-white">
                      #{i + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-8 h-8 rounded-xs object-cover border border-[#243327]"
                        />
                        <span className="font-medium text-white">{dish.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 uppercase tracking-wider text-[10px] text-[#A3B899]">
                      {dish.category}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-white">
                      {dish.count}
                    </td>
                    <td className="py-3 px-3 text-right font-serif-display font-bold text-emerald-400">
                      ৳ {dish.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-[#828F84]">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
