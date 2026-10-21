import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  ChefHat, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles,
  Flame,
  Leaf,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../data/restaurantData';
import { processDishImageFile, SAMPLE_DISH_PHOTOS, ProcessedImageResult } from '../../utils/imageUtils';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDish: (dishData: Omit<MenuItem, 'id'>) => void;
}

export function AddDishModal({ isOpen, onClose, onAddDish }: AddDishModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('mains');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>(25);
  const [calories, setCalories] = useState('');
  const [vegetarian, setVegetarian] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [popular, setPopular] = useState(false);
  const [featured, setFeatured] = useState(false);

  // Uploaded image state from device
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageMeta, setImageMeta] = useState<{ fileName: string; fileSizeFormatted: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSampleSelector, setShowSampleSelector] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setCategory('mains');
      setPrice('');
      setDescription('');
      setPrepTimeMinutes(25);
      setCalories('');
      setVegetarian(false);
      setSpicy(false);
      setPopular(false);
      setFeatured(false);
      setUploadedImage('');
      setImageMeta(null);
      setErrorMsg(null);
      setShowSampleSelector(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPEG, PNG, WebP).');
      return;
    }
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const result: ProcessedImageResult = await processDishImageFile(file);
      setUploadedImage(result.dataUrl);
      setImageMeta({
        fileName: result.fileName,
        fileSizeFormatted: result.fileSizeFormatted
      });
      setShowSampleSelector(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process image file.';
      setErrorMsg(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage('');
    setImageMeta(null);
  };

  const handleSelectSample = (sample: typeof SAMPLE_DISH_PHOTOS[0]) => {
    setUploadedImage(sample.url);
    setImageMeta({
      fileName: `${sample.name}.jpg`,
      fileSizeFormatted: 'Culinary Preset'
    });
    setErrorMsg(null);
    setShowSampleSelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a dish name.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price in BDT (৳).');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a culinary description.');
      return;
    }
    if (!uploadedImage) {
      setErrorMsg('Please upload a dish image from your device.');
      return;
    }

    onAddDish({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      image: uploadedImage,
      available: true,
      featured,
      vegetarian,
      spicy,
      popular,
      prepTimeMinutes: prepTimeMinutes ? Number(prepTimeMinutes) : 20,
      calories: calories.trim() || undefined
    });

    onClose();
  };

  const selectableCategories = MENU_CATEGORIES.filter(c => c.id !== 'all');
  const currentCategoryObj = selectableCategories.find(c => c.id === category);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-dish-dialog-title"
    >
      <div className="bg-white text-gray-900 w-full max-w-3xl rounded-sm border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1B3B2B] flex items-center justify-center text-white shadow-xs">
              <ChefHat className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 id="add-dish-dialog-title" className="font-serif-display text-lg font-bold text-gray-900 leading-tight">
                Add New Dish to Website
              </h3>
              <p className="text-xs text-gray-500">
                Published immediately to the live public menu & online ordering
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-xs text-red-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
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
                onChange={e => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
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
                  onChange={e => {
                    setPrice(e.target.value ? Number(e.target.value) : '');
                    if (errorMsg) setErrorMsg(null);
                  }}
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
                max="120"
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
                placeholder="e.g. 540 kcal"
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
              onChange={e => {
                setDescription(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Describe the flavor profile, artisanal preparation, herbs, cuts, and cooking technique..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 resize-none"
            />
          </div>

          {/* SECTION: Upload Dish Image (replacing Photo Image URL) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Upload Dish Image *
              </label>
              <span className="text-[11px] text-gray-500">
                Upload photo from your device (JPG, PNG, WebP)
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />

            {!uploadedImage ? (
              /* Drag and Drop / Device Browse Area */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xs p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragOver
                    ? 'border-[#1B3B2B] bg-[#1B3B2B]/5 scale-[0.99]'
                    : 'border-gray-300 hover:border-gray-700 bg-gray-50/70 hover:bg-gray-100/60'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-2xs group-hover:scale-105 transition-transform">
                  {isProcessing ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-[#1B3B2B]" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-700" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {isProcessing ? 'Processing image...' : 'Click to upload photo from your device'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    or drag and drop photo file here (JPG, PNG, WebP up to 10MB)
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs">
                    <Check className="w-3 h-3 text-emerald-600" /> Auto-optimized for website
                  </span>
                </div>
              </div>
            ) : (
              /* Uploaded Image Active Display */
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-16 h-16 rounded-xs overflow-hidden border border-gray-300 bg-white shrink-0 shadow-2xs">
                    <img
                      src={uploadedImage}
                      alt="Uploaded dish"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {imageMeta?.fileName || 'Uploaded dish photo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                      <span>{imageMeta?.fileSizeFormatted || 'Ready'}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">Ready for live menu</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-xs text-xs font-semibold text-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xs text-xs font-semibold text-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Sample Photos Helper */}
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowSampleSelector(!showSampleSelector)}
                  className="text-[11px] text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{showSampleSelector ? 'Hide sample culinary photos' : 'Need a photo? Select from sample chef photos'}</span>
                </button>
              </div>

              {showSampleSelector && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xs animate-in fade-in duration-200">
                  <p className="text-[11px] text-gray-600 mb-2 font-medium">
                    Select a high-resolution culinary photo if you do not have a photo on this device:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SAMPLE_DISH_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSample(sample)}
                        className={`p-1.5 rounded-xs border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                          uploadedImage === sample.url
                            ? 'border-[#1B3B2B] bg-[#1B3B2B]/10 font-bold text-gray-900'
                            : 'border-gray-200 bg-white hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-8 h-8 rounded-xs object-cover shrink-0"
                        />
                        <span className="text-[11px] leading-tight truncate">
                          {sample.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dietary & Badges */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Dietary & Highlighting Badges
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={vegetarian}
                  onChange={e => setVegetarian(e.target.checked)}
                  className="accent-[#1B3B2B] w-4 h-4 cursor-pointer"
                />
                <span>Vegetarian</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={spicy}
                  onChange={e => setSpicy(e.target.checked)}
                  className="accent-[#1B3B2B] w-4 h-4 cursor-pointer"
                />
                <span>Spicy Dish</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={e => setPopular(e.target.checked)}
                  className="accent-[#1B3B2B] w-4 h-4 cursor-pointer"
                />
                <span>Chef's Popular Pick</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xs cursor-pointer hover:border-gray-300 text-xs font-medium text-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="accent-[#1B3B2B] w-4 h-4 cursor-pointer"
                />
                <span>Feature on Home</span>
              </label>
            </div>
          </div>

          {/* LIVE MENU PREVIEW: 100% Faithful Live Preview */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-widest text-stone-600 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1B3B2B]" />
                Live Menu Preview
              </span>
              <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Accurate Customer Website View
              </span>
            </div>

            {/* Customer Website Menu Card Representation */}
            <div className="bg-white border border-[#E6E0D6] rounded-xs overflow-hidden shadow-xs flex flex-col sm:flex-row">
              {/* Preview Image Container */}
              <div className="relative sm:w-44 h-36 sm:h-auto bg-[#EAE4DB] shrink-0 overflow-hidden flex items-center justify-center">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt={name || 'Dish preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-4 text-center flex flex-col items-center justify-center text-stone-400">
                    <ImageIcon className="w-7 h-7 mb-1 text-stone-400 stroke-[1.5]" />
                    <span className="text-xs font-semibold text-stone-500">No Photo Uploaded</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">Upload photo above to preview</span>
                  </div>
                )}

                {/* Category tag on image corner */}
                <div className="absolute top-2 left-2 bg-[#1A1E1B]/80 backdrop-blur-xs text-[#FAF8F5] text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-xs">
                  {currentCategoryObj?.name || category}
                </div>

                {popular && (
                  <div className="absolute top-2 right-2 bg-amber-700/90 text-white text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-xs flex items-center gap-0.5 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Popular</span>
                  </div>
                )}
              </div>

              {/* Preview Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B] leading-snug">
                      {name.trim() ? (
                        name.trim()
                      ) : (
                        <span className="text-stone-400 italic font-normal">Dish Title (e.g. Pan-Seared Salmon)</span>
                      )}
                    </h4>
                    <span className="font-sans-ui text-base font-bold text-[#2D4532] shrink-0">
                      {price !== '' ? (
                        `৳ ${Number(price).toLocaleString()}`
                      ) : (
                        <span className="text-stone-400 italic font-normal text-xs">৳ —</span>
                      )}
                    </span>
                  </div>

                  <p className="font-sans-ui text-xs text-[#666F67] leading-relaxed line-clamp-2 font-light">
                    {description.trim() ? (
                      description.trim()
                    ) : (
                      <span className="text-stone-400 italic">
                        Culinary flavor profile, cuts, and cooking technique description will appear here...
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 mt-2">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#7F8881]">
                    {prepTimeMinutes ? (
                      <span>⏱ ~{prepTimeMinutes} mins prep</span>
                    ) : null}
                    {calories ? (
                      <span>• {calories}</span>
                    ) : null}
                    {vegetarian && (
                      <span className="text-emerald-700 font-semibold">• 🌱 Vegetarian</span>
                    )}
                    {spicy && (
                      <span className="text-red-700 font-semibold">• 🌶️ Spicy</span>
                    )}
                    {featured && (
                      <span className="text-purple-700 font-semibold">• ✨ Featured on Home</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-800 font-medium">
                      Status: In Stock • Available to Order
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs bg-[#2D4532] text-white">
                      Customer "Add to Order" Enabled
                    </span>
                  </div>
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
              className="px-6 py-2.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
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
