import { motion } from 'motion/react';
import { ArrowDown, ChevronRight, Utensils, Calendar } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const scrollToActions = () => {
    const el = document.getElementById('quick-action-bar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-white overflow-hidden"
    >
      {/* Background Image with Ambient Zoom */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/assets/aistudio/745019829_1083828577314941_875227384916130874_n_528e9966.jpg"
          alt="The Grove Bistro ambient dining interior at Hamid Tower, Gulshan"
          className="w-full h-full object-cover object-center"
        />
        {/* Editorial Vignette & Warm Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141A15] via-[#141A15]/60 to-[#141A15]/40" />
        <div className="absolute inset-0 bg-[#28382B]/20 mix-blend-multiply" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-xs uppercase tracking-[0.3em] font-medium text-[#EBE5DF]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3B899] animate-pulse" />
          The Grove Bistro
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#FAF8F5] leading-[1.14] mb-4 sm:mb-6"
        >
          A refined dining experience in Dhaka.
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans-ui text-sm sm:text-lg md:text-xl text-[#D6CEBF] font-light max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
        >
          Thoughtfully prepared food, inviting surroundings, and memorable moments — all in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-md sm:max-w-none mx-auto"
        >
          <button
            id="hero-order-btn"
            onClick={() => onNavigate('order')}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-[#FAF8F5] text-[#1E221E] hover:bg-[#EBE5DF] font-semibold text-xs uppercase tracking-[0.2em] rounded-xs transition-all shadow-md group cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#2D4532]" />
            <span>Order Online</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            id="hero-reserve-btn"
            onClick={() => onNavigate('reservations')}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-xs border border-white/40 hover:border-white transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#A3B899]" />
            <span>Reserve a Table</span>
          </button>
        </motion.div>
      </div>

      {/* Hero Scroll Indicator */}
      <motion.button
        id="hero-scroll-indicator"
        onClick={scrollToActions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-label="Scroll to explore quick actions and menu"
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer group focus:outline-none"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium font-sans-ui">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-[#A3B899] group-hover:text-white transition-colors" />
        </motion.div>
      </motion.button>
    </section>
  );
}
