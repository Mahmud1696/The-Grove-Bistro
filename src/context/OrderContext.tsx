import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderStatus, CartItem, OrderType, PaymentMethod, OrderCustomerInfo } from '../types';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  createOrder: (params: {
    customer: OrderCustomerInfo;
    orderType: OrderType;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: PaymentMethod;
  }) => Order;
  setActiveOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'grove_bistro_orders_v1';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial demonstration order for history
    return [
      {
        orderId: 'GV-8419',
        customerName: 'Samira Rahman',
        phone: '+880 1711-234567',
        email: 'samira.r@gmail.com',
        orderType: 'delivery',
        items: [
          {
            item: {
              id: 'dish-1',
              name: 'Slow Cooked Beef Short Ribs',
              category: 'mains',
              description: 'Tender prime beef short ribs slow-braised for 8 hours in rich jus.',
              price: 1850,
              image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: true
            },
            quantity: 1
          },
          {
            item: {
              id: 'dish-5',
              name: 'Truffle Mushroom Tagliatelle',
              category: 'pasta',
              description: 'Handmade fresh pasta ribbons with white truffle cream.',
              price: 1250,
              image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: true
            },
            quantity: 1
          }
        ],
        subtotal: 3100,
        deliveryFee: 100,
        total: 3200,
        address: 'House 42, Road 11, Block D',
        area: 'Gulshan 1 & 2',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        orderStatus: 'Preparing',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        estimatedTimeMinutes: 35
      }
    ];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const createOrder = ({
    customer,
    orderType,
    items,
    subtotal,
    deliveryFee,
    total,
    paymentMethod
  }: {
    customer: OrderCustomerInfo;
    orderType: OrderType;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: PaymentMethod;
  }): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GV-${randomNum}`;

    const newOrder: Order = {
      orderId,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email,
      orderType,
      items,
      subtotal,
      deliveryFee,
      total,
      address: customer.address,
      area: customer.area,
      pickupTime: customer.pickupTime,
      tableReference: customer.tableReference,
      specialInstructions: customer.specialInstructions,
      paymentMethod,
      paymentStatus: paymentMethod === 'online_payment' ? 'completed' : 'pending',
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: orderType === 'delivery' ? 40 : 25
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.orderId === orderId ? { ...o, orderStatus: status } : o))
    );
    if (activeOrder && activeOrder.orderId === orderId) {
      setActiveOrder(prev => (prev ? { ...prev, orderStatus: status } : null));
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.orderId === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        createOrder,
        setActiveOrder,
        updateOrderStatus,
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
