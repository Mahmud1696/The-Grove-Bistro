import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS, RESTAURANT_INFO } from '../data/restaurantData';

export function ReviewsSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const totalReviews = TESTIMONIALS.length;

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth < 640) {
        setPageSize(1);
      } else if (window.innerWidth < 1024) {
        setPageSize(2);
      } else {
        setPageSize(3);
      }
    };
    updatePageSize();
    window.addEventListener('resize', updatePageSize, { passive: true });
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  const prev = () => {
    setStartIndex(prev => (prev === 0 ? Math.max(0, totalReviews - pageSize) : Math.max(0, prev - 1)));
  };

  const next = () => {
    setStartIndex(prev => (prev + pageSize >= totalReviews ? 0 : prev + 1));
  };

  // Slice visible reviews, wrap around if needed
  const visibleReviews = TESTIMONIALS.slice(startIndex, startIndex + pageSize);
  if (visibleReviews.length < pageSize && totalReviews >= pageSize) {
    visibleReviews.push(...TESTIMONIALS.slice(0, pageSize - visibleReviews.length));
  }

  const googleMapsUrl = RESTAURANT_INFO.googleMapsUrl;

  return (
    <section id="reviews-section" className="py-16 sm:py-24 lg:py-28 bg-[#FAF8F5] border-t border-[#EAE4DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            {/* Google Maps Authenticity Header Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-white border border-[#DDD5CA] shadow-2xs text-[11px] font-semibold text-[#1B3B2B]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Google Maps Verified Reviews</span>
              </span>

              <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>4.5 / 5.0 Rating</span>
              </span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
              What our guests say.
            </h2>
            <p className="text-sm sm:text-base text-[#5D6660] font-light max-w-xl mt-2">
              Authentic reviews from diners visiting The Grove Bistro on Level 12, Hamid Tower, Gulshan-2.
            </p>
          </div>

          {/* Action buttons & carousel navigation */}
          <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
            <a
              id="view-all-google-reviews-btn"
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-white hover:bg-[#F3EFE9] border border-[#2D4532] text-[#2D4532] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer shadow-2xs min-h-[44px]"
            >
              <span>Read on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-2">
              <button
                id="review-prev-btn"
                onClick={prev}
                aria-label="Previous review"
                className="w-11 h-11 rounded-xs border border-[#D9D2C7] bg-white flex items-center justify-center hover:bg-[#EFEAE2] text-[#1A1E1B] transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="review-next-btn"
                onClick={next}
                aria-label="Next review"
                className="w-11 h-11 rounded-xs border border-[#D9D2C7] bg-white flex items-center justify-center hover:bg-[#EFEAE2] text-[#1A1E1B] transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              id={`review-card-${review.id}`}
              className="p-7 sm:p-8 rounded-sm border border-[#E3DDD4] bg-white shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div>
                {/* Header: Star rating & Google badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs bg-[#FAF8F5] border border-stone-200 text-stone-600">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Google Maps</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="font-sans-ui text-xs sm:text-sm text-[#464D47] font-light leading-relaxed mb-6 italic">
                  "{review.review}"
                </p>
              </div>

              {/* Reviewer Meta Footer */}
              <div className="pt-4 border-t border-[#F0EBE3] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={review.avatar}
                    alt={review.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-[#DDD6CB] shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif-display text-sm font-semibold text-[#1A1E1B] truncate">
                        {review.customerName}
                      </h4>
                      {review.isLocalGuide && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded-xs shrink-0" title="Google Local Guide">
                          Local Guide
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7B837C] truncate mt-0.5">
                      {review.visitType} {review.reviewCount ? `• ${review.reviewCount}` : ''}
                    </p>
                  </div>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-[#2D4532] p-1.5 transition-colors cursor-pointer shrink-0"
                  title="View this review on Google Maps"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(totalReviews / pageSize) }).map((_, dotIdx) => {
            const isActive = Math.floor(startIndex / pageSize) === dotIdx;
            return (
              <button
                key={dotIdx}
                onClick={() => setStartIndex(dotIdx * pageSize)}
                aria-label={`Go to reviews page ${dotIdx + 1}`}
                className={`transition-all cursor-pointer rounded-full ${
                  isActive
                    ? 'w-6 h-2 bg-[#2D4532]'
                    : 'w-2 h-2 bg-[#D8D0C5] hover:bg-[#A89F94]'
                }`}
              />
            );
          })}
        </div>

        {/* Bottom Banner with Direct Google Link */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 bg-[#F4EFE8] rounded-sm border border-[#E3DDD4] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#DDD5CA] shadow-2xs flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <h4 className="font-serif-display text-base sm:text-lg font-semibold text-[#1A1E1B]">
                Have you dined at The Grove Bistro?
              </h4>
              <p className="text-xs sm:text-sm text-[#5D6660]">
                We value your culinary feedback on Google Maps. Share your experience with fellow diners in Dhaka.
              </p>
            </div>
          </div>

          <a
            id="write-google-review-btn"
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-2xs min-h-[44px]"
          >
            <span>Write a Google Review</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
