import { motion } from 'motion/react';
import { Utensils, Heart, Sparkles } from 'lucide-react';

export function ExperienceSection() {
  const pillars = [
    {
      id: 'pillar-food',
      title: 'Good Food',
      description: 'Thoughtfully prepared dishes crafted with imported prime cuts, fresh coastal seafood, and handmade pasta.',
      icon: Utensils,
    },
    {
      id: 'pillar-space',
      title: 'Good Space',
      description: 'A warm and inviting atmosphere on Level 12 of Hamid Tower, overlooking the skyline of Gulshan-2.',
      icon: Sparkles,
    },
    {
      id: 'pillar-moments',
      title: 'Good Moments',
      description: 'A place worth coming back to — where unhurried conversations and shared tables turn into lasting memories.',
      icon: Heart,
    },
  ];

  return (
    <section id="experience-section" className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] block mb-2">
            The Philosophy
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#1A1E1B]">
            Crafted for pure hospitality
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                id={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="text-center p-8 rounded-sm bg-[#F5F1EB] border border-[#E6E0D6] flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#DDD6CB] flex items-center justify-center text-[#2D4532] mb-6">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif-display text-2xl font-medium tracking-wide text-[#1A1E1B] uppercase mb-3">
                  {pillar.title}
                </h3>
                <p className="font-sans-ui text-sm sm:text-base text-[#656E66] font-light leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
