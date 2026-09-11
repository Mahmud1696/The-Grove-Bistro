import React, { useState } from 'react';
import { X, Plus, Sparkles, Image as ImageIcon, ChefHat } from 'lucide-react';
import { MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../data/restaurantData';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDish: (dishData: Omit<MenuItem, 'id'>) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Wagyu Ribeye',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    category: 'steaks'
  },
  {
    name: 'Truffle Pasta',
    url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    category: 'pasta'
  },
  {
    name: 'Artisan Seafood',
    url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
    category: 'mains'
  },
  {
    name: 'Burrata Salad',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a5c?auto=format&fit=crop&w=800&q=80',
    category: 'starters'
  },
  {
    name: 'Chocolate Fondant',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    category: 'desserts'
  },
  {
    name: 'Craft Mocktail',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    category: 'beverages'
  }
];

export function AddDishModal({ isOpen, onClose, onAddDish }: AddDishModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('mains');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>(25);
  const [calories, setCalories] = useState('540 kcal');
  const [vegetarian, setVegetarian] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [popular, setPopular] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a dish name');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price in BDT');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a dish description');
      return;
    }
    if (!image.trim()) {
      setErrorMsg('Please provide an image URL');
      return;
    }

    onAddDish({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      image: image.trim(),
      available: true,
      featured,
      vegetarian,
      spicy,
      popular,
      prepTimeMinutes: prepTimeMinutes ? Number(prepTimeMinutes) : 20,
      calories: calories.trim() || undefined
    });

    // Reset & close
    setName('');
    setDescription('');
    setPrice('');
    setVegetarian(false);
    setSpicy(false);
    setPopular(false);
    setFeatured(false);
    setErrorMsg(null);
    onClose();
  };

  const selectableCategories = MENU_CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-gray-900 w-full max-w-3xl rounded-sm border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-gray-900">
                Add New Dish to Website
              </h3>
              <p className="text-xs text-gray-500">
                Published immediately to the live public menu & homepage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-xs text-red-800 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Charred Mediterranean Octopus"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm text-gray-900 focus:outline-none focus:border-gray-900 cursor-pointer"
              >
                {selectableCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price & Prep Time & Calories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Price in BDT (৳) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-gray-500 font-medium">৳</span>
                <input
                  type="number"
                  required
                  min="50"
                  step="10"
                  value={price}
                  onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="1450"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xs text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Prep Time (mins)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={prepTimeMinutes}
                onChange={e => setPrepTimeMinutes(e.target.value ? Number(e.target.value) : '')}
                placeholder="25"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Calories
              </label>
              <input
                type="text"
                value={calories}
                onChange={e => setCalories(e.target.value)}
                placeholder="e.g. 520 kcal"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Culinary Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the flavor profile, artisanal preparation, herbs, cuts, and cooking technique..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 resize-none"
            />
          </div>

          {/* Row 4: Image URL & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Photo Image URL *
              </label>
              <span className="text-[11px] text-gray-500">Select a preset or paste link</span>
            </div>
            <input
              type="url"
              required
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 mb-2"
            />

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-xs border transition-colors cursor-pointer flex items-center gap-1.5 font-medium ${
                    image === preset.url
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:text-black'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary & Badges */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Dietary & Highlighting Badges
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={vegetarian}
                  onChange={e => setVegetarian(e.target.checked)}
                  className="accent-gray-900"
                />
                <span>Vegetarian</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={spicy}
                  onChange={e => setSpicy(e.target.checked)}
                  className="accent-gray-900"
                />
                <span>Spicy Dish</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={e => setPopular(e.target.checked)}
                  className="accent-gray-900"
                />
                <span>Chef's Popular Pick</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="accent-gray-900"
                />
                <span>Feature on Home</span>
              </label>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xs">
            <div className="text-[11px] uppercase tracking-widest text-gray-500 mb-2 font-bold">
              Live Menu Preview
            </div>
            <div className="flex gap-4 items-center">
              <img
                src={image || PRESET_IMAGES[0].url}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-xs border border-gray-200 shrink-0 bg-white"
                onError={e => {
                  (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-serif-display font-bold text-sm text-gray-900 truncate">
                    {name || 'New Culinary Dish'}
                  </h4>
                  <span className="font-serif-display font-bold text-sm text-gray-900 shrink-0">
                    ৳ {price ? Number(price).toLocaleString() : '1,450'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                  {description || 'Artisanal preparation with select ingredients.'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-gray-200 text-gray-800 font-semibold">
                    {category}
                  </span>
                  {vegetarian && (
                    <span className="text-[10px] text-emerald-700 font-medium">🌱 Veg</span>
                  )}
                  {popular && (
                    <span className="text-[10px] text-amber-800 font-medium">★ Popular</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Dish to Website</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
