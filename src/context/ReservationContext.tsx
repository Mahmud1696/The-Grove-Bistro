import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Reservation } from '../types';

interface ReservationContextType {
  reservations: Reservation[];
  activeReservation: Reservation | null;
  makeReservation: (data: Omit<Reservation, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => Reservation;
  setActiveReservation: (res: Reservation | null) => void;
  cancelReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

const RESERVATION_STORAGE_KEY = 'grove_bistro_reservations_v1';

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(RESERVATION_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'res-1',
        referenceNumber: 'RSV-7712',
        name: 'Zubair Hossain',
        phone: '+880 1819-876543',
        email: 'zubair.h@outlook.com',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '7:30 PM',
        guests: 4,
        occasion: 'Birthday',
        specialRequest: 'Window table facing Gulshan 2 roundabout if possible.',
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      }
    ];
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

  const cancelReservation = (id: string) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Cancelled' } : r))
    );
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        activeReservation,
        makeReservation,
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
