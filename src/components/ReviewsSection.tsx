import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/restaurantData';

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews-section" className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] block mb-2">
              Guest Impressions
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
              What our guests say.
            </h2>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              id="review-prev-btn"
              onClick={prev}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full border border-[#D9D2C7] flex items-center justify-center hover:bg-[#EFEAE2] text-[#1A1E1B] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="review-next-btn"
              onClick={next}
              aria-label="Next review"
              className="w-10 h-10 rounded-full border border-[#D9D2C7] flex items-center justify-center hover:bg-[#EFEAE2] text-[#1A1E1B] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((review, idx) => {
            const isHighlight = idx === currentIndex;
            return (
              <div
                key={review.id}
                id={`review-card-${review.id}`}
                className={`p-8 rounded-sm border transition-all duration-300 flex flex-col justify-between ${
                  isHighlight
                    ? 'bg-[#F5F1EB] border-[#2D4532]/40 shadow-sm'
                    : 'bg-[#FAF8F5] border-[#E6E0D6]'
                }`}
              >
                <div>
                  {/* Rating Stars & Quote */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-amber-600">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#C8BFB4]" />
                  </div>

                  <p className="font-sans-ui text-sm sm:text-base text-[#464D47] font-light leading-relaxed mb-6 italic">
                    "{review.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#EAE4DB]">
                  <img
                    src={review.avatar}
                    alt={review.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-[#DDD6CB]"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-serif-display text-sm font-semibold text-[#1A1E1B]">
                      {review.customerName}
                    </h4>
                    <p className="text-xs text-[#7B837C]">
                      {review.visitType} • {review.date}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
