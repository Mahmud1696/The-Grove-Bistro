import { useState } from 'react';
import { GALLERY_ITEMS } from '../data/restaurantData';
import { Eye, Filter } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryViewProps {
  onOpenLightbox: (index: number) => void;
  onNavigate: (view: string) => void;
}

export function GalleryView({ onOpenLightbox, onNavigate }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Food', value: 'food' },
    { label: 'Interior', value: 'interior' },
    { label: 'Ambience', value: 'ambience' },
    { label: 'People & Kitchen', value: 'people' },
  ];

  const filteredItems = GALLERY_ITEMS.filter(
    item => selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory
  );

  return (
    <div id="gallery-page-view" className="pt-24 pb-28 bg-[#FAF8F5]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2D4532] block mb-3">
          Moments & Spaces • Dhaka
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1E1B] mb-4">
          Inside The Grove
        </h1>
        <p className="font-sans-ui text-base sm:text-lg text-[#5D6660] max-w-xl mx-auto font-light leading-relaxed">
          A visual glimpse into our culinary creations, warm interior spaces, and unhurried dining atmosphere on Level 12 of Hamid Tower.
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1E1B] text-white shadow-xs'
                    : 'bg-[#F3EFE9] hover:bg-[#EAE4DC] text-[#555E57]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry / Responsive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            // Find its index in the global GALLERY_ITEMS so lightbox navigates properly
            const globalIndex = GALLERY_ITEMS.findIndex(g => g.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(globalIndex >= 0 ? globalIndex : 0)}
                className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#EAE4DB] shadow-xs cursor-pointer border border-[#E0D9CD]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141A15]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A3B899] font-medium block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif-display text-base font-semibold leading-snug">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="font-sans-ui text-xs text-[#D1D9D3] font-light mt-1 line-clamp-1">
                      {item.caption}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#A3B899]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View fullscreen</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
