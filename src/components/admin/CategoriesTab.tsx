import React, { useState, useMemo } from 'react';
import { 
  Tags, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  Home, 
  Sparkles, 
  Search, 
  Layers, 
  ChefHat, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { MenuCategory, MenuItem } from '../../types';

interface CategoriesTabProps {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  onAddCategory: (data: { name: string; description?: string; slug?: string; addToHome?: boolean }) => void;
  onUpdateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  onDeleteCategory: (id: string) => void;
  onToggleAddToHome: (id: string) => void;
  onResetDefaultCategories: () => void;
  onNotification: (msg: string) => void;
}

export function CategoriesTab({
  categories,
  menuItems,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onToggleAddToHome,
  onResetDefaultCategories,
  onNotification
}: CategoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHome, setFilterHome] = useState<'all' | 'home' | 'not_home'>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<MenuCategory | null>(null);
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form state for adding category
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatAddToHome, setNewCatAddToHome] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state for editing category
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAddToHome, setEditAddToHome] = useState(false);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        cat.name.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
      );

      let matchesFilter = true;
      if (filterHome === 'home') matchesFilter = Boolean(cat.addToHome);
      if (filterHome === 'not_home') matchesFilter = !cat.addToHome;

      return matchesSearch && matchesFilter;
    });
  }, [categories, searchQuery, filterHome]);

  const homeCategoriesCount = useMemo(() => {
    return categories.filter(c => c.addToHome).length;
  }, [categories]);

  // Open Edit Modal
  const handleOpenEdit = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
    setEditAddToHome(Boolean(cat.addToHome));
  };

  // Submit Add Category
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setFormError('Please enter a category name.');
      return;
    }

    onAddCategory({
      name: newCatName.trim(),
      description: newCatDescription.trim(),
      addToHome: newCatAddToHome
    });

    onNotification(`Category "${newCatName.trim()}" added to the website.`);
    setNewCatName('');
    setNewCatDescription('');
    setNewCatAddToHome(false);
    setFormError(null);
    setIsAddModalOpen(false);
  };

  // Submit Edit Category
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editName.trim()) {
      return;
    }

    onUpdateCategory(editingCategory.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      addToHome: editAddToHome
    });

    onNotification(`Category "${editName.trim()}" updated successfully.`);
    setEditingCategory(null);
  };

  // Toggle Add to Home handler with live toast
  const handleToggleHome = (cat: MenuCategory) => {
    onToggleAddToHome(cat.id);
    const willBeOnHome = !cat.addToHome;
    if (willBeOnHome) {
      onNotification(`"${cat.name}" will now display all its dishes on the home page.`);
    } else {
      onNotification(`"${cat.name}" was removed from the home page.`);
    }
  };

  // Delete Category handler
  const handleConfirmDelete = () => {
    if (!deleteConfirmCat) return;
    const catName = deleteConfirmCat.name;
    onDeleteCategory(deleteConfirmCat.id);
    onNotification(`Category "${catName}" has been removed from the website.`);
    setDeleteConfirmCat(null);
  };

  // Count dishes in a category
  const getDishesForCategory = (catId: string) => {
    return menuItems.filter(item => item.category === catId);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Metrics Card */}
      <div className="bg-white border border-stone-200 rounded-md p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-md bg-[#1B3B2B]/10 text-[#1B3B2B]">
                <Tags className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-stone-900 leading-tight">
                  Menu Categories Management
                </h2>
                <p className="text-xs text-stone-500">
                  Organize culinary repertoire, add new sections, and control which categories appear on the public homepage.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
              title="Reset categories to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 pt-4 border-t border-stone-100">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
              Total Categories
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-serif-display text-stone-900">
                {categories.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                Active in menu
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
              <Home className="w-3 h-3 text-emerald-700" />
              Showcase on Homepage
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-serif-display text-emerald-900">
                {homeCategoriesCount}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-xs">
                Live on Home
              </span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
              Total Menu Dishes
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold font-serif-display text-stone-900">
                {menuItems.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                Distributed across sections
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white border border-stone-200 rounded-md p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search category name or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-stone-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-stone-500 font-medium mr-1 shrink-0">Filter:</span>
          <button
            type="button"
            onClick={() => setFilterHome('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer shrink-0 ${
              filterHome === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            All ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterHome('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
              filterHome === 'home'
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>On Homepage ({homeCategoriesCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterHome('not_home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer shrink-0 ${
              filterHome === 'not_home'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Menu Page Only ({categories.length - homeCategoriesCount})
          </button>
        </div>
      </div>

      {/* 3. Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-md p-12 text-center shadow-2xs">
          <Layers className="w-10 h-10 text-stone-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-serif-display text-base font-bold text-stone-900 mb-1">
            No categories match your filter
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or clear the filter to view all menu categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterHome('all');
            }}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-sm cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map(cat => {
            const dishes = getDishesForCategory(cat.id);
            const isExpanded = expandedCatId === cat.id;

            return (
              <div
                key={cat.id}
                className={`bg-white border rounded-md shadow-2xs flex flex-col justify-between transition-all overflow-hidden ${
                  cat.addToHome 
                    ? 'border-emerald-300 ring-1 ring-emerald-500/20' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Card Top */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-stone-100 text-stone-600 font-mono">
                          ID: {cat.id}
                        </span>
                        {cat.addToHome && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>On Home</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif-display text-base font-bold text-stone-900 leading-snug">
                        {cat.name}
                      </h3>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
                        title="Edit category details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmCat(cat)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed min-h-[34px]">
                    {cat.description || <span className="text-stone-400 italic">No description provided.</span>}
                  </p>

                  {/* Dish count pill & Dish preview toggler */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <ChefHat className="w-3.5 h-3.5 text-stone-500" />
                      <span className="font-semibold text-stone-900">{dishes.length}</span>
                      <span>{dishes.length === 1 ? 'dish' : 'dishes'}</span>
                    </div>

                    {dishes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                        className="text-[11px] text-[#1B3B2B] hover:text-black font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Dishes' : 'View Dishes'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* Expanded Dish List */}
                  {isExpanded && dishes.length > 0 && (
                    <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xs space-y-2 mt-2 max-h-48 overflow-y-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        Dishes in this category ({dishes.length}):
                      </span>
                      {dishes.map(d => (
                        <div key={d.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-200/60 last:border-0">
                          <div className="flex items-center gap-2 truncate">
                            <img src={d.image} alt={d.name} className="w-6 h-6 rounded-xs object-cover shrink-0" />
                            <span className="truncate text-stone-800 font-medium">{d.name}</span>
                          </div>
                          <span className="font-bold text-stone-900 text-xs shrink-0 ml-2">
                            ৳ {d.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Bottom: The "Add to Home" Checkbox Control */}
                <div className={`p-3.5 border-t transition-colors ${
                  cat.addToHome 
                    ? 'bg-emerald-50/70 border-emerald-200' 
                    : 'bg-stone-50 border-stone-100'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(cat.addToHome)}
                      onChange={() => handleToggleHome(cat)}
                      className="accent-[#1B3B2B] w-4 h-4 mt-0.5 cursor-pointer rounded-xs"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${cat.addToHome ? 'text-emerald-950' : 'text-stone-800'}`}>
                          Add to Home
                        </span>
                        {cat.addToHome && (
                          <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active on Home
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-0.5 leading-tight ${cat.addToHome ? 'text-emerald-800' : 'text-stone-500'}`}>
                        {cat.addToHome 
                          ? `All ${dishes.length} dishes in this category are displayed on the public home page.`
                          : 'Check this box to showcase all dishes of this category on the home page.'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Add New Category */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md shadow-2xl max-w-md w-full p-6 text-stone-900 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1B3B2B] text-white flex items-center justify-center">
                  <Tags className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display text-base font-bold text-stone-900">
                    Add New Category
                  </h3>
                  <p className="text-xs text-stone-500">
                    Create a new culinary menu section for the website
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormError(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Handcrafted Pasta, Wood-Fired Pizza, Chef's Tasting"
                  value={newCatName}
                  onChange={e => {
                    setNewCatName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe what makes this category special to diners..."
                  value={newCatDescription}
                  onChange={e => setNewCatDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 resize-none"
                />
              </div>

              {/* Add to Home Checkbox */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCatAddToHome}
                    onChange={e => setNewCatAddToHome(e.target.checked)}
                    className="accent-[#1B3B2B] w-4 h-4 mt-0.5 cursor-pointer rounded-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Add to Home (Showcase on Homepage)
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      When checked, all dishes added to this category will automatically be featured on the website's homepage.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Category */}
      {editingCategory && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md shadow-2xl max-w-md w-full p-6 text-stone-900 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif-display text-base font-bold text-stone-900">
                  Edit Category: {editingCategory.name}
                </h3>
                <p className="text-xs text-stone-500">
                  Update title, description, and home page showcase status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900 resize-none"
                />
              </div>

              {/* Add to Home Checkbox */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editAddToHome}
                    onChange={e => setEditAddToHome(e.target.checked)}
                    className="accent-[#1B3B2B] w-4 h-4 mt-0.5 cursor-pointer rounded-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Add to Home (Showcase on Homepage)
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Show all dishes belonging to this category in a dedicated showcase on the home page.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Category Confirmation */}
      {deleteConfirmCat && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md shadow-2xl max-w-sm w-full p-5 text-stone-900 space-y-4 my-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Delete Category?
                </h3>
                <p className="text-xs text-stone-500">
                  "{deleteConfirmCat.name}" will be removed.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xs border border-stone-200">
              Dishes in this category will remain safe in your catalog and can be reassigned to any other category at any time.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmCat(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Keep Category
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer shadow-xs"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Reset Default Categories Confirmation */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-md shadow-2xl max-w-sm w-full p-5 text-stone-900 space-y-4 my-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Reset Default Categories?
                </h3>
                <p className="text-xs text-stone-500">
                  Restore standard culinary sections
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xs border border-stone-200">
              This will restore all default categories: Starters & Shareables, Signature Mains, Handcraft Pasta, Soups & Salads, Prime Grills, Artisan Desserts, Beverage & Coffee.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetDefaultCategories();
                  setShowResetConfirm(false);
                  onNotification('Categories reset to culinary defaults.');
                }}
                className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
