import { Hero } from '../components/Hero';
import { QuickActionBar } from '../components/QuickActionBar';
import { AboutSection } from '../components/AboutSection';
import { SignatureDishes } from '../components/SignatureDishes';
import { HomeCategoryShowcases } from '../components/HomeCategoryShowcases';
import { ExperienceSection } from '../components/ExperienceSection';
import { ReservationCTA } from '../components/ReservationCTA';
import { ReviewsSection } from '../components/ReviewsSection';
import { LocationMapSection } from '../components/LocationMapSection';
import { InstagramSection } from '../components/InstagramSection';
import { GALLERY_ITEMS } from '../data/restaurantData';
import { useMenu } from '../context/MenuContext';
import { ArrowRight, Eye } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenLightbox: (index: number) => void;
}

export function HomeView({ onNavigate, onOpenLightbox }: HomeViewProps) {
  const { menuItems } = useMenu();
  const galleryPreview = GALLERY_ITEMS.slice(0, 6);

  return (
    <div id="home-view" className="space-y-0">
      {/* 2. Hero */}
      <Hero onNavigate={onNavigate} />

      {/* 3. Quick Actions */}
      <QuickActionBar onNavigate={onNavigate} />

      {/* 4. About / Introduction */}
      <AboutSection onNavigate={onNavigate} />

      {/* 5. Featured Dishes (Dishes marked with Add to Home) */}
      <SignatureDishes dishes={menuItems} onNavigate={onNavigate} />

      {/* 5.5. Categories added to Home Page */}
      <HomeCategoryShowcases onNavigate={onNavigate} />

      {/* 6. Restaurant Experience / Atmosphere */}
      <ExperienceSection />

      {/* 7. Full Menu CTA Banner */}
      <section className="py-16 bg-[#1A221C] text-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#A3B899] font-medium block mb-2">
              Explore Our Full Repertoire
            </span>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-normal">
              Slow-cooked braises, prime steaks, seafood & pasta.
            </h3>
            <p className="text-sm text-[#A8B2AA] mt-2 font-light max-w-xl">
              Prepared to order with seasonal ingredients and traditional continental techniques.
            </p>
          </div>
          <button
            id="explore-full-menu-cta-banner"
            onClick={() => onNavigate('menu')}
            className="shrink-0 inline-flex items-center gap-2.5 px-8 py-4 bg-[#FAF8F5] text-[#1E221E] hover:bg-[#EBE5DF] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all shadow-sm cursor-pointer"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 text-[#2D4532]" />
          </button>
        </div>
      </section>

      {/* 8. Gallery Preview */}
      <section id="gallery-preview-section" className="py-20 sm:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] block mb-2">
                Visual Journey
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
                Inside The Grove
              </h2>
            </div>
            <button
              id="view-full-gallery-btn"
              onClick={() => onNavigate('gallery')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#2D4532] hover:text-[#1A1E1B] transition-colors cursor-pointer group"
            >
              <span>View Full Gallery ({GALLERY_ITEMS.length})</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryPreview.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(idx)}
                className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#E8E2D8] shadow-xs cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-[#1A1E1B]/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-[#C5D0C7] mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-widest">{item.category}</span>
                  </div>
                  <h4 className="font-serif-display text-sm font-semibold">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Customer Reviews */}
      <ReviewsSection />

      {/* 10. Reservation CTA */}
      <ReservationCTA onNavigate={onNavigate} />

      {/* 11. Location / Map */}
      <LocationMapSection />

      {/* 12. Instagram / Social */}
      <InstagramSection />
    </div>
  );
}
