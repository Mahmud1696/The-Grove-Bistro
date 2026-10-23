import { useState, type FormEvent } from 'react';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle2, Phone, Sparkles, AlertCircle } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import { Reservation } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface ReservationsViewProps {
  onNavigate: (view: string) => void;
}

export function ReservationsView({ onNavigate }: ReservationsViewProps) {
  const { makeReservation } = useReservation();

  // Calculate today in YYYY-MM-DD for min date
  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('7:30 PM');
  const [guests, setGuests] = useState<number>(2);
  const [occasion, setOccasion] = useState('Casual dining');
  const [specialRequest, setSpecialRequest] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const guestCounts = [1, 2, 3, 4, 5, 6, 7, 8];

  const diningTimes = [
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
  ];

  const occasions = [
    'Casual dining',
    'Birthday',
    'Anniversary',
    'Business',
    'Date night',
    'Celebration',
    'Other'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError('Please enter a valid phone number for table confirmation.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!date || date < today) {
      setFormError('Please select a valid upcoming dining date.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = makeReservation({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        date,
        time,
        guests,
        occasion,
        specialRequest: specialRequest.trim()
      });

      setIsSubmitting(false);
      setConfirmedReservation(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  if (confirmedReservation) {
    return (
      <div id="reservation-confirmed-view" className="pt-28 pb-28 bg-[#FAF8F5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E3DDD4] rounded-sm p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#2D4532]" />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#2D4532] block mb-2">
              Reservation Request Received
            </span>

            <h1 className="font-serif-display text-3xl sm:text-4xl text-[#1A1E1B] mb-3">
              We look forward to hosting you.
            </h1>

            <p className="text-sm text-[#666F67] max-w-md mx-auto mb-8 font-light">
              Your table at Level 12, Hamid Tower has been recorded. A confirmation SMS & email has been dispatched.
            </p>

            <div className="bg-[#F5F1EB] border border-[#E8E1D7] p-6 rounded-xs text-left mb-8 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2DBD0]">
                <span className="text-xs text-[#7F8881] uppercase tracking-wider">
                  Booking Reference
                </span>
                <span className="font-serif-display font-bold text-lg text-[#1A1E1B]">
                  {confirmedReservation.referenceNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[#8A928B] block">Guest Name</span>
                  <span className="font-semibold text-[#1A1E1B]">{confirmedReservation.name}</span>
                </div>
                <div>
                  <span className="text-[#8A928B] block">Party Size</span>
                  <span className="font-semibold text-[#1A1E1B]">
                    {confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A928B] block">Date & Time</span>
                  <span className="font-semibold text-[#1A1E1B]">
                    {confirmedReservation.date} at {confirmedReservation.time}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A928B] block">Occasion</span>
                  <span className="font-semibold text-[#1A1E1B]">{confirmedReservation.occasion}</span>
                </div>
              </div>

              {confirmedReservation.specialRequest && (
                <div className="pt-2 text-xs border-t border-[#E2DBD0]">
                  <span className="text-[#8A928B] block">Special Request:</span>
                  <span className="italic text-[#555E57]">"{confirmedReservation.specialRequest}"</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('menu')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#2D4532] hover:bg-[#233727] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs cursor-pointer"
              >
                Explore Menu Before Visit
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#DDD5CA] hover:bg-[#F3EFE9] text-[#1A1E1B] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="reservations-page-view" className="pt-24 pb-28 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center pt-8 pb-10">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2D4532] block mb-3">
            Hamid Tower • Level 12 • Gulshan-2
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1E1B] mb-4">
            Reserve your table.
          </h1>
          <p className="font-sans-ui text-base sm:text-lg text-[#5D6660] max-w-xl mx-auto font-light leading-relaxed">
            Join us for an evening of contemporary dining overlooking the city skyline, or a relaxing weekend brunch.
          </p>
        </div>

        {/* Visual Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-[#DDD5CA] shadow-2xs group">
            <img
              src="/assets/aistudio/745019829_1083828577314941_875227384916130874_n_528e9966.jpg"
              alt="Terrace Conservatory Window Seating at The Grove"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white font-medium tracking-wide">
                Terrace Conservatory & Daylight Dining
              </span>
            </div>
          </div>
          <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-[#DDD5CA] shadow-2xs group">
            <img
              src="/assets/aistudio/745546055_1083828587314940_1887363832029969781_n_6341a8e4.jpg"
              alt="Amber-lit Evening Lounge Nook at The Grove"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white font-medium tracking-wide">
                Intimate Evening Tables & Amber Lighting
              </span>
            </div>
          </div>
        </div>

        {/* Reservation Form Container */}
        <div className="bg-white border border-[#E3DDD4] rounded-sm p-6 sm:p-10 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Guests Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2D4532]" />
                <span>Number of Guests</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {guestCounts.map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGuests(count)}
                    className={`min-h-[44px] py-2.5 text-sm font-semibold rounded-xs border transition-all cursor-pointer ${
                      guests === count
                        ? 'bg-[#2D4532] text-white border-[#2D4532] shadow-xs'
                        : 'bg-[#FAF8F5] text-[#1A1E1B] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                    }`}
                  >
                    {count === 8 ? '8+' : count}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#2D4532]" />
                  <span>Select Date</span>
                </label>
                <input
                  id="reservation-date-picker"
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full min-h-[44px] p-3 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs text-sm sm:text-xs text-[#1A1E1B] focus:outline-none focus:border-[#2D4532] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2D4532]" />
                  <span>Preferred Time</span>
                </label>
                <select
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full min-h-[44px] p-3 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs text-sm sm:text-xs text-[#1A1E1B] focus:outline-none focus:border-[#2D4532] cursor-pointer"
                >
                  {diningTimes.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Occasion */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D4532]" />
                <span>Occasion</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map(occ => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded-xs border transition-colors cursor-pointer ${
                      occasion === occ
                        ? 'bg-[#1A1E1B] text-white border-[#1A1E1B]'
                        : 'bg-[#FAF8F5] text-[#555E57] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Contact Details */}
            <div className="space-y-4 pt-4 border-t border-[#EAE4DC]">
              <h3 className="font-serif-display text-lg font-semibold text-[#1A1E1B]">
                Your Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <input
                    id="res-name-input"
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full min-h-[44px] p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                  />
                </div>
                <div>
                  <input
                    id="res-phone-input"
                    type="tel"
                    required
                    placeholder="Mobile Number *"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full min-h-[44px] p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                  />
                </div>
                <div>
                  <input
                    id="res-email-input"
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full min-h-[44px] p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                  />
                </div>
              </div>

              <div>
                <textarea
                  id="res-notes-input"
                  rows={2}
                  placeholder="Special requests, dietary preferences, or window seating request (optional)..."
                  value={specialRequest}
                  onChange={e => setSpecialRequest(e.target.value)}
                  className="w-full p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                />
              </div>
            </div>

            {/* Error state */}
            {formError && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xs border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <button
                id="request-reservation-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Confirming Availability...' : 'Request Reservation'}
              </button>
              <p className="text-[11px] text-center text-[#7F8881] mt-2.5">
                Tables are held for 15 minutes. For immediate table inquiries, call {RESTAURANT_INFO.phone}.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
