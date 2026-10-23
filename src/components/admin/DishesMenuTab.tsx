import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Copy, 
  RotateCcw, 
  Check, 
  X, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Flame, 
  Leaf, 
  Star,
  ChefHat
} from 'lucide-react';
import { MenuItem } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { EditDishModal } from './EditDishModal';

interface DishesMenuTabProps {
  menuItems: MenuItem[];
  onOpenAddDish: () => void;
  onToggleAvailability: (dishId: string) => void;
  onDeleteDish: (dishId: string) => void;
  onDuplicateDish: (dishId: string) => void;
  onUpdateDish: (dishId: string, updates: Partial<MenuItem>) => void;
  onResetDefaultMenu: () => void;
  onNotification: (msg: string) => void;
}

export function DishesMenuTab({
  menuItems,
  onOpenAddDish,
  onToggleAvailability,
  onDeleteDish,
  onDuplicateDish,
  onUpdateDish,
  onResetDefaultMenu,
  onNotification
}: DishesMenuTabProps) {
  const { categories } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock' | 'featured'>('all');
  
  const allCategories = useMemo(() => [
    { id: 'all', name: 'All Dishes', slug: 'all' },
    ...categories
  ], [categories]);

  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [deleteConfirmDish, setDeleteConfirmDish] = useState<MenuItem | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const filteredDishes = useMemo(() => {
    return menuItems.filter(dish => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q)
      );

      const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = dish.available;
      if (stockFilter === 'out_of_stock') matchesStock = !dish.available;
      if (stockFilter === 'featured') matchesStock = Boolean(dish.featured);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [menuItems, searchQuery, selectedCategory, stockFilter]);

  const handleToggle = (dish: MenuItem) => {
    onToggleAvailability(dish.id);
    const newStatus = !dish.available ? 'In Stock (Available)' : 'Marked Out of Stock';
    onNotification(`"${dish.name}" is now ${newStatus}.`);
  };

  const handleToggleFeatured = (dish: MenuItem) => {
    onUpdateDish(dish.id, { featured: !dish.featured });
    onNotification(`"${dish.name}" homepage featured status updated.`);
  };

  const handleDuplicate = (dish: MenuItem) => {
    onDuplicateDish(dish.id);
    onNotification(`Cloned "${dish.name}" as a new draft dish.`);
  };

  const handleDelete = () => {
    if (!deleteConfirmDish) return;
    onDeleteDish(deleteConfirmDish.id);
    onNotification(`"${deleteConfirmDish.name}" was deleted from menu.`);
    setDeleteConfirmDish(null);
  };

  const handleReset = () => {
    onResetDefaultMenu();
    setShowResetConfirm(false);
    onNotification('Menu reset to culinary defaults.');
  };

  return (
    <div className="space-y-5">
      {/* Search, Filter Bar and Contextual Actions */}
      <div className="bg-white border border-stone-200 p-4 rounded-md shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dishes by title, ingredient..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-stone-900"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              {allCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-sm text-xs text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="all">All Availability</option>
              <option value="in_stock">In Stock Only</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="featured">On Home (Add to Home)</option>
            </select>

            {/* Add Dish Primary Action */}
            <button
              type="button"
              onClick={onOpenAddDish}
              className="px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dish</span>
            </button>

            {/* Reset to Default */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer border border-stone-200"
              title="Reset menu to original restaurant catalog"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills / Segmented Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-stone-100">
          {allCategories.map(cat => {
            const count = cat.id === 'all' 
              ? menuItems.length 
              : menuItems.filter(m => m.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.length > 0 ? (
          filteredDishes.map(dish => (
            <div
              key={dish.id}
              className={`bg-white border rounded-md shadow-2xs overflow-hidden flex flex-col justify-between transition-all ${
                dish.available ? 'border-stone-200' : 'border-stone-300 bg-stone-50/70 opacity-85'
              }`}
            >
              {/* Card Top: Image + Badges */}
              <div className="relative h-44 bg-stone-100 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Overlays / Unboxed indicators */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {!dish.available && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white rounded-xs shadow-xs">
                      Out of Stock (86'd)
                    </span>
                  )}
                  {dish.featured && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#1B3B2B] text-white rounded-xs shadow-xs flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>On Home</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-xs text-[11px] font-mono font-bold">
                  ৳ {dish.price.toLocaleString()}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5 flex-1">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 capitalize">
                    {dish.category}
                    {dish.prepTimeMinutes && ` · ${dish.prepTimeMinutes} mins`}
                    {dish.calories && ` · ${dish.calories}`}
                  </div>
                  <h4 className="font-serif-display text-sm font-bold text-stone-900 mt-0.5 leading-snug">
                    {dish.name}
                  </h4>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500 font-medium">
                  {dish.vegetarian && (
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Leaf className="w-3 h-3" />
                      <span>Veg</span>
                    </span>
                  )}
                  {dish.spicy && (
                    <span className="flex items-center gap-1 text-orange-700">
                      <Flame className="w-3 h-3" />
                      <span>Spicy</span>
                    </span>
                  )}
                  {dish.popular && (
                    <span className="text-amber-700">
                      Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                {/* Availability Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggle(dish)}
                  className={`px-2.5 py-1 rounded-sm font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1.5 border ${
                    dish.available
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
                  }`}
                  title={dish.available ? 'Click to mark Out of Stock' : 'Click to make Available'}
                >
                  {dish.available ? <Check className="w-3 h-3 text-emerald-700" /> : <EyeOff className="w-3 h-3" />}
                  <span>{dish.available ? 'In Stock' : 'Out of Stock'}</span>
                </button>

                {/* Edit, Clone, Delete Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(dish)}
                    className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                      dish.featured 
                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                        : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                    }`}
                    title={dish.featured ? 'Remove from homepage features' : 'Feature on homepage'}
                  >
                    <Star className={`w-3.5 h-3.5 ${dish.featured ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(dish)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-sm transition-colors cursor-pointer"
                    title="Duplicate dish"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingDish(dish)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-sm transition-colors cursor-pointer"
                    title="Edit dish"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmDish(dish)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
                    title="Delete dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-stone-400">
            No dishes found matching your search.
          </div>
        )}
      </div>

      {/* Edit Dish Modal */}
      <EditDishModal
        isOpen={Boolean(editingDish)}
        dish={editingDish}
        onClose={() => setEditingDish(null)}
        onSaveDish={(id, updates) => {
          onUpdateDish(id, updates);
          onNotification(`Dish updated successfully.`);
          setEditingDish(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmDish && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">Delete Menu Dish</h4>
                <p className="text-xs text-stone-500">Permanent menu removal</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-stone-900">{deleteConfirmDish.name}</strong> from the online ordering and restaurant menu?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmDish(null)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white rounded-sm transition-colors cursor-pointer"
              >
                Delete Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900">Reset Menu to Default</h4>
                <p className="text-xs text-stone-500">Restore culinary master catalog</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              This will restore all default dishes and prices, discarding custom added dishes. Proceed?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-black text-white rounded-sm transition-colors cursor-pointer"
              >
                Reset Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
