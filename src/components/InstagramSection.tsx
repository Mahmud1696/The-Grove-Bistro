import { Instagram, ArrowUpRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export function InstagramSection() {
  const instaImages = [
    {
      id: 'ig-1',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      alt: 'Slow Cooked Beef Short Ribs at The Grove',
    },
    {
      id: 'ig-2',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      alt: 'Level 12 dining room evening vibes',
    },
    {
      id: 'ig-3',
      url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
      alt: 'Handmade fresh pasta ribbons',
    },
    {
      id: 'ig-4',
      url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
      alt: 'Artisan coffee and mocktails',
    },
  ];

  return (
    <section id="social-section" className="py-20 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] block mb-2">
              @thegrovebistro.dhaka
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#1A1E1B]">
              Follow the experience.
            </h2>
          </div>

          <a
            id="follow-instagram-btn"
            href={RESTAURANT_INFO.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#1A1E1B] hover:text-[#2D4532] transition-colors group"
          >
            <Instagram className="w-4 h-4 text-[#2D4532]" />
            <span>Follow Us on Instagram</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 4 Instagram Style Images */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {instaImages.map(img => (
            <a
              key={img.id}
              href={RESTAURANT_INFO.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-sm overflow-hidden bg-[#EAE4DB] shadow-xs cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-[#1A1E1B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-7 h-7 transform scale-75 group-hover:scale-100 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
