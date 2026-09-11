import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Trash2, 
  Check, 
  AlertCircle, 
  Eye, 
  RotateCcw,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';
import { MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../data/restaurantData';

interface AdminDishesTabProps {
  menuItems: MenuItem[];
  onOpenAddDish: () => void;
  onToggleAvailability: (dishId: string) => void;
  onDeleteDish: (dishId: string) => void;
  onResetDefaultMenu: () => void;
  onNotification: (msg: string) => void;
}

export function AdminDishesTab({
  menuItems,
  onOpenAddDish,
  onToggleAvailability,
  onDeleteDish,
  onResetDefaultMenu,
  onNotification
}: AdminDishesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredDishes = menuItems.filter(dish => {
    const matchesSearch =
      !searchQuery ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || dish.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = (dish: MenuItem) => {
    onDeleteDish(dish.id);
    setConfirmDeleteId(null);
    onNotification(`Dish "${dish.name}" removed from website.`);
  };

  const handleToggle = (dish: MenuItem) => {
    onToggleAvailability(dish.id);
    const newStatus = !dish.available ? 'In Stock' : 'Marked Out of Stock';
    onNotification(`"${dish.name}" is now ${newStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-[#18211A] border border-[#2D3F30] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-lg font-semibold text-white">
            Menu Catalog & Culinary Management
          </h3>
          <p className="text-xs text-[#828F84]">
            {menuItems.length} dishes published • Changes reflect immediately on the live customer website
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onResetDefaultMenu}
            title="Reset to default menu items"
            className="p-2 text-[#828F84] hover:text-white bg-[#141A15] hover:bg-[#243327] border border-[#2D3F30] rounded-xs text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddDish}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#2D4532] hover:bg-[#39573f] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish to Website</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#18211A] border border-[#2D3F30] p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#828F84]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dish title, ingredient, category..."
            className="w-full pl-9 pr-3 py-2 bg-[#121713] border border-[#2D3F30] rounded-xs text-xs text-white placeholder-[#828F84] focus:outline-none focus:border-[#A3B899]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {MENU_CATEGORIES.map(cat => {
            const count =
              cat.id === 'all'
                ? menuItems.length
                : menuItems.filter(d => d.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#2D4532] text-white'
                    : 'bg-[#141A15] text-[#828F84] hover:text-white border border-[#243327]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="bg-[#18211A] border border-[#2D3F30] p-12 text-center rounded-sm">
          <ChefHat className="w-8 h-8 text-[#828F84] mx-auto mb-3" />
          <p className="text-sm text-[#C8D1CA]">No dishes match your filter.</p>
          <button
            onClick={onOpenAddDish}
            className="mt-4 px-4 py-2 bg-[#2D4532] text-white text-xs font-medium uppercase tracking-wider rounded-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add a Dish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map(dish => (
            <div
              key={dish.id}
              className={`bg-[#18211A] border rounded-sm p-4 flex flex-col justify-between transition-all ${
                dish.available ? 'border-[#2D3F30] hover:border-[#3E5542]' : 'border-red-950/60 opacity-70'
              }`}
            >
              <div>
                {/* Top Image & Badges */}
                <div className="relative h-44 w-full rounded-xs overflow-hidden mb-3 bg-[#121713] border border-[#243327]">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className={`w-full h-full object-cover ${dish.available ? '' : 'grayscale'}`}
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Stock status pill */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs shadow-xs ${
                        dish.available
                          ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-600/60'
                          : 'bg-red-950/90 text-red-200 border border-red-700/80'
                      }`}
                    >
                      {dish.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {dish.featured && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-[#2D4532]/90 text-amber-200 border border-amber-600/50">
                        Featured on Home
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 backdrop-blur-xs rounded-xs font-serif-display font-bold text-sm text-[#A3B899] border border-white/10">
                    ৳ {dish.price.toLocaleString()}
                  </div>
                </div>

                {/* Dish Header Info */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif-display font-semibold text-base text-white">
                      {dish.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-[#243327] text-[#A3B899] shrink-0 font-medium">
                      {dish.category}
                    </span>
                  </div>

                  <p className="text-xs text-[#828F84] line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    {dish.vegetarian && (
                      <span className="text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded-xs border border-emerald-800/40">
                        🌱 Veg
                      </span>
                    )}
                    {dish.spicy && (
                      <span className="text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded-xs border border-amber-800/40">
                        🌶 Spicy
                      </span>
                    )}
                    {dish.popular && (
                      <span className="text-amber-300 bg-amber-950/50 px-1.5 py-0.5 rounded-xs border border-amber-800/40">
                        ★ Chef Pick
                      </span>
                    )}
                    {dish.prepTimeMinutes && (
                      <span className="text-[#828F84] text-[10px]">
                        ~{dish.prepTimeMinutes} mins
                      </span>
                    )}
                    {dish.calories && (
                      <span className="text-[#828F84] text-[10px]">
                        • {dish.calories}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 mt-3 border-t border-[#243327] flex items-center justify-between gap-2">
                {/* Availability Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(dish)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    dish.available
                      ? 'bg-[#1C251E] hover:bg-[#28362B] text-[#C8D1CA] border border-[#2D3F30]'
                      : 'bg-emerald-900/60 hover:bg-emerald-800/70 text-emerald-200 border border-emerald-700/50'
                  }`}
                >
                  <span>{dish.available ? 'Set Out of Stock' : 'Re-enable (In Stock)'}</span>
                </button>

                {/* Delete Dish */}
                {confirmDeleteId === dish.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(dish)}
                      className="px-2 py-1 bg-red-900 text-white text-[11px] rounded-xs font-semibold cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 bg-[#141A15] text-[#828F84] text-[11px] rounded-xs cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(dish.id)}
                    title="Remove from website"
                    className="p-1.5 text-[#828F84] hover:text-red-400 hover:bg-red-950/30 rounded-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
