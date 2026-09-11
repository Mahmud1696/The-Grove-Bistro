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
      <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-display text-lg font-bold text-gray-900">
            Menu Catalog & Culinary Management
          </h3>
          <p className="text-xs text-gray-500">
            {menuItems.length} dishes published • Changes reflect immediately on the live customer website
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onResetDefaultMenu}
            title="Reset to default menu items"
            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xs text-xs transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddDish}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish to Website</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dish title, ingredient, category..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xs text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
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
                className={`px-3 py-1.5 text-xs rounded-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
        <div className="bg-white border border-gray-200 p-12 text-center rounded-sm shadow-xs">
          <ChefHat className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900">No dishes match your filter.</p>
          <button
            onClick={onOpenAddDish}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-medium uppercase tracking-wider rounded-xs inline-flex items-center gap-2 cursor-pointer shadow-xs hover:bg-black"
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
              className={`bg-white border rounded-sm p-4 flex flex-col justify-between shadow-xs transition-all ${
                dish.available ? 'border-gray-200 hover:border-gray-300' : 'border-red-200 bg-red-50/20'
              }`}
            >
              <div>
                {/* Top Image & Badges */}
                <div className="relative h-44 w-full rounded-xs overflow-hidden mb-3 bg-gray-100 border border-gray-200">
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
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs shadow-xs border ${
                        dish.available
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      {dish.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {dish.featured && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-amber-50 text-amber-900 border border-amber-300 shadow-xs">
                        Featured on Home
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-xs font-serif-display font-bold text-sm text-gray-900 border border-gray-200 shadow-xs">
                    ৳ {dish.price.toLocaleString()}
                  </div>
                </div>

                {/* Dish Header Info */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif-display font-bold text-base text-gray-900">
                      {dish.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-gray-100 text-gray-700 shrink-0 font-semibold border border-gray-200">
                      {dish.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    {dish.vegetarian && (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200 font-medium">
                        🌱 Veg
                      </span>
                    )}
                    {dish.spicy && (
                      <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-xs border border-amber-200 font-medium">
                        🌶 Spicy
                      </span>
                    )}
                    {dish.popular && (
                      <span className="text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded-xs border border-amber-300 font-medium">
                        ★ Chef Pick
                      </span>
                    )}
                    {dish.prepTimeMinutes && (
                      <span className="text-gray-500 text-[10px]">
                        ~{dish.prepTimeMinutes} mins
                      </span>
                    )}
                    {dish.calories && (
                      <span className="text-gray-500 text-[10px]">
                        • {dish.calories}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                {/* Availability Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(dish)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    dish.available
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  }`}
                >
                  <span>{dish.available ? 'Set Out of Stock' : 'Re-enable (In Stock)'}</span>
                </button>

                {/* Delete Dish */}
                {confirmDeleteId === dish.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(dish)}
                      className="px-2 py-1 bg-red-600 text-white text-[11px] rounded-xs font-semibold cursor-pointer hover:bg-red-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-[11px] rounded-xs cursor-pointer border border-gray-300"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(dish.id)}
                    title="Remove from website"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
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
