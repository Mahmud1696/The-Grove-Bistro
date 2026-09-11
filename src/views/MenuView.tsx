import { useState, useMemo } from 'react';
import { Search, Plus, Check, Filter, Sparkles } from 'lucide-react';
import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '../data/restaurantData';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

interface MenuViewProps {
  onNavigate: (view: string) => void;
}

export function MenuView({ onNavigate }: MenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'vegetarian' | 'popular'>('all');
  const [addedDishId, setAddedDishId] = useState<string | null>(null);

  const { addItem, openCart } = useCart();

  const handleAdd = (dish: MenuItem) => {
    addItem(dish, 1);
    setAddedDishId(dish.id);
    setTimeout(() => setAddedDishId(null), 1400);
  };

  const filteredDishes = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter(dish => {
      // Category check
      const matchesCategory =
        selectedCategory === 'all' || dish.category === selectedCategory;

      // Dietary check
      const matchesDietary =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'vegetarian' && dish.vegetarian) ||
        (dietaryFilter === 'popular' && dish.popular);

      // Search check
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q);

      return matchesCategory && matchesDietary && matchesSearch;
    });
  }, [selectedCategory, dietaryFilter, searchQuery]);

  return (
    <div id="menu-page-view" className="pt-24 pb-28 bg-[#FAF8F5]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2D4532] block mb-3">
          Culinary Repertoire • Dhaka
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1E1B] mb-4">
          The Grove Menu
        </h1>
        <p className="font-sans-ui text-base sm:text-lg text-[#5D6660] max-w-2xl mx-auto font-light leading-relaxed">
          From slow-simmered braises and handmade pasta to coastal seafood and artisan sweets. Thoughtfully prepared on Level 12, Hamid Tower.
        </p>
      </div>

      {/* Search & Sticky Filter Bar */}
      <div className="sticky top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-y border-[#E6E0D6] py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Top Row: Search Input & Dietary Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7E8880]" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search our menu (e.g. Truffle, Sea Bass, Ribs)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD5CA] rounded-sm text-xs text-[#1A1E1B] focus:outline-none focus:border-[#2D4532] shadow-2xs placeholder:text-[#9A9F9B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#8A928B] hover:text-[#1A1E1B]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Dietary Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs text-[#7E8880] flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                  dietaryFilter === 'all'
                    ? 'bg-[#2D4532] text-white'
                    : 'bg-[#EFEAE2] text-[#4F5751] hover:bg-[#E4DDD3]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('vegetarian')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                  dietaryFilter === 'vegetarian'
                    ? 'bg-[#2D4532] text-white'
                    : 'bg-[#EFEAE2] text-[#4F5751] hover:bg-[#E4DDD3]'
                }`}
              >
                Vegetarian
              </button>
              <button
                onClick={() => setDietaryFilter('popular')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                  dietaryFilter === 'popular'
                    ? 'bg-[#2D4532] text-white'
                    : 'bg-[#EFEAE2] text-[#4F5751] hover:bg-[#E4DDD3]'
                }`}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Bottom Row: Horizontal Scrollable Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {MENU_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.slug}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap rounded-xs transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1E1B] text-white shadow-xs'
                      : 'bg-[#FAF8F5] hover:bg-[#EFEAE2] text-[#555E57]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dishes List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {filteredDishes.length === 0 ? (
          /* Empty Search State */
          <div id="menu-empty-state" className="text-center py-20 bg-white border border-[#E3DDD4] rounded-sm p-8">
            <div className="w-16 h-16 rounded-full bg-[#F3EFE9] flex items-center justify-center text-[#7F8881] mx-auto mb-4">
              <Search className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-serif-display text-2xl font-medium text-[#1A1E1B] mb-2">
              No dishes found.
            </h3>
            <p className="text-sm text-[#6F7770] mb-6 max-w-sm mx-auto">
              No dishes match "{searchQuery}". Try adjusting your keywords or clearing the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDietaryFilter('all');
              }}
              className="px-6 py-2.5 bg-[#2D4532] text-white text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#233727] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDishes.map(dish => {
              const isJustAdded = addedDishId === dish.id;

              return (
                <div
                  key={dish.id}
                  id={`menu-dish-${dish.id}`}
                  className="group bg-white border border-[#E6E0D6] rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE4DB]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#1A1E1B]/80 backdrop-blur-xs text-[#FAF8F5] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-xs">
                      {dish.category.replace('-', ' ')}
                    </div>
                    {dish.popular && (
                      <div className="absolute top-3 right-3 bg-amber-700/90 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Popular</span>
                      </div>
                    )}
                  </div>

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

                      <p className="font-sans-ui text-xs sm:text-sm text-[#666F67] leading-relaxed mb-6 font-light">
                        {dish.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-[11px] text-[#7F8881]">
                        {dish.prepTimeMinutes && <span>~{dish.prepTimeMinutes} mins</span>}
                        {dish.calories && <span>• {dish.calories}</span>}
                        {dish.vegetarian && (
                          <span className="text-emerald-700 font-medium">• Veg</span>
                        )}
                        {dish.spicy && (
                          <span className="text-red-700 font-medium">• Spicy</span>
                        )}
                      </div>

                      <button
                        id={`menu-add-${dish.id}`}
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
    </div>
  );
}
