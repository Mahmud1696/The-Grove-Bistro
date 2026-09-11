import { Calendar, BookOpen } from 'lucide-react';

interface ReservationCTAProps {
  onNavigate: (view: string) => void;
}

export function ReservationCTA({ onNavigate }: ReservationCTAProps) {
  return (
    <section id="reservation-cta-section" className="relative py-24 sm:py-32 overflow-hidden text-white">
      {/* Background Image with Warm Moody Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=2000&q=80"
          alt="Warm dining room setting at The Grove Bistro"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#141A15]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141A15]/90 via-[#141A15]/60 to-[#141A15]/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#A3B899] block mb-4">
          Hamid Tower • Level 12
        </span>

        <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal text-[#FAF8F5] mb-6">
          Your table is waiting.
        </h2>

        <p className="font-sans-ui text-base sm:text-lg text-[#D6CEBF] font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Come for the food. Stay for the atmosphere. Reserve your evening or weekend brunch with us in Gulshan-2.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            id="res-cta-reserve-btn"
            onClick={() => onNavigate('reservations')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FAF8F5] text-[#1E221E] hover:bg-[#EBE5DF] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-md cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#2D4532]" />
            <span>Reserve a Table</span>
          </button>

          <button
            id="res-cta-menu-btn"
            onClick={() => onNavigate('menu')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-sm border border-white/40 hover:border-white transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#A3B899]" />
            <span>View Menu</span>
          </button>
        </div>
      </div>
    </section>
  );
}
