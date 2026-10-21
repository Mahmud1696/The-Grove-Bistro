import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/restaurantData';

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (dish: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleDishAvailability: (id: string) => void;
  duplicateMenuItem: (id: string) => MenuItem | undefined;
  resetMenuToDefault: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_STORAGE_KEY = 'grove_bistro_menu_v1';

export function MenuProvider({ children }: { children: ReactNode }) {
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

  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {
      console.error('Failed to save menu items to storage:', e);
    }
  }, [menuItems]);

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

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleDishAvailability,
        duplicateMenuItem,
        resetMenuToDefault,
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
