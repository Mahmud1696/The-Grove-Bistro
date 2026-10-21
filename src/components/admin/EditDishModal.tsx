import React, { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../data/restaurantData';

interface EditDishModalProps {
  isOpen: boolean;
  dish: MenuItem | null;
  onClose: () => void;
  onSaveDish: (id: string, updates: Partial<MenuItem>) => void;
}

export function EditDishModal({ isOpen, dish, onClose, onSaveDish }: EditDishModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('mains');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>(20);
  const [calories, setCalories] = useState('');
  const [vegetarian, setVegetarian] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [popular, setPopular] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (dish) {
      setName(dish.name || '');
      setCategory(dish.category || 'mains');
      setPrice(dish.price ?? '');
      setDescription(dish.description || '');
      setImage(dish.image || '');
      setPrepTimeMinutes(dish.prepTimeMinutes ?? 20);
      setCalories(dish.calories || '');
      setVegetarian(Boolean(dish.vegetarian));
      setSpicy(Boolean(dish.spicy));
      setPopular(Boolean(dish.popular));
      setFeatured(Boolean(dish.featured));
      setErrorMsg(null);
    }
  }, [dish]);

  if (!isOpen || !dish) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Dish title is required.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setErrorMsg('Price must be greater than ৳0.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('A brief menu description is required.');
      return;
    }

    onSaveDish(dish.id, {
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      image: image.trim() || dish.image,
      prepTimeMinutes: prepTimeMinutes === '' ? 20 : Number(prepTimeMinutes),
      calories: calories.trim() || undefined,
      vegetarian,
      spicy,
      popular,
      featured
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-stone-200 rounded-md shadow-2xl max-w-lg w-full p-6 text-stone-900 space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-stone-900">
              Edit Menu Dish
            </h3>
            <p className="text-xs text-stone-500">
              Update pricing, specifications, and availability parameters
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 cursor-pointer"
              >
                {MENU_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Price (BDT ৳) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 font-mono focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Prep Time (Mins)
              </label>
              <input
                type="number"
                min={1}
                value={prepTimeMinutes}
                onChange={e => setPrepTimeMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 font-mono focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Calories / Nutritional Info
              </label>
              <input
                type="text"
                value={calories}
                placeholder="e.g. 580 kcal"
                onChange={e => setCalories(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Description & Flavor Profile *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
              />
            </div>
          </div>

          {/* Tags & Flags */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-4 text-xs font-medium text-stone-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={vegetarian}
                onChange={e => setVegetarian(e.target.checked)}
                className="w-4 h-4 text-emerald-800 rounded-xs focus:ring-emerald-700"
              />
              <span>Vegetarian</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={spicy}
                onChange={e => setSpicy(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded-xs focus:ring-orange-500"
              />
              <span>Spicy</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={e => setPopular(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-xs focus:ring-amber-500"
              />
              <span>Popular Choice</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#1B3B2B] rounded-xs focus:ring-[#1B3B2B]"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
