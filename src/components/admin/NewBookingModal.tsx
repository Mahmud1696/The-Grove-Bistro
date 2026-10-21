import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Users, Building2, AlertTriangle, Check } from 'lucide-react';
import { Reservation } from '../../types';

export const RESTAURANT_TABLES = [
  'Table T1 (Window Booth · 2p)',
  'Table T2 (Bistro Corner · 2p)',
  'Table T3 (Main Hall · 4p)',
  'Table T4 (Terrace Skyline · 4p)',
  'Table T5 (Terrace Garden · 4p)',
  'Table T6 (Main Hall · 6p)',
  'Table T7 (Main Hall · 6p)',
  'Table T8 (Center Hall · 8p)',
  'VIP-1 (Private Dining · 8p)',
  'VIP-2 (Executive Salon · 12p)'
];

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBooking: (booking: Omit<Reservation, 'id' | 'referenceNumber' | 'createdAt'>) => void;
  existingReservations: Reservation[];
}

export function NewBookingModal({
  isOpen,
  onClose,
  onAddBooking,
  existingReservations
}: NewBookingModalProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+880 ');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('7:30 PM');
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState('Casual Dining');
  const [tableNumber, setTableNumber] = useState(RESTAURANT_TABLES[0]);
  const [specialRequest, setSpecialRequest] = useState('');
  const [status, setStatus] = useState<'Confirmed' | 'Pending'>('Confirmed');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Check table conflict
  const conflictingBooking = existingReservations.find(
    r => r.date === date && r.time === time && r.tableNumber === tableNumber && r.status !== 'Cancelled'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Guest name is required.');
      return;
    }
    if (!phone.trim() || phone.trim() === '+880') {
      setErrorMsg('Contact phone number is required.');
      return;
    }
    if (guests < 1) {
      setErrorMsg('Party size must be at least 1 guest.');
      return;
    }

    if (conflictingBooking) {
      setErrorMsg(`Table conflict! ${tableNumber} is already reserved by ${conflictingBooking.name} for ${time} on ${date}. Please choose another table or time slot.`);
      return;
    }

    onAddBooking({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date,
      time,
      guests,
      occasion,
      tableNumber,
      specialRequest: specialRequest.trim() || undefined,
      status
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-stone-200 rounded-md shadow-2xl max-w-lg w-full p-6 text-stone-900 space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-stone-900">
              New Table Reservation
            </h3>
            <p className="text-xs text-stone-500">
              Direct phone or front-of-house walk-in guest reservation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700" />
            <span>{errorMsg}</span>
          </div>
        )}

        {conflictingBooking && (
          <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Warning: {tableNumber} is already booked at {time} on this date!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Guest Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+880 1..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Party Size (Guests) *
              </label>
              <input
                type="number"
                min={1}
                max={30}
                required
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 font-mono focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Dining Time Slot *
              </label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 cursor-pointer"
              >
                {['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Table Assignment
              </label>
              <select
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 cursor-pointer"
              >
                {RESTAURANT_TABLES.map(tbl => (
                  <option key={tbl} value={tbl}>{tbl}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 cursor-pointer"
              >
                <option value="Casual Dining">Casual Dining</option>
                <option value="Birthday">Birthday Celebration</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business Dinner">Business Dinner</option>
                <option value="Family Gathering">Family Gathering</option>
                <option value="Romantic Date">Romantic Date</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Special Requests or Dietary Notes
              </label>
              <textarea
                rows={2}
                value={specialRequest}
                onChange={e => setSpecialRequest(e.target.value)}
                placeholder="High chair, floral arrangement, allergy details..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Create Reservation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
