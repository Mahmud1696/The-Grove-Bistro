import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Image as ImageIcon, Upload, Trash2, AlertCircle } from 'lucide-react';
import { MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../data/restaurantData';
import { processDishImageFile, ProcessedImageResult } from '../../utils/imageUtils';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPG, PNG, WebP).');
      return;
    }
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const res: ProcessedImageResult = await processDishImageFile(file);
      setImage(res.dataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process image.';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

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
          <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Dish Title *
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

            {/* Dish Photo / Device Upload */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Dish Photo (Upload from Device)
              </label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-sm">
                <div className="w-14 h-14 rounded-xs overflow-hidden border border-stone-300 bg-white shrink-0">
                  {image ? (
                    <img src={image} alt="Dish preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-900 truncate">
                    {image.startsWith('data:') ? 'Custom Photo from Device' : (image ? 'Active Photo' : 'No photo uploaded')}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    JPG, PNG, or WebP. Automatically optimized.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs text-xs font-semibold text-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Processing...' : 'Upload Photo'}</span>
                </button>
              </div>
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
                className="w-4 h-4 text-rose-800 rounded-xs focus:ring-rose-700"
              />
              <span>Spicy</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={e => setPopular(e.target.checked)}
                className="w-4 h-4 text-amber-800 rounded-xs focus:ring-amber-700"
              />
              <span>Chef's Popular Pick</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="w-4 h-4 text-purple-800 rounded-xs focus:ring-purple-700"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
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
