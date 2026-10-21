import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  ShoppingBag, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Edit3, 
  X, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  Clock
} from 'lucide-react';
import { Order, Reservation, CustomerRecord, OrderType } from '../../types';

interface CustomersTabProps {
  orders: Order[];
  reservations: Reservation[];
  onSelectOrder?: (orderId: string) => void;
  onNotification: (msg: string) => void;
}

const CUSTOMER_NOTES_STORAGE_KEY = 'thegrove_customer_notes_v1';

export function CustomersTab({
  orders,
  reservations,
  onSelectOrder,
  onNotification
}: CustomersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'high_value' | 'frequent' | 'new'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Manager Custom Notes map: key = customer phone/id, value = notes string
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_NOTES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      '+880 1711-234567': 'VIP guest. Prefers dishes mild spicy. Often orders for family dinners in Gulshan 2.',
      '+880 1819-334455': 'Corporate patron. Prefers window table facing the terrace when dining in.',
      '+880 1819-876543': 'Frequent weekend brunch reservation. Loves slow-braised short ribs.'
    };
  });

  const [editingNote, setEditingNote] = useState<string>('');
  const [isEditingNoteModalOpen, setIsEditingNoteModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_NOTES_STORAGE_KEY, JSON.stringify(customerNotes));
    } catch (e) {}
  }, [customerNotes]);

  // Aggregate unique customers dynamically from orders and reservations
  const customersList = useMemo(() => {
    const customerMap: Record<string, CustomerRecord> = {};

    // 1. Process orders
    orders.forEach(order => {
      const phoneKey = order.phone.trim();
      if (!customerMap[phoneKey]) {
        customerMap[phoneKey] = {
          id: `cust-${phoneKey.replace(/\D/g, '')}`,
          name: order.customerName,
          phone: order.phone,
          email: order.email,
          addresses: order.address ? [order.address] : [],
          totalOrders: 0,
          lifetimeSpend: 0,
          averageOrderValue: 0,
          lastOrderDate: order.createdAt,
          preferredChannel: order.orderType,
          notes: customerNotes[phoneKey] || ''
        };
      }

      const record = customerMap[phoneKey];
      record.totalOrders += 1;
      record.lifetimeSpend += order.total;
      if (order.address && !record.addresses.includes(order.address)) {
        record.addresses.push(order.address);
      }
      if (new Date(order.createdAt) > new Date(record.lastOrderDate)) {
        record.lastOrderDate = order.createdAt;
      }
    });

    // 2. Process reservations for guests without orders
    reservations.forEach(res => {
      const phoneKey = res.phone.trim();
      if (!customerMap[phoneKey]) {
        customerMap[phoneKey] = {
          id: `cust-${phoneKey.replace(/\D/g, '')}`,
          name: res.name,
          phone: res.phone,
          email: res.email,
          addresses: [],
          totalOrders: 0,
          lifetimeSpend: 0,
          averageOrderValue: 0,
          lastOrderDate: res.createdAt,
          preferredChannel: 'dine-in',
          notes: customerNotes[phoneKey] || ''
        };
      }
    });

    // Calculate AOV and attach notes
    return Object.values(customerMap).map(c => {
      c.averageOrderValue = c.totalOrders > 0 ? Math.round(c.lifetimeSpend / c.totalOrders) : 0;
      c.notes = customerNotes[c.phone] || '';
      return c;
    });
  }, [orders, reservations, customerNotes]);

  const filteredCustomers = useMemo(() => {
    return customersList.filter(cust => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        cust.name.toLowerCase().includes(q) ||
        cust.phone.includes(q) ||
        (cust.email && cust.email.toLowerCase().includes(q))
      );

      let matchesTier = true;
      if (tierFilter === 'high_value') matchesTier = cust.lifetimeSpend >= 4000;
      if (tierFilter === 'frequent') matchesTier = cust.totalOrders >= 2;
      if (tierFilter === 'new') matchesTier = cust.totalOrders <= 1;

      return matchesSearch && matchesTier;
    }).sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
  }, [customersList, searchQuery, tierFilter]);

  const handleOpenEditNote = (customer: CustomerRecord) => {
    setSelectedCustomer(customer);
    setEditingNote(customerNotes[customer.phone] || '');
    setIsEditingNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setCustomerNotes(prev => ({
      ...prev,
      [selectedCustomer.phone]: editingNote.trim()
    }));
    onNotification(`Guest notes updated for ${selectedCustomer.name}.`);
    setIsEditingNoteModalOpen(false);
  };

  // Find all orders placed by selected customer
  const selectedCustomerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(o => o.phone.trim() === selectedCustomer.phone.trim());
  }, [orders, selectedCustomer]);

  return (
    <div className="space-y-5">
      {/* Search and Tier Filter Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-md shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search customer by name, phone or email..."
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

          {/* Tier Segmented Control */}
          <div className="inline-flex items-center p-1 bg-stone-100 rounded-sm border border-stone-200">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                tierFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
              }`}
            >
              All Guests ({customersList.length})
            </button>
            <button
              onClick={() => setTierFilter('high_value')}
              className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                tierFilter === 'high_value' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
              }`}
            >
              High Value (&gt; ৳4k)
            </button>
            <button
              onClick={() => setTierFilter('frequent')}
              className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                tierFilter === 'frequent' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
              }`}
            >
              Frequent Patrons
            </button>
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white border border-stone-200 rounded-md shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Guest Profile</th>
                <th className="py-3 px-4">Contact & Channel</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Average Order</th>
                <th className="py-3 px-4">Executive / Dietary Notes</th>
                <th className="py-3 px-4 text-right">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(cust => {
                  const hasNotes = Boolean(cust.notes);
                  const isHighValue = cust.lifetimeSpend >= 5000;

                  return (
                    <tr 
                      key={cust.id} 
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center font-bold text-xs text-stone-800">
                            {cust.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                              <span>{cust.name}</span>
                              {isHighValue && (
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" title="High Value Patron" />
                              )}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              Last active: {new Date(cust.lastOrderDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-stone-800">{cust.phone}</div>
                        <div className="text-[11px] text-stone-400 truncate max-w-[150px]">
                          {cust.email || 'No email on record'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-stone-900">
                        {cust.totalOrders}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900 whitespace-nowrap">
                        ৳ {cust.lifetimeSpend.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-stone-600 whitespace-nowrap">
                        ৳ {cust.averageOrderValue.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[11px] truncate ${hasNotes ? 'text-stone-800 italic' : 'text-stone-400'}`}>
                            {cust.notes || 'Add guest preference note...'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditNote(cust);
                            }}
                            className="p-1 text-stone-400 hover:text-stone-900 rounded-xs hover:bg-stone-200 transition-colors"
                            title="Edit notes"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(cust);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:text-white hover:bg-emerald-900 rounded-sm transition-colors border border-emerald-800/30 cursor-pointer"
                        >
                          View Orders
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No customers found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
          <span>{filteredCustomers.length} unique patrons recorded</span>
          <span>Access strictly restricted to authorized restaurant management</span>
        </div>
      </div>

      {/* Customer Order History Drawer */}
      {selectedCustomer && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
          onClick={() => setSelectedCustomer(null)}
        >
          <div 
            className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  {selectedCustomer.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="font-serif-display text-base font-bold text-stone-900">
                    {selectedCustomer.name}
                  </h3>
                  <div className="text-xs text-stone-500">
                    {selectedCustomer.phone} {selectedCustomer.email ? `· ${selectedCustomer.email}` : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Lifetime Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-stone-50 p-3 rounded-sm border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-400">Lifetime Spend</div>
                  <div className="font-mono text-base font-bold text-stone-900 mt-1">
                    ৳ {selectedCustomer.lifetimeSpend.toLocaleString()}
                  </div>
                </div>
                <div className="bg-stone-50 p-3 rounded-sm border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-400">Total Orders</div>
                  <div className="font-mono text-base font-bold text-stone-900 mt-1">
                    {selectedCustomer.totalOrders}
                  </div>
                </div>
                <div className="bg-stone-50 p-3 rounded-sm border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-400">Average Ticket</div>
                  <div className="font-mono text-base font-bold text-stone-900 mt-1">
                    ৳ {selectedCustomer.averageOrderValue.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Manager Notes */}
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Guest Preference Notes
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditNote(selectedCustomer)}
                    className="text-[11px] text-amber-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed italic">
                  {selectedCustomer.notes || 'No manager notes entered yet.'}
                </p>
              </div>

              {/* Delivery Destinations */}
              {selectedCustomer.addresses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Delivery Addresses On File
                  </h4>
                  <div className="space-y-1">
                    {selectedCustomer.addresses.map((addr, idx) => (
                      <div key={idx} className="p-2 text-xs bg-stone-50 border border-stone-200 rounded-sm text-stone-800 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{addr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Order History ({selectedCustomerOrders.length})
                </h4>

                {selectedCustomerOrders.length > 0 ? (
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-sm">
                    {selectedCustomerOrders.map(order => (
                      <div key={order.orderId} className="p-3 text-xs space-y-1.5 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-stone-900">
                            #{order.orderId}
                          </span>
                          <span className="font-mono font-bold text-stone-900">
                            ৳ {order.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center justify-between">
                          <span>{new Date(order.createdAt).toLocaleString()} · {order.orderType}</span>
                          <span className="capitalize font-semibold text-stone-700">{order.orderStatus}</span>
                        </div>
                        <div className="text-[11px] text-stone-600 truncate">
                          {order.items.map(it => `${it.quantity}x ${it.item.name}`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-stone-400 py-6 text-center">
                    No orders recorded yet (reservation guest)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notes Modal */}
      {isEditingNoteModalOpen && selectedCustomer && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="font-bold text-sm text-stone-900">
                Edit Guest Notes
              </h4>
              <button
                type="button"
                onClick={() => setIsEditingNoteModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              VIP preferences, dietary restrictions, seating requests for <strong>{selectedCustomer.name}</strong>.
            </p>

            <form onSubmit={handleSaveNote} className="space-y-3">
              <textarea
                rows={4}
                value={editingNote}
                onChange={e => setEditingNote(e.target.value)}
                placeholder="e.g. Shellfish allergy, prefers window table, anniversary in November..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNoteModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
