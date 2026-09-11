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
      <div className="bg-[#18211A] border border-[#2D3F30] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-lg font-semibold text-white">
            Table Reservations Management
          </h3>
          <p className="text-xs text-[#828F84]">
            {reservations.length} guest bookings on record • Level 12 Dining Room & Skyline Terrace
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828F84]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search booking ref, guest or phone..."
            className="w-full pl-9 pr-3 py-2 bg-[#121713] border border-[#2D3F30] rounded-xs text-xs text-white placeholder-[#828F84] focus:outline-none focus:border-[#A3B899]"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-[#18211A] border border-[#2D3F30] p-12 text-center rounded-sm">
          <Calendar className="w-8 h-8 text-[#828F84] mx-auto mb-3" />
          <p className="text-sm text-[#C8D1CA]">No table bookings found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map(res => (
            <div
              key={res.id}
              className="bg-[#18211A] border border-[#2D3F30] rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#3E5542] transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif-display font-bold text-base text-white">
                    {res.referenceNumber}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                    {res.status}
                  </span>
                  <span className="text-xs text-[#828F84] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#A3B899]" />
                    {res.date} • {res.time}
                  </span>
                </div>

                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <span>{res.name}</span>
                  <span className="text-xs text-[#828F84] font-normal">• {res.guests} Guests ({res.occasion || 'Dining'})</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#828F84]">
                  <div className="flex items-center gap-1.5 text-[#C8D1CA]">
                    <Phone className="w-3 h-3 text-[#828F84]" />
                    <a href={`tel:${res.phone}`} className="hover:text-white transition-colors">
                      {res.phone}
                    </a>
                  </div>
                  {res.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#828F84]" />
                      <span>{res.email}</span>
                    </div>
                  )}
                </div>

                {res.specialRequest && (
                  <div className="text-xs italic text-amber-200/90 bg-amber-950/30 border border-amber-900/40 p-2 rounded-xs mt-1">
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
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/60 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
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
