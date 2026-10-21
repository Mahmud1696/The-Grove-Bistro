import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  FileSpreadsheet, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  CheckCircle2, 
  XCircle,
  Clock
} from 'lucide-react';
import { Order, MenuItem, Reservation } from '../../types';

interface ReportsTabProps {
  orders: Order[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  onNotification: (msg: string) => void;
}

type ReportType = 
  | 'sales_summary' 
  | 'orders_fulfillment' 
  | 'menu_performance' 
  | 'cancellations' 
  | 'bookings' 
  | 'payment_reconciliation';

export function ReportsTab({
  orders,
  menuItems,
  reservations,
  onNotification
}: ReportsTabProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType>('sales_summary');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');

  const now = new Date();

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const d = new Date(o.createdAt);
      if (dateFilter === 'today') {
        return d.toDateString() === now.toDateString();
      }
      if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        return d >= weekAgo;
      }
      if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 86400000);
        return d >= monthAgo;
      }
      return true;
    });
  }, [orders, dateFilter]);

  // Filter reservations by date range
  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      const d = new Date(r.createdAt);
      if (dateFilter === 'today') {
        return d.toDateString() === now.toDateString();
      }
      if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        return d >= weekAgo;
      }
      if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 86400000);
        return d >= monthAgo;
      }
      return true;
    });
  }, [reservations, dateFilter]);

  // Key metrics
  const totalGross = filteredOrders.reduce((s, o) => s + o.subtotal, 0);
  const totalDelivery = filteredOrders.reduce((s, o) => s + o.deliveryFee, 0);
  const totalNet = filteredOrders.reduce((s, o) => s + o.total, 0);
  const completedOrders = filteredOrders.filter(o => o.orderStatus === 'Completed');
  const cancelledOrders = filteredOrders.filter(o => o.orderStatus === 'Cancelled');

  // CSV Generator
  const handleExportCSV = () => {
    let csvRows: string[][] = [];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let filename = `Grove_Bistro_Report_${selectedReport}_${timestamp}.csv`;

    if (selectedReport === 'sales_summary' || selectedReport === 'orders_fulfillment') {
      csvRows.push(['Order ID', 'Customer Name', 'Phone', 'Channel', 'Subtotal (BDT)', 'Delivery Fee (BDT)', 'Total (BDT)', 'Payment Method', 'Payment Status', 'Order Status', 'Created At']);
      filteredOrders.forEach(o => {
        csvRows.push([
          o.orderId,
          `"${o.customerName}"`,
          o.phone,
          o.orderType,
          o.subtotal.toString(),
          o.deliveryFee.toString(),
          o.total.toString(),
          o.paymentMethod,
          o.paymentStatus,
          o.orderStatus,
          o.createdAt
        ]);
      });
    } else if (selectedReport === 'menu_performance') {
      csvRows.push(['Dish ID', 'Dish Name', 'Category', 'Unit Price (BDT)', 'Quantity Sold', 'Gross Revenue (BDT)', 'Available']);
      const map: Record<string, { name: string; category: string; price: number; count: number; rev: number; avail: boolean }> = {};
      menuItems.forEach(m => {
        map[m.id] = { name: m.name, category: m.category, price: m.price, count: 0, rev: 0, avail: m.available };
      });
      filteredOrders.forEach(o => {
        o.items.forEach(it => {
          if (map[it.item.id]) {
            map[it.item.id].count += it.quantity;
            map[it.item.id].rev += it.quantity * it.item.price;
          }
        });
      });
      Object.entries(map).forEach(([id, d]) => {
        csvRows.push([id, `"${d.name}"`, d.category, d.price.toString(), d.count.toString(), d.rev.toString(), d.avail ? 'In Stock' : 'Out of Stock']);
      });
    } else if (selectedReport === 'cancellations') {
      csvRows.push(['Order ID', 'Customer Name', 'Phone', 'Amount (BDT)', 'Channel', 'Payment Status', 'Created At']);
      cancelledOrders.forEach(o => {
        csvRows.push([o.orderId, `"${o.customerName}"`, o.phone, o.total.toString(), o.orderType, o.paymentStatus, o.createdAt]);
      });
    } else if (selectedReport === 'bookings') {
      csvRows.push(['Reference #', 'Guest Name', 'Phone', 'Email', 'Date', 'Time', 'Guests', 'Table', 'Occasion', 'Status']);
      filteredReservations.forEach(r => {
        csvRows.push([
          r.referenceNumber,
          `"${r.name}"`,
          r.phone,
          r.email || '',
          r.date,
          r.time,
          r.guests.toString(),
          `"${r.tableNumber || 'Unassigned'}"`,
          `"${r.occasion}"`,
          r.status
        ]);
      });
    } else if (selectedReport === 'payment_reconciliation') {
      csvRows.push(['Order ID', 'Payment Method', 'Settlement Status', 'Food Subtotal', 'Delivery Surcharge', 'Gross Collected', 'Date']);
      filteredOrders.forEach(o => {
        csvRows.push([
          o.orderId,
          o.paymentMethod,
          o.paymentStatus,
          o.subtotal.toString(),
          o.deliveryFee.toString(),
          o.total.toString(),
          o.createdAt
        ]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onNotification(`Downloaded ${filename} successfully.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getReportTitle = (type: ReportType) => {
    switch (type) {
      case 'sales_summary':
        return 'Sales & Revenue Summary';
      case 'orders_fulfillment':
        return 'Orders & Fulfillment Log';
      case 'menu_performance':
        return 'Menu Item Velocity & Performance';
      case 'cancellations':
        return 'Cancellations & Waste Audit';
      case 'bookings':
        return 'Table Bookings & Guest Attendance';
      case 'payment_reconciliation':
        return 'Payment Reconciliation';
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls & Selector */}
      <div className="bg-white border border-stone-200 p-4 rounded-md shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif-display text-base font-bold text-stone-900">
              Executive Operational Reports & Audit Exports
            </h3>
            <p className="text-xs text-stone-500">
              Generated directly from verified restaurant transactions and bookings
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Report Type Selector + Date Range Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Select Report Template
            </label>
            <select
              value={selectedReport}
              onChange={e => setSelectedReport(e.target.value as ReportType)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white cursor-pointer font-medium"
            >
              <option value="sales_summary">Sales & Revenue Summary</option>
              <option value="orders_fulfillment">Orders & Fulfillment Log</option>
              <option value="menu_performance">Menu Item Velocity & Performance</option>
              <option value="cancellations">Cancellations & Waste Audit</option>
              <option value="bookings">Table Bookings & Guest Attendance</option>
              <option value="payment_reconciliation">Payment Reconciliation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Reporting Time Window
            </label>
            <div className="inline-flex items-center p-1 bg-stone-100 rounded-sm border border-stone-200 w-full justify-between">
              <button
                type="button"
                onClick={() => setDateFilter('today')}
                className={`flex-1 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer text-center ${
                  dateFilter === 'today' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('week')}
                className={`flex-1 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer text-center ${
                  dateFilter === 'week' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('month')}
                className={`flex-1 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer text-center ${
                  dateFilter === 'month' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('all')}
                className={`flex-1 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer text-center ${
                  dateFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white border border-stone-200 rounded-md shadow-2xs p-6 space-y-6 printable-report">
        {/* Report Document Header */}
        <div className="border-b-2 border-stone-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1B3B2B]">
              THE GROVE BISTRO · LEVEL 12 HAMID TOWER · DHAKA
            </div>
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
              {getReportTitle(selectedReport)}
            </h2>
          </div>

          <div className="text-right text-xs text-stone-500 sm:self-end">
            <div>Generated: <strong className="text-stone-800">{new Date().toLocaleString()}</strong></div>
            <div>Timeframe: <strong className="text-stone-800 capitalize">{dateFilter} window</strong></div>
          </div>
        </div>

        {/* Executive Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-sm border border-stone-200 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px] uppercase font-bold">Total Net Revenue</span>
            <span className="font-mono text-base font-bold text-stone-900">৳ {totalNet.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px] uppercase font-bold">Recorded Transactions</span>
            <span className="font-mono text-base font-bold text-stone-900">{filteredOrders.length}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px] uppercase font-bold">Fulfilled Orders</span>
            <span className="font-mono text-base font-bold text-stone-900">{completedOrders.length}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px] uppercase font-bold">Guest Bookings</span>
            <span className="font-mono text-base font-bold text-stone-900">{filteredReservations.length}</span>
          </div>
        </div>

        {/* Tabular Data View */}
        <div className="overflow-x-auto">
          {selectedReport === 'sales_summary' || selectedReport === 'orders_fulfillment' ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                  <th className="py-2 px-3">Order ID</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3">Channel</th>
                  <th className="py-2 px-3 text-right">Subtotal</th>
                  <th className="py-2 px-3 text-right">Delivery</th>
                  <th className="py-2 px-3 text-right">Total</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">#{o.orderId}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 font-medium">{o.customerName}</td>
                    <td className="py-2.5 px-3 capitalize">{o.orderType}</td>
                    <td className="py-2.5 px-3 text-right font-mono">৳{o.subtotal.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono">৳{o.deliveryFee.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">৳{o.total.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-semibold">{o.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedReport === 'bookings' ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                  <th className="py-2 px-3">Ref</th>
                  <th className="py-2 px-3">Date & Time</th>
                  <th className="py-2 px-3">Guest Name</th>
                  <th className="py-2 px-3">Party Size</th>
                  <th className="py-2 px-3">Table</th>
                  <th className="py-2 px-3">Occasion</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredReservations.map(r => (
                  <tr key={r.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">#{r.referenceNumber}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{r.date} · {r.time}</td>
                    <td className="py-2.5 px-3 font-medium">{r.name}</td>
                    <td className="py-2.5 px-3">{r.guests} guests</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-900">{r.tableNumber || 'Unassigned'}</td>
                    <td className="py-2.5 px-3">{r.occasion}</td>
                    <td className="py-2.5 px-3 font-semibold">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedReport === 'menu_performance' ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                  <th className="py-2 px-3">Dish Name</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3 text-center">In Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {menuItems.map(m => (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{m.name}</td>
                    <td className="py-2.5 px-3 capitalize">{m.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">৳{m.price.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center font-medium">
                      {m.available ? (
                        <span className="text-emerald-800">Yes</span>
                      ) : (
                        <span className="text-rose-700">Out of Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedReport === 'cancellations' ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                  <th className="py-2 px-3">Order ID</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Guest Name</th>
                  <th className="py-2 px-3 text-right">Refund / Cancelled Amount</th>
                  <th className="py-2 px-3">Payment Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {cancelledOrders.length > 0 ? (
                  cancelledOrders.map(o => (
                    <tr key={o.orderId} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-900">#{o.orderId}</td>
                      <td className="py-2.5 px-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 font-medium">{o.customerName}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">৳{o.total.toLocaleString()}</td>
                      <td className="py-2.5 px-3 capitalize">{o.paymentMethod.replace(/_/g, ' ')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      No cancellations recorded in this time range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                  <th className="py-2 px-3">Order ID</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Payment Method</th>
                  <th className="py-2 px-3">Settlement</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">#{o.orderId}</td>
                    <td className="py-2.5 px-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 capitalize font-medium">{o.paymentMethod.replace(/_/g, ' ')}</td>
                    <td className="py-2.5 px-3 capitalize font-semibold">{o.paymentStatus}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">৳{o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Report Footer / Signature Line */}
        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            <span>Executive Audit & Reconciliation Copy · The Grove Bistro Operations</span>
          </div>
          <div className="border-t border-stone-300 pt-1 w-48 text-center font-medium text-stone-700">
            Manager Authorization Signature
          </div>
        </div>
      </div>
    </div>
  );
}
