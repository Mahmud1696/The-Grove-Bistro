export type OrderType = 'delivery' | 'pickup' | 'dine-in';

export type PaymentMethod = 'cash_on_delivery' | 'pay_on_pickup' | 'online_payment';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for delivery' | 'Completed' | 'Cancelled';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  featured: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  popular?: boolean;
  prepTimeMinutes?: number;
  calories?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  addToHome?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  pickupTime?: string;
  tableReference?: string;
  specialInstructions?: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address?: string;
  area?: string;
  pickupTime?: string;
  tableReference?: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'completed';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedTimeMinutes: number;
}

export interface Reservation {
  id: string;
  referenceNumber: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  specialRequest?: string;
  tableNumber?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export type PortalTab = 
  | 'overview' 
  | 'orders' 
  | 'kitchen' 
  | 'dishes' 
  | 'categories'
  | 'bookings' 
  | 'customers' 
  | 'analytics' 
  | 'reports' 
  | 'settings';

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: string[];
  totalOrders: number;
  lifetimeSpend: number;
  averageOrderValue: number;
  lastOrderDate: string;
  preferredChannel: OrderType;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'order' | 'menu' | 'booking' | 'system' | 'security';
  user: string;
  details: string;
}

export interface RestaurantSettings {
  profile: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    operatingHours: string;
    kitchenCloses: string;
    currencySymbol: string;
  };
  fulfillment: {
    isOnlineOrderingActive: boolean;
    announcementBanner: string;
    baseDeliveryFee: number;
    freeDeliveryThreshold: number;
    defaultPrepTimeMinutes: number;
    deliveryPrepTimeMinutes: number;
    deliveryAreas: string[];
  };
  payments: {
    enableCashOnDelivery: boolean;
    enablePayOnPickup: boolean;
    enableOnlinePayment: boolean;
    taxPercentage: number;
    serviceChargePercentage: number;
  };
  notifications: {
    soundAlertsEnabled: boolean;
    kitchenAutoPrint: boolean;
    lowStockWarnings: boolean;
  };
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  date: string;
  visitType?: string;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ALL' | 'FOOD' | 'INTERIOR' | 'AMBIENCE' | 'PEOPLE';
  imageUrl: string;
  caption?: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  subheading: string;
  address: {
    line1: string;
    line2: string;
    area: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  hours: {
    regular: string;
    brunch: string;
    dinner: string;
    kitchenCloses: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
  social: {
    facebook: string;
    instagram: string;
    tiktok?: string;
  };
}
