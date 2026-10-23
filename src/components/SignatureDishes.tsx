import { useState } from 'react';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';

interface SignatureDishesProps {
  dishes: MenuItem[];
  onNavigate: (view: string) => void;
}

export function SignatureDishes({ dishes, onNavigate }: SignatureDishesProps) {
  const { addItem } = useCart();
  const [addedDishId, setAddedDishId] = useState<string | null>(null);

  const featured = dishes.filter(d => d.featured);

  const handleAdd = (dish: MenuItem) => {
    addItem(dish, 1);
    setAddedDishId(dish.id);
    setTimeout(() => {
      setAddedDishId(null);
    }, 1400);
  };

  return (
    <section id="signature-dishes-section" className="py-20 sm:py-24 bg-[#F5F1EB] border-y border-[#E8E1D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] block mb-2">
              Culinary Highlights
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
              A taste of The Grove
            </h2>
          </div>
          <button
            id="view-full-menu-btn-top"
            onClick={() => onNavigate('menu')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#2D4532] hover:text-[#1A1E1B] transition-colors cursor-pointer group"
          >
            <span>Explore Full Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Dish Cards Grid / Mobile Carousel */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {featured.map(dish => {
            const isJustAdded = addedDishId === dish.id;

            return (
              <div
                key={dish.id}
                id={`dish-card-${dish.id}`}
                className="group flex-shrink-0 w-[290px] sm:w-auto snap-center bg-[#FAF8F5] border border-[#E3DDD4] rounded-sm overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[16/11] overflow-hidden bg-[#EAE4DB]">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A1E1B]/80 backdrop-blur-xs text-[#FAF8F5] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-xs">
                    {dish.category.replace('-', ' ')}
                  </div>
                  {dish.spicy && (
                    <div className="absolute top-3 right-3 bg-red-900/80 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-xs">
                      Spicy
                    </div>
                  )}
                  {dish.vegetarian && (
                    <div className="absolute top-3 right-3 bg-[#2D4532]/90 backdrop-blur-xs text-white text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-xs">
                      Vegetarian
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif-display text-lg sm:text-xl font-semibold text-[#1A1E1B] leading-snug">
                        {dish.name}
                      </h3>
                      <span className="font-sans-ui text-sm sm:text-base font-bold text-[#2D4532] whitespace-nowrap">
                        ৳ {dish.price.toLocaleString()}
                      </span>
                    </div>

                    <p className="font-sans-ui text-xs sm:text-sm text-[#656E66] line-clamp-2 leading-relaxed mb-6 font-light">
                      {dish.description}
                    </p>
                  </div>

                  {/* Add to Order Button */}
                  <button
                    id={`add-order-${dish.id}`}
                    onClick={() => handleAdd(dish)}
                    disabled={!dish.available}
                    className={`w-full min-h-[44px] py-3 px-4 rounded-xs text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                      isJustAdded
                        ? 'bg-[#2D4532] text-white'
                        : 'bg-[#EAE4DA] hover:bg-[#2D4532] text-[#1A1E1B] hover:text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Added to Order</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-center mt-3 text-xs text-[#8A928B]">
          Swipe to view more signature dishes →
        </div>
      </div>
    </section>
  );
}
