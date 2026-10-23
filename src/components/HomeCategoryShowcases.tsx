import React, { useState } from 'react';
import { Plus, Check, ArrowRight, Sparkles, ChefHat } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { MenuItem, MenuCategory } from '../types';

interface HomeCategoryShowcasesProps {
  onNavigate: (view: string) => void;
}

export function HomeCategoryShowcases({ onNavigate }: HomeCategoryShowcasesProps) {
  const { categories, menuItems } = useMenu();
  const { addItem } = useCart();
  const [addedDishId, setAddedDishId] = useState<string | null>(null);

  // Filter only categories that have "Add to Home" enabled
  const homeCategories = categories.filter(cat => cat.addToHome);

  if (homeCategories.length === 0) {
    return null;
  }

  const handleAdd = (dish: MenuItem) => {
    addItem(dish, 1);
    setAddedDishId(dish.id);
    setTimeout(() => {
      setAddedDishId(null);
    }, 1400);
  };

  return (
    <div className="space-y-0">
      {homeCategories.map((category, catIdx) => {
        const categoryDishes = menuItems.filter(
          item => item.category === category.id && item.available
        );

        // Alternating background surfaces for visual variety
        const isAlternateBg = catIdx % 2 === 1;

        return (
          <section
            key={category.id}
            id={`home-category-section-${category.id}`}
            className={`py-20 sm:py-24 border-b border-[#E8E1D7] ${
              isAlternateBg ? 'bg-[#F2ECE3]' : 'bg-[#FAF8F5]'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Category Showcase Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532]">
                      Category Showcase
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D4532]"></span>
                    <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                      {categoryDishes.length} {categoryDishes.length === 1 ? 'Dish' : 'Dishes'}
                    </span>
                  </div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="font-sans-ui text-sm sm:text-base text-[#5D6660] max-w-2xl mt-2 font-light leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('menu')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#2D4532] hover:text-[#1A1E1B] transition-colors cursor-pointer group shrink-0"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Category Dishes Grid */}
              {categoryDishes.length === 0 ? (
                <div className="bg-white/80 border border-[#E3DDD4] rounded-sm p-8 text-center max-w-md mx-auto">
                  <ChefHat className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-[#5D6660] font-medium">
                    New artisanal dishes for {category.name} are being prepared in our kitchen.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {categoryDishes.map(dish => {
                    const isJustAdded = addedDishId === dish.id;

                    return (
                      <div
                        key={dish.id}
                        id={`home-cat-dish-${dish.id}`}
                        className="group bg-white border border-[#E3DDD4] rounded-sm overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md"
                      >
                        {/* Dish Image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE4DB]">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                          />

                          {/* Category Tag */}
                          <div className="absolute top-3 left-3 bg-[#1A1E1B]/80 backdrop-blur-xs text-[#FAF8F5] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-xs">
                            {category.name}
                          </div>

                          {dish.popular && (
                            <div className="absolute top-3 right-3 bg-amber-700/90 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-xs">
                              <Sparkles className="w-3 h-3" />
                              <span>Popular</span>
                            </div>
                          )}
                        </div>

                        {/* Dish Details */}
                        <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-serif-display text-lg sm:text-xl font-semibold text-[#1A1E1B] leading-snug">
                                {dish.name}
                              </h3>
                              <span className="font-sans-ui text-sm sm:text-base font-bold text-[#2D4532] shrink-0">
                                ৳ {dish.price.toLocaleString()}
                              </span>
                            </div>

                            <p className="font-sans-ui text-xs sm:text-sm text-[#666F67] leading-relaxed mb-6 font-light line-clamp-3">
                              {dish.description}
                            </p>
                          </div>

                          {/* Footer specifications & Add to Order button */}
                          <div className="space-y-3 pt-2 border-t border-[#EAE4DC]">
                            <div className="flex items-center gap-2 text-[11px] text-[#7F8881]">
                              {dish.prepTimeMinutes && <span>~{dish.prepTimeMinutes} mins</span>}
                              {dish.calories && <span>• {dish.calories}</span>}
                              {dish.vegetarian && (
                                <span className="text-emerald-700 font-semibold">• Veg</span>
                              )}
                              {dish.spicy && (
                                <span className="text-red-700 font-semibold">• Spicy</span>
                              )}
                            </div>

                            <button
                              id={`home-cat-add-${dish.id}`}
                              onClick={() => handleAdd(dish)}
                              className={`w-full py-2.5 px-4 rounded-xs text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                                isJustAdded
                                  ? 'bg-[#2D4532] text-white'
                                  : 'bg-[#FAF8F5] hover:bg-[#2D4532] border border-[#DDD5CA] hover:border-[#2D4532] text-[#1A1E1B] hover:text-white'
                              }`}
                            >
                              {isJustAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-white" />
                                  <span>Added to Cart</span>
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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
