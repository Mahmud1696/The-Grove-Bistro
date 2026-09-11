import { MapPin, Sparkles, Award, Heart, Utensils, Compass } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div id="about-page-view" className="pt-24 pb-28 bg-[#FAF8F5]">
      {/* Top Hero / Heading */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2D4532] block mb-3">
          Our Heritage & Philosophy
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1E1B] mb-6">
          A culinary sanctuary above Gulshan.
        </h1>
        <p className="font-sans-ui text-base sm:text-lg text-[#555E57] max-w-2xl mx-auto font-light leading-relaxed">
          The Grove Bistro was established on Level 12 of Hamid Tower with a single conviction: dining out should be an unhurried communion of exceptional food, warm space, and gracious hospitality.
        </p>
      </div>

      {/* Large Featured Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative aspect-[21/9] rounded-sm overflow-hidden bg-[#E5DFD4] shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80"
            alt="Interior of The Grove Bistro at Hamid Tower Gulshan"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white text-xs tracking-widest uppercase font-light">
            Hamid Tower, Level 12 • Gulshan-2, Dhaka
          </div>
        </div>
      </div>

      {/* Story Text 2-Column Split */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-start">
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#1A1E1B] mb-6 leading-snug">
              Elevating contemporary dining in Dhaka.
            </h2>
            <p className="font-sans-ui text-sm sm:text-base text-[#555E57] font-light leading-relaxed mb-4">
              Perched twelve floors above the vibrant circle of Gulshan-2, The Grove Bistro offers a tranquil retreat from the city's pulse. Inside, soft architectural lighting, natural textures, and subtle greenery frame panoramic perspectives of the capital skyline.
            </p>
            <p className="font-sans-ui text-sm sm:text-base text-[#555E57] font-light leading-relaxed">
              We approach each plate with respect for international bistronomy—combining French and Mediterranean precision with vibrant, fresh ingredients and comforting, generous flavors.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[#F5F1EB] rounded-sm border border-[#E6E0D6]">
              <div className="flex items-center gap-3 text-[#2D4532] mb-2 font-serif-display text-lg font-semibold">
                <Utensils className="w-5 h-5" />
                <span>Culinary Ethos</span>
              </div>
              <p className="text-xs sm:text-sm text-[#666F67] leading-relaxed font-light">
                From 48-hour slow-cooked beef ribs to handmade agnolotti and fresh Bay seafood, we avoid culinary shortcuts. Every sauce and stock is made in-house daily.
              </p>
            </div>

            <div className="p-6 bg-[#F5F1EB] rounded-sm border border-[#E6E0D6]">
              <div className="flex items-center gap-3 text-[#2D4532] mb-2 font-serif-display text-lg font-semibold">
                <Heart className="w-5 h-5" />
                <span>Unhurried Hospitality</span>
              </div>
              <p className="text-xs sm:text-sm text-[#666F67] leading-relaxed font-light">
                Whether celebrating milestone anniversaries, hosting a business luncheon, or sharing weekend brunch with loved ones, our service is attentive yet respectfully discreet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="bg-[#F3EFEA] border-y border-[#E8E1D7] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] block mb-2">
              Our Commitments
            </span>
            <h3 className="font-serif-display text-3xl font-normal text-[#1A1E1B]">
              The Grove Standard
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-[#E2DBD0]">
              <div className="w-10 h-10 rounded-full bg-[#EAE3D8] text-[#2D4532] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif-display text-lg font-semibold text-[#1A1E1B] mb-2">
                Prime Sourcing
              </h4>
              <p className="text-xs text-[#6B746C] leading-relaxed font-light">
                Hand-selected Angus cuts, authentic Italian semolina pasta, and fresh daily market produce.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-[#E2DBD0]">
              <div className="w-10 h-10 rounded-full bg-[#EAE3D8] text-[#2D4532] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-serif-display text-lg font-semibold text-[#1A1E1B] mb-2">
                Skyline Vistas
              </h4>
              <p className="text-xs text-[#6B746C] leading-relaxed font-light">
                Level 12 of Hamid Tower provides an elevated dining perspective overlooking Gulshan Circle 2.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-[#E2DBD0]">
              <div className="w-10 h-10 rounded-full bg-[#EAE3D8] text-[#2D4532] flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif-display text-lg font-semibold text-[#1A1E1B] mb-2">
                Chef Craftsmanship
              </h4>
              <p className="text-xs text-[#6B746C] leading-relaxed font-light">
                Trained culinary artists dedicated to consistent culinary execution, balance, and artistic plating.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-xs border border-[#E2DBD0]">
              <div className="w-10 h-10 rounded-full bg-[#EAE3D8] text-[#2D4532] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-serif-display text-lg font-semibold text-[#1A1E1B] mb-2">
                Warm Welcome
              </h4>
              <p className="text-xs text-[#6B746C] leading-relaxed font-light">
                Accessible, gracious service designed to make every diner feel completely at home.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center">
        <h3 className="font-serif-display text-3xl font-medium text-[#1A1E1B] mb-4">
          Experience it for yourself.
        </h3>
        <p className="text-sm text-[#666F67] max-w-md mx-auto mb-8 font-light">
          We invite you to reserve an evening table or stop by for a casual lunch on Gulshan Circle 2.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('reservations')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
          >
            Reserve a Table
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#DDD5CA] hover:bg-[#EFEAE2] text-[#1A1E1B] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
          >
            Explore the Menu
          </button>
        </div>
      </div>
    </div>
  );
}
