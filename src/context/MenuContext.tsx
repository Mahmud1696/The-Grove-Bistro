import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, MenuCategory } from '../types';
import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '../data/restaurantData';

interface MenuContextType {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  addMenuItem: (dish: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleDishAvailability: (id: string) => void;
  toggleDishFeatured: (id: string) => void;
  duplicateMenuItem: (id: string) => MenuItem | undefined;
  resetMenuToDefault: () => void;
  // Category management
  addCategory: (categoryData: { name: string; description?: string; slug?: string; addToHome?: boolean }) => MenuCategory;
  updateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryAddToHome: (id: string) => void;
  resetCategoriesToDefault: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_STORAGE_KEY = 'grove_bistro_menu_v1';
const CATEGORIES_STORAGE_KEY = 'grove_bistro_categories_v2';

const DEFAULT_CATEGORIES: MenuCategory[] = MENU_CATEGORIES.filter(c => c.id !== 'all');

export function MenuProvider({ children }: { children: ReactNode }) {
  // Dishes state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse menu items from storage:', e);
    }
    return INITIAL_MENU_ITEMS;
  });

  // Categories state
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse categories from storage:', e);
    }
    return DEFAULT_CATEGORIES;
  });

  // Save dishes to storage
  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {
      console.error('Failed to save menu items to storage:', e);
    }
  }, [menuItems]);

  // Save categories to storage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to storage:', e);
    }
  }, [categories]);

  // Dish Operations
  const addMenuItem = (dish: Omit<MenuItem, 'id'>): MenuItem => {
    const newId = `dish-${Date.now()}`;
    const newDish: MenuItem = {
      ...dish,
      id: newId,
    };
    setMenuItems(prev => [newDish, ...prev]);
    return newDish;
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleDishAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const toggleDishFeatured = (id: string) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  const duplicateMenuItem = (id: string): MenuItem | undefined => {
    const existing = menuItems.find(item => item.id === id);
    if (!existing) return undefined;
    const duplicated: MenuItem = {
      ...existing,
      id: `dish-${Date.now()}`,
      name: `${existing.name} (Copy)`
    };
    setMenuItems(prev => [duplicated, ...prev]);
    return duplicated;
  };

  const resetMenuToDefault = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
  };

  // Category Operations
  const addCategory = (data: { name: string; description?: string; slug?: string; addToHome?: boolean }): MenuCategory => {
    const slugBase = (data.slug || data.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `category-${Date.now()}`;
    
    // Ensure unique id
    let id = slugBase;
    let counter = 1;
    while (categories.some(c => c.id === id)) {
      id = `${slugBase}-${counter++}`;
    }

    const newCategory: MenuCategory = {
      id,
      name: data.name.trim(),
      slug: id,
      description: data.description?.trim() || '',
      addToHome: Boolean(data.addToHome)
    };

    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<MenuCategory>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const toggleCategoryAddToHome = (id: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, addToHome: !cat.addToHome } : cat
      )
    );
  };

  const resetCategoriesToDefault = () => {
    setCategories(DEFAULT_CATEGORIES);
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleDishAvailability,
        toggleDishFeatured,
        duplicateMenuItem,
        resetMenuToDefault,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryAddToHome,
        resetCategoriesToDefault
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
