import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Search, 
  Plus, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building2, 
  Edit3, 
  X, 
  Check, 
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Reservation } from '../../types';
import { NewBookingModal, RESTAURANT_TABLES } from './NewBookingModal';

interface BookingsTabProps {
  reservations: Reservation[];
  onAddBooking: (booking: Omit<Reservation, 'id' | 'referenceNumber' | 'createdAt'>) => void;
  onUpdateReservationStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => void;
  onUpdateReservation: (id: string, updates: Partial<Reservation>) => void;
  onNotification: (msg: string) => void;
}

export function BookingsTab({
  reservations,
  onAddBooking,
  onUpdateReservationStatus,
  onUpdateReservation,
  onNotification
}: BookingsTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Confirmed' | 'Pending' | 'Cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('all');

  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [rescheduleReservation, setRescheduleReservation] = useState<Reservation | null>(null);
  const [cancelReservationTarget, setCancelReservationTarget] = useState<Reservation | null>(null);

  // Reschedule Form States
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleGuests, setRescheduleGuests] = useState(2);
  const [rescheduleTable, setRescheduleTable] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        res.referenceNumber.toLowerCase().includes(q) ||
        res.name.toLowerCase().includes(q) ||
        res.phone.includes(q) ||
        (res.email && res.email.toLowerCase().includes(q)) ||
        (res.tableNumber && res.tableNumber.toLowerCase().includes(q))
      );

      // Status
      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

      // Date
      let matchesDate = true;
      if (dateFilter === 'today') matchesDate = res.date === todayStr;
      if (dateFilter === 'tomorrow') matchesDate = res.date === tomorrowStr;
      if (dateFilter === 'upcoming') matchesDate = res.date >= todayStr;

      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => {
      // Sort by date then time
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  }, [reservations, searchQuery, statusFilter, dateFilter, todayStr, tomorrowStr]);

  const handleOpenReschedule = (res: Reservation) => {
    setRescheduleReservation(res);
    setRescheduleDate(res.date);
    setRescheduleTime(res.time);
    setRescheduleGuests(res.guests);
    setRescheduleTable(res.tableNumber || RESTAURANT_TABLES[0]);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleReservation) return;

    // Check table conflict
    const conflict = reservations.find(
      r => r.id !== rescheduleReservation.id &&
           r.date === rescheduleDate &&
           r.time === rescheduleTime &&
           r.tableNumber === rescheduleTable &&
           r.status !== 'Cancelled'
    );

    if (conflict) {
      alert(`Conflict: ${rescheduleTable} is already booked by ${conflict.name} at this time.`);
      return;
    }

    onUpdateReservation(rescheduleReservation.id, {
      date: rescheduleDate,
      time: rescheduleTime,
      guests: rescheduleGuests,
      tableNumber: rescheduleTable
    });

    onNotification(`Reservation #${rescheduleReservation.referenceNumber} rescheduled.`);
    setRescheduleReservation(null);
  };

  const handleConfirmCancel = () => {
    if (!cancelReservationTarget) return;
    onUpdateReservationStatus(cancelReservationTarget.id, 'Cancelled');
    onNotification(`Reservation #${cancelReservationTarget.referenceNumber} cancelled.`);
    setCancelReservationTarget(null);
  };

  const handleDirectConfirm = (res: Reservation) => {
    onUpdateReservationStatus(res.id, 'Confirmed');
    onNotification(`Booking #${res.referenceNumber} confirmed for ${res.name}.`);
  };

  // Group by date for Calendar/Agenda View
  const groupedByDate = useMemo(() => {
    const map: Record<string, Reservation[]> = {};
    filteredReservations.forEach(r => {
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    });
    return map;
  }, [filteredReservations]);

  return (
    <div className="space-y-5">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-md shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reference, guest, phone, table..."
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

          {/* Quick Selectors & View Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Date filter dropdown */}
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today ({todayStr})</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="upcoming">Upcoming</option>
            </select>

            {/* Status filter dropdown */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* View Mode Toggle: List vs Calendar */}
            <div className="inline-flex items-center p-0.5 bg-stone-100 rounded-sm border border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'calendar' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Calendar & Daily Agenda View"
              >
                <CalendarDays className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* New Booking Action */}
            <button
              type="button"
              onClick={() => setIsNewBookingOpen(true)}
              className="px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View: List or Calendar Agenda */}
      {viewMode === 'list' ? (
        <div className="bg-white border border-stone-200 rounded-md shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ref & Date</th>
                  <th className="py-3 px-4">Guest Info</th>
                  <th className="py-3 px-4">Party & Occasion</th>
                  <th className="py-3 px-4">Table Assignment</th>
                  <th className="py-3 px-4">Special Requests</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredReservations.length > 0 ? (
                  filteredReservations.map(res => (
                    <tr key={res.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-stone-900">
                          #{res.referenceNumber}
                        </div>
                        <div className="text-[11px] text-stone-500 font-medium">
                          {res.date} · {res.time}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{res.name}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <a href={`tel:${res.phone}`} className="hover:text-emerald-800">
                            {res.phone}
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-stone-800">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>{res.guests} Guests</span>
                        </div>
                        <div className="text-[11px] text-stone-500">{res.occasion}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {res.tableNumber ? (
                          <div className="font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs inline-block">
                            {res.tableNumber}
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate" title={res.specialRequest}>
                        {res.specialRequest ? (
                          <span className="text-stone-700 italic">{res.specialRequest}</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : res.status === 'Pending'
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          {res.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        {res.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleDirectConfirm(res)}
                            className="px-2 py-1 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-sm transition-colors cursor-pointer shadow-2xs"
                          >
                            Confirm
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenReschedule(res)}
                          className="px-2 py-1 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer border border-stone-200"
                        >
                          Reschedule
                        </button>

                        {res.status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => setCancelReservationTarget(res)}
                            className="px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer border border-rose-200"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400">
                      No reservations found for current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
            <span>{filteredReservations.length} total bookings displayed</span>
            <span>Gulshan-2 Level 12 Main Dining Room & Skyline Terrace</span>
          </div>
        </div>
      ) : (
        /* Calendar / Daily Agenda View */
        <div className="space-y-4">
          {Object.keys(groupedByDate).length > 0 ? (
            (Object.entries(groupedByDate) as [string, Reservation[]][]).map(([dateKey, items]) => (
              <div key={dateKey} className="bg-white border border-stone-200 rounded-md shadow-2xs overflow-hidden">
                <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#1B3B2B]" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                      {dateKey} {dateKey === todayStr ? '(Today)' : dateKey === tomorrowStr ? '(Tomorrow)' : ''}
                    </h4>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    {items.length} reservations scheduled
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(res => (
                    <div
                      key={res.id}
                      className="p-3 rounded-sm border border-stone-200 bg-white hover:border-stone-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          {res.time}
                        </span>
                        <span className={`px-2 py-0.2 text-[10px] font-bold uppercase rounded-xs border ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : res.status === 'Pending'
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          {res.status}
                        </span>
                      </div>

                      <div>
                        <div className="font-semibold text-xs text-stone-900">{res.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {res.guests} guests · {res.occasion}
                        </div>
                        {res.tableNumber && (
                          <div className="text-[10px] font-semibold text-emerald-800 mt-1">
                            {res.tableNumber}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenReschedule(res)}
                          className="text-[11px] text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
                        >
                          Edit / Reschedule
                        </button>
                        {res.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleDirectConfirm(res)}
                            className="text-[11px] text-emerald-800 font-bold hover:underline cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-stone-200 rounded-md p-12 text-center text-stone-400">
              No reservations found on schedule.
            </div>
          )}
        </div>
      )}

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onAddBooking={(b) => {
          onAddBooking(b);
          onNotification(`New booking recorded for ${b.name} (${b.date} at ${b.time}).`);
        }}
        existingReservations={reservations}
      />

      {/* Reschedule Modal */}
      {rescheduleReservation && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Reschedule Reservation</h4>
                <p className="text-xs text-stone-500">#{rescheduleReservation.referenceNumber} · {rescheduleReservation.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleReservation(null)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Dining Time
                </label>
                <select
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white"
                >
                  {['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Party Size
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={rescheduleGuests}
                  onChange={e => setRescheduleGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Table Assignment
                </label>
                <select
                  value={rescheduleTable}
                  onChange={e => setRescheduleTable(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white"
                >
                  {RESTAURANT_TABLES.map(tbl => (
                    <option key={tbl} value={tbl}>{tbl}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleReservation(null)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1B3B2B] hover:bg-black text-white font-semibold rounded-sm"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Safeguard Modal */}
      {cancelReservationTarget && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">Cancel Reservation</h4>
                <p className="text-xs text-stone-500">#{cancelReservationTarget.referenceNumber}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to cancel the reservation for <strong className="text-stone-900">{cancelReservationTarget.name}</strong> on <strong className="text-stone-900">{cancelReservationTarget.date} at {cancelReservationTarget.time}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelReservationTarget(null)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
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
