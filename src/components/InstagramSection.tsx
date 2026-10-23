import { Instagram, ArrowUpRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export function InstagramSection() {
  const instaImages = [
    {
      id: 'ig-1',
      url: '/assets/aistudio/747753191_1083828523981613_1738728827763148336_n_99727991.jpg',
      alt: 'The Grove artisan coffee by laptop on level 12',
      caption: 'Slow mornings & specialty roast coffee at The Grove'
    },
    {
      id: 'ig-2',
      url: '/assets/aistudio/745546055_1083828587314940_1887363832029969781_n_6341a8e4.jpg',
      alt: 'Cozy warm corner with amber lighting and wooden bistro tables',
      caption: 'Warm ambient nooks framed in vintage European bistronomy'
    },
    {
      id: 'ig-3',
      url: '/assets/aistudio/745019829_1083828577314941_875227384916130874_n_528e9966.jpg',
      alt: 'Sunlit banquet dining table overlooking lush foliage on Hamid Tower',
      caption: 'Gatherings framed by verdant terrace botanicals'
    },
    {
      id: 'ig-4',
      url: '/assets/aistudio/714930613_1045228344508298_5916473412862540533_n_2dddfe3d.jpg',
      alt: 'Charred prime steak with whipped potatoes, garden vegetables & citrus cooler',
      caption: 'Chef-crafted prime steaks and refreshing mocktail pairings'
    },
  ];

  const instagramUrl = RESTAURANT_INFO.social.instagram || 'https://www.instagram.com/grovebistro/';

  return (
    <section id="social-section" className="py-20 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] hover:underline inline-flex items-center gap-1.5 mb-2 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@grovebistro</span>
            </a>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#1A1E1B]">
              Follow the experience.
            </h2>
          </div>

          <a
            id="follow-instagram-btn"
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#1A1E1B] hover:text-[#2D4532] transition-colors group"
          >
            <Instagram className="w-4 h-4 text-[#2D4532]" />
            <span>Follow us on Instagram</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 4 Instagram Real Photos Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {instaImages.map(img => (
            <a
              key={img.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-sm overflow-hidden bg-[#EAE4DB] shadow-xs cursor-pointer block border border-[#E5DFD4]"
              title={`View on Instagram @grovebistro`}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-[#142318]/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white text-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2 text-white">
                  <Instagram className="w-5 h-5 transform scale-90 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200">
                  @grovebistro
                </span>
                <span className="text-[10px] text-stone-200 mt-1 line-clamp-2 leading-tight px-2 font-light">
                  {img.caption}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
