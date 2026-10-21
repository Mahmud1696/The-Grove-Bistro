import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Reservation } from '../types';

interface ReservationContextType {
  reservations: Reservation[];
  activeReservation: Reservation | null;
  makeReservation: (data: Omit<Reservation, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => Reservation;
  addAdminReservation: (data: Omit<Reservation, 'id' | 'referenceNumber' | 'createdAt'>) => Reservation;
  updateReservationStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  setActiveReservation: (res: Reservation | null) => void;
  cancelReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

const RESERVATION_STORAGE_KEY = 'grove_bistro_reservations_v2';

const getInitialReservations = (): Reservation[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterStr = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  return [
    {
      id: 'res-1',
      referenceNumber: 'RSV-7712',
      name: 'Zubair Hossain',
      phone: '+880 1819-876543',
      email: 'zubair.h@outlook.com',
      date: todayStr,
      time: '7:30 PM',
      guests: 4,
      occasion: 'Birthday',
      tableNumber: 'Table T4 (Terrace)',
      specialRequest: 'Window table facing Gulshan 2 roundabout if possible.',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'res-2',
      referenceNumber: 'RSV-8321',
      name: 'Dr. Nazmul Huq',
      phone: '+880 1711-998822',
      email: 'dr.nazmul@icloud.com',
      date: todayStr,
      time: '8:00 PM',
      guests: 6,
      occasion: 'Business Dinner',
      tableNumber: 'VIP-1 (Private Dining)',
      specialRequest: 'Quiet section for diplomatic guests. Sommelier service requested.',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      id: 'res-3',
      referenceNumber: 'RSV-9104',
      name: 'Tahmina Anam',
      phone: '+880 1912-345678',
      email: 'tahmina.a@yahoo.com',
      date: todayStr,
      time: '6:30 PM',
      guests: 2,
      occasion: 'Anniversary',
      tableNumber: 'Table T1 (Window Booth)',
      specialRequest: 'Corner table with candlelight arrangement.',
      status: 'Pending',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'res-4',
      referenceNumber: 'RSV-6240',
      name: 'Imtiaz Ahmed',
      phone: '+880 1722-445566',
      email: 'imtiaz.ahmed@corporate.com',
      date: tomorrowStr,
      time: '1:00 PM',
      guests: 8,
      occasion: 'Corporate Lunch',
      tableNumber: 'Table T8 (Center Hall)',
      specialRequest: 'Projector presentation setup near table if available.',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'res-5',
      referenceNumber: 'RSV-5519',
      name: 'Sabrina Mostafa',
      phone: '+880 1610-112233',
      email: 'sabrina.m@gmail.com',
      date: dayAfterStr,
      time: '8:30 PM',
      guests: 2,
      occasion: 'Casual Dining',
      tableNumber: 'Table T2 (Bistro Corner)',
      specialRequest: 'High chair needed for 1 child.',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];
};

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(RESERVATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return getInitialReservations();
  });

  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.error('Failed to save reservations to localStorage', e);
    }
  }, [reservations]);

  const makeReservation = (data: Omit<Reservation, 'id' | 'referenceNumber' | 'status' | 'createdAt'>): Reservation => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      referenceNumber: `RSV-${randomCode}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      ...data
    };

    setReservations(prev => [newRes, ...prev]);
    setActiveReservation(newRes);
    return newRes;
  };

  const addAdminReservation = (data: Omit<Reservation, 'id' | 'referenceNumber' | 'createdAt'>): Reservation => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      referenceNumber: `RSV-${randomCode}`,
      createdAt: new Date().toISOString(),
      ...data
    };

    setReservations(prev => [newRes, ...prev]);
    return newRes;
  };

  const updateReservationStatus = (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const cancelReservation = (id: string) => {
    updateReservationStatus(id, 'Cancelled');
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        activeReservation,
        makeReservation,
        addAdminReservation,
        updateReservationStatus,
        updateReservation,
        setActiveReservation,
        cancelReservation
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
}
