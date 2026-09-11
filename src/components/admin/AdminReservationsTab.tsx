import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import { Reservation } from '../../types';

interface AdminReservationsTabProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onNotification: (msg: string) => void;
}

export function AdminReservationsTab({
  reservations,
  onCancelReservation,
  onNotification
}: AdminReservationsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReservations = reservations.filter(
    r =>
      r.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-5">
      {/* Search Header */}
      <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-lg font-bold text-gray-900">
            Table Reservations Management
          </h3>
          <p className="text-xs text-gray-500">
            {reservations.length} guest bookings on record • Level 12 Dining Room & Skyline Terrace
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search booking ref, guest or phone..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xs text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center rounded-sm shadow-xs">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900">No table bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map(res => (
            <div
              key={res.id}
              className="bg-white border border-gray-200 rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-gray-300 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif-display font-bold text-base text-gray-900">
                    {res.referenceNumber}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                    {res.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {res.date} • {res.time}
                  </span>
                </div>

                <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span>{res.name}</span>
                  <span className="text-xs text-gray-500 font-normal">• {res.guests} Guests ({res.occasion || 'Dining'})</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <a href={`tel:${res.phone}`} className="hover:text-black font-medium transition-colors">
                      {res.phone}
                    </a>
                  </div>
                  {res.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>{res.email}</span>
                    </div>
                  )}
                </div>

                {res.specialRequest && (
                  <div className="text-xs italic text-amber-900 bg-amber-50 border border-amber-200 p-2 rounded-xs mt-1">
                    Special note: "{res.specialRequest}"
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onCancelReservation(res.id);
                    onNotification(`Reservation ${res.referenceNumber} cancelled.`);
                  }}
                  className="px-3 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
