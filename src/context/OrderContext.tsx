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
    // Default initial demonstration orders for rich back-office analytics
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
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        estimatedTimeMinutes: 35
      },
      {
        orderId: 'GV-7320',
        customerName: 'Farhan Ahmed',
        phone: '+880 1819-334455',
        email: 'farhan.ahmed@outlook.com',
        orderType: 'dine-in',
        tableReference: 'Table 8',
        items: [
          {
            item: {
              id: 'dish-2',
              name: 'Pan-Seared Chilean Sea Bass',
              category: 'mains',
              description: 'Miso-glazed sea bass fillet over velvet cauliflower purée.',
              price: 2150,
              image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: true
            },
            quantity: 1
          },
          {
            item: {
              id: 'dish-13',
              name: 'Warm Valrhona Chocolate Fondant',
              category: 'desserts',
              description: 'Molten dark chocolate cake with Madagascar vanilla bean gelato.',
              price: 680,
              image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: true
            },
            quantity: 1
          }
        ],
        subtotal: 2830,
        deliveryFee: 0,
        total: 2830,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        orderStatus: 'Confirmed',
        createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        estimatedTimeMinutes: 25
      },
      {
        orderId: 'GV-6192',
        customerName: 'Tanzil Karim',
        phone: '+880 1912-778899',
        email: 'tanzil.k@gmail.com',
        orderType: 'pickup',
        pickupTime: 'Within 25-35 mins',
        items: [
          {
            item: {
              id: 'dish-3',
              name: 'Seafood Paella Valenciana',
              category: 'mains',
              description: 'Spanish bomba rice infused with saffron, calamari, and prawns.',
              price: 1680,
              image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: true
            },
            quantity: 1
          },
          {
            item: {
              id: 'dish-6',
              name: 'Blue Crab Linguine',
              category: 'pasta',
              description: 'Hand-picked blue crab meat, garlic confit, and bird’s eye chili.',
              price: 1450,
              image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: true
            },
            quantity: 1
          }
        ],
        subtotal: 3130,
        deliveryFee: 0,
        total: 3130,
        paymentMethod: 'online_payment',
        paymentStatus: 'paid',
        orderStatus: 'Ready',
        createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
        estimatedTimeMinutes: 30
      },
      {
        orderId: 'GV-5844',
        customerName: 'Natasha Chowdhury',
        phone: '+880 1713-990011',
        email: 'natasha.c@gmail.com',
        orderType: 'delivery',
        items: [
          {
            item: {
              id: 'dish-11',
              name: 'Wagyu Ribeye MS 6/7',
              category: 'steaks',
              description: 'Wood-fired Australian Wagyu ribeye steak with truffle butter.',
              price: 2850,
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
            quantity: 2
          },
          {
            item: {
              id: 'dish-16',
              name: 'Sparkling Hibiscus Lavender Fizz',
              category: 'beverages',
              description: 'House-brewed wild hibiscus tea, dried French lavender, and citrus.',
              price: 360,
              image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: true
            },
            quantity: 2
          }
        ],
        subtotal: 6070,
        deliveryFee: 120,
        total: 6190,
        address: 'Road 27, Block K, Apt 6B',
        area: 'Banani',
        paymentMethod: 'online_payment',
        paymentStatus: 'paid',
        orderStatus: 'Completed',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        estimatedTimeMinutes: 45
      },
      {
        orderId: 'GV-4902',
        customerName: 'Zubair Al-Hassan',
        phone: '+880 1312-882244',
        email: 'zubair.h@dhaka.net',
        orderType: 'dine-in',
        tableReference: 'Table 4',
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
              id: 'dish-14',
              name: 'Sicilian Pistachio Tart',
              category: 'desserts',
              description: 'Shortcrust shell filled with roasted Bronte pistachio frangipane.',
              price: 640,
              image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
              available: true,
              featured: false
            },
            quantity: 1
          }
        ],
        subtotal: 2490,
        deliveryFee: 0,
        total: 2490,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'paid',
        orderStatus: 'Completed',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        estimatedTimeMinutes: 25
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
    // Ensure unique orderId for every individual order
    let orderId = `GV-${Math.floor(1000 + Math.random() * 9000)}`;
    let counter = 1;
    while (orders.some(o => o.orderId.toLowerCase() === orderId.toLowerCase())) {
      orderId = `GV-${Math.floor(1000 + Math.random() * 9000)}-${counter++}`;
    }

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
      prev.map(o => (o.orderId.toLowerCase() === orderId.toLowerCase() ? { ...o, orderStatus: status } : o))
    );
    if (activeOrder && activeOrder.orderId.toLowerCase() === orderId.toLowerCase()) {
      setActiveOrder(prev => (prev ? { ...prev, orderStatus: status } : null));
    }
  };

  const getOrderById = (orderId: string) => {
    if (!orderId) return undefined;
    const clean = orderId.toLowerCase().trim();
    return orders.find(o => o.orderId.toLowerCase().trim() === clean);
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
