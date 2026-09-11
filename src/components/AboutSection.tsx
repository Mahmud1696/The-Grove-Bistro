import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  onNavigate: (view: string) => void;
}

export function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <section id="about-intro-section" className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Image with Subtle Frame & Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-sm overflow-hidden aspect-[4/3] sm:aspect-[14/11] shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80"
                alt="Interior ambiance and dining table setting at The Grove Bistro Dhaka"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Subtle Floating Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-[#FAF8F5] border border-[#E3DDD4] p-4 rounded-sm shadow-md items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#2D4532]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-serif-display text-sm font-semibold text-[#1E221E]">
                  Level 12 Skyline Views
                </p>
                <p className="text-xs text-[#6B726C]">Hamid Tower, Gulshan Circle 2</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] mb-3">
              Welcome to The Grove
            </span>

            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B] leading-tight mb-6">
              A place to eat, gather and unwind.
            </h2>

            <p className="font-sans-ui text-base sm:text-lg text-[#555E57] leading-relaxed mb-6 font-light">
              The Grove Bistro brings together thoughtfully prepared food, a welcoming atmosphere, and a space designed for everything from casual meals to special evenings.
            </p>

            <p className="font-sans-ui text-sm sm:text-base text-[#6F7770] leading-relaxed mb-8">
              Perched on the 12th floor of Hamid Tower in the vibrant heart of Gulshan-2, our bistro offers panoramic city vistas, crafted European-continental dining, and authentic hospitality tailored for unhurried conversations.
            </p>

            <div>
              <button
                id="discover-story-btn"
                onClick={() => onNavigate('about')}
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-[#1E221E] hover:text-[#2D4532] transition-colors cursor-pointer"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-[#2D4532]" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
