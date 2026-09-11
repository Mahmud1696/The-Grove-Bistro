import { useState, type FormEvent } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Truck,
  Store,
  UtensilsCrossed,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Banknote,
  Search
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import {
  INITIAL_MENU_ITEMS,
  MENU_CATEGORIES,
  DHAKA_DELIVERY_AREAS
} from '../data/restaurantData';
import { MenuItem, OrderType, PaymentMethod, Order } from '../types';

interface OrderViewProps {
  onNavigate: (view: string) => void;
  onOpenOrderTracker: (orderId: string) => void;
}

export function OrderView({ onNavigate, onOpenOrderTracker }: OrderViewProps) {
  const { cart, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const { createOrder } = useOrder();

  // Mode: 'browse' or 'checkout' or 'confirmation'
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Filter state in browse section
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Checkout Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Delivery details
  const [selectedArea, setSelectedArea] = useState(DHAKA_DELIVERY_AREAS[0].name);
  const [address, setAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Pickup details
  const [pickupTime, setPickupTime] = useState('As soon as ready (25-35 mins)');

  // Dine-in details
  const [tableReference, setTableReference] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate delivery fee
  const deliveryAreaObj = DHAKA_DELIVERY_AREAS.find(a => a.name === selectedArea);
  const deliveryFee = orderType === 'delivery' ? (deliveryAreaObj ? deliveryAreaObj.fee : 100) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item, 1);
  };

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError('Please provide a valid phone number so our team can coordinate delivery/pickup.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setFormError('Please provide your complete delivery street address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          area: selectedArea,
          pickupTime,
          tableReference,
          specialInstructions
        },
        orderType,
        items: [...cart],
        subtotal,
        deliveryFee,
        total: grandTotal,
        paymentMethod
      });

      clearCart();
      setIsSubmitting(false);
      setConfirmedOrder(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // 1. Order Confirmed Screen
  if (confirmedOrder) {
    return (
      <div id="order-confirmed-view" className="pt-28 pb-24 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E3DDD4] rounded-sm p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#2D4532]" />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#2D4532] block mb-2">
              Order Confirmed
            </span>

            <h1 className="font-serif-display text-3xl sm:text-4xl text-[#1A1E1B] mb-2">
              Thank you for ordering from The Grove Bistro.
            </h1>

            <p className="text-sm text-[#666F67] max-w-md mx-auto mb-6 font-light">
              Your order has been received by our Level 12 kitchen at Hamid Tower and is being prepared with care.
            </p>

            <div className="inline-block bg-[#F5F1EB] border border-[#E8E1D7] px-6 py-3 rounded-xs mb-8">
              <div className="text-xs text-[#7F8881] uppercase tracking-wider">Order Reference</div>
              <div className="font-serif-display text-2xl font-bold text-[#1A1E1B]">
                {confirmedOrder.orderId}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF8F5] rounded-xs border border-[#EBE4DC] text-left text-xs mb-8">
              <div>
                <span className="text-[#8A928B] block">Estimated Time</span>
                <span className="font-bold text-sm text-[#1A1E1B]">
                  {confirmedOrder.estimatedTimeMinutes}–{confirmedOrder.estimatedTimeMinutes + 15} mins
                </span>
              </div>
              <div>
                <span className="text-[#8A928B] block">Order Type</span>
                <span className="font-bold text-sm text-[#1A1E1B] uppercase">
                  {confirmedOrder.orderType}
                </span>
              </div>
              <div>
                <span className="text-[#8A928B] block">Total Amount</span>
                <span className="font-bold text-sm text-[#2D4532]">
                  ৳ {confirmedOrder.total.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#8A928B] block">Payment</span>
                <span className="font-bold text-sm text-[#1A1E1B] capitalize">
                  {confirmedOrder.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="text-left border-t border-[#EAE4DC] pt-6 mb-8">
              <h3 className="font-serif-display text-base font-semibold text-[#1A1E1B] mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 divide-y divide-[#F0EBE3] text-xs">
                {confirmedOrder.items.map(ci => (
                  <div key={ci.item.id} className="pt-2 flex justify-between">
                    <div>
                      <span className="font-medium text-[#1A1E1B]">
                        {ci.quantity}x {ci.item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-[#1A1E1B]">
                      ৳ {(ci.item.price * ci.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div className="pt-3 flex justify-between text-[#7F8881]">
                  <span>Subtotal</span>
                  <span>৳ {confirmedOrder.subtotal.toLocaleString()}</span>
                </div>
                {confirmedOrder.deliveryFee > 0 && (
                  <div className="pt-1 flex justify-between text-[#7F8881]">
                    <span>Delivery ({confirmedOrder.area})</span>
                    <span>৳ {confirmedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 flex justify-between font-bold text-sm text-[#1A1E1B]">
                  <span>Total</span>
                  <span>৳ {confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="track-order-btn"
                onClick={() => onOpenOrderTracker(confirmedOrder.orderId)}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#2D4532] hover:bg-[#233727] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Track Order Live</span>
              </button>

              <button
                id="back-home-btn"
                onClick={() => onNavigate('home')}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[#DDD5CA] hover:bg-[#F3EFE9] text-[#1A1E1B] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="order-page-view" className="pt-24 pb-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="pt-6 pb-8 border-b border-[#E6E0D6] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2D4532] block mb-2">
              Dhaka Delivery & Takeaway
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
              Order from The Grove
            </h1>
          </div>

          {/* Cart Status Banner */}
          <div className="flex items-center gap-3 bg-white border border-[#DDD5CA] p-3 rounded-xs shadow-2xs">
            <ShoppingBag className="w-5 h-5 text-[#2D4532]" />
            <div className="text-xs">
              <span className="font-semibold text-[#1A1E1B]">{itemCount} items in cart</span>
              <span className="text-[#7F8881]"> • ৳ {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Menu Selector on Left & Checkout / Cart on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-8 items-start">
          {/* Left Column: Menu Items Selection (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category tabs & search */}
            <div className="bg-white border border-[#E3DDD4] p-4 rounded-sm shadow-2xs space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#7F8881]" />
                <input
                  type="text"
                  placeholder="Quick search dishes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD6CB] rounded-xs focus:outline-none focus:border-[#2D4532]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {MENU_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-xs whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-[#2D4532] text-white'
                        : 'bg-[#FAF8F5] text-[#555E57] hover:bg-[#EFEAE2]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items List */}
            <div className="space-y-4">
              {INITIAL_MENU_ITEMS.filter(item => {
                const matchCat =
                  selectedCategory === 'all' || item.category === selectedCategory;
                const matchSearch =
                  !searchQuery ||
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase());
                return matchCat && matchSearch;
              }).map(dish => (
                <div
                  key={dish.id}
                  className="bg-white border border-[#E6E0D6] rounded-sm p-4 sm:p-5 flex gap-4 items-center justify-between hover:shadow-xs transition-shadow"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xs object-cover bg-[#EAE4DB] shrink-0 border border-[#E0D9CE]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B]">
                        {dish.name}
                      </h4>
                      {dish.vegetarian && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-xs font-semibold">
                          Veg
                        </span>
                      )}
                    </div>
                    <p className="font-sans-ui text-xs text-[#6F7770] line-clamp-2 mt-1 font-light">
                      {dish.description}
                    </p>
                    <div className="mt-2 font-bold text-sm text-[#2D4532]">
                      ৳ {dish.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(dish)}
                    className="shrink-0 p-2 sm:px-4 sm:py-2.5 bg-[#FAF8F5] hover:bg-[#2D4532] border border-[#DDD5CA] hover:border-[#2D4532] text-[#1A1E1B] hover:text-white rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Cart & Checkout Form (col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#E3DDD4] rounded-sm p-6 shadow-xs sticky top-24">
            <h3 className="font-serif-display text-xl font-semibold text-[#1A1E1B] pb-4 border-b border-[#EAE4DC] flex items-center justify-between">
              <span>Checkout</span>
              <span className="text-xs font-sans text-[#7F8881]">Step {checkoutStep} of 2</span>
            </h3>

            {/* If Cart is empty */}
            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="w-10 h-10 text-[#C8BFB4] mx-auto mb-3" />
                <p className="font-serif-display text-lg text-[#1A1E1B] mb-1">Your cart is empty</p>
                <p className="text-xs text-[#7F8881] max-w-xs mx-auto">
                  Click 'Add' on any dish to begin your order.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="pt-4 space-y-6">
                {/* Step 1: Order Type & Customer Details */}
                {checkoutStep === 1 && (
                  <div className="space-y-5">
                    {/* Order Type Selector */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-2">
                        1. Select Order Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`p-3 rounded-xs border text-center transition-all cursor-pointer ${
                            orderType === 'delivery'
                              ? 'bg-[#2D4532] text-white border-[#2D4532]'
                              : 'bg-[#FAF8F5] text-[#1E221E] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                          }`}
                        >
                          <Truck className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs font-semibold block">Delivery</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderType('pickup')}
                          className={`p-3 rounded-xs border text-center transition-all cursor-pointer ${
                            orderType === 'pickup'
                              ? 'bg-[#2D4532] text-white border-[#2D4532]'
                              : 'bg-[#FAF8F5] text-[#1E221E] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                          }`}
                        >
                          <Store className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs font-semibold block">Pickup</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderType('dine-in')}
                          className={`p-3 rounded-xs border text-center transition-all cursor-pointer ${
                            orderType === 'dine-in'
                              ? 'bg-[#2D4532] text-white border-[#2D4532]'
                              : 'bg-[#FAF8F5] text-[#1E221E] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                          }`}
                        >
                          <UtensilsCrossed className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs font-semibold block">Dine-in</span>
                        </button>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B]">
                        2. Contact Information
                      </label>
                      <div>
                        <input
                          id="customer-name-input"
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                        />
                      </div>
                      <div>
                        <input
                          id="customer-phone-input"
                          type="tel"
                          required
                          placeholder="Phone Number (e.g. +880 1711...) *"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                        />
                      </div>
                      <div>
                        <input
                          id="customer-email-input"
                          type="email"
                          placeholder="Email Address (for receipt)"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                        />
                      </div>
                    </div>

                    {/* Conditional Delivery / Pickup / Dine-in inputs */}
                    {orderType === 'delivery' && (
                      <div className="space-y-3 pt-2">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B]">
                          3. Delivery Zone & Address
                        </label>
                        <div>
                          <select
                            value={selectedArea}
                            onChange={e => setSelectedArea(e.target.value)}
                            className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532] cursor-pointer"
                          >
                            {DHAKA_DELIVERY_AREAS.map(area => (
                              <option key={area.name} value={area.name}>
                                {area.name} — ৳{area.fee} ({area.estMin})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <textarea
                            id="customer-address-input"
                            rows={2}
                            required
                            placeholder="Full Address (House, Road, Apartment, Landmarks) *"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                          />
                        </div>
                      </div>
                    )}

                    {orderType === 'pickup' && (
                      <div className="space-y-2 pt-2">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B]">
                          Pickup Timing
                        </label>
                        <select
                          value={pickupTime}
                          onChange={e => setPickupTime(e.target.value)}
                          className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532] cursor-pointer"
                        >
                          <option value="As soon as ready (25-35 mins)">
                            As soon as ready (25-35 mins)
                          </option>
                          <option value="In 45 minutes">In 45 minutes</option>
                          <option value="In 1 hour">In 1 hour</option>
                          <option value="This evening at 7:30 PM">This evening at 7:30 PM</option>
                          <option value="This evening at 8:30 PM">This evening at 8:30 PM</option>
                        </select>
                        <p className="text-[11px] text-[#7F8881]">
                          Collect at Level 12, Hamid Tower, Gulshan Circle 2.
                        </p>
                      </div>
                    )}

                    {orderType === 'dine-in' && (
                      <div className="space-y-2 pt-2">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B]">
                          Table / Reservation Reference
                        </label>
                        <input
                          type="text"
                          placeholder="Table number or reservation code (if already seated)"
                          value={tableReference}
                          onChange={e => setTableReference(e.target.value)}
                          className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (!name.trim()) {
                          setFormError('Please enter your name.');
                          return;
                        }
                        if (!phone.trim()) {
                          setFormError('Please enter your phone number.');
                          return;
                        }
                        if (orderType === 'delivery' && !address.trim()) {
                          setFormError('Please enter your delivery address.');
                          return;
                        }
                        setFormError(null);
                        setCheckoutStep(2);
                      }}
                      className="w-full py-3.5 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Step 2: Payment & Final Review */}
                {checkoutStep === 2 && (
                  <div className="space-y-5">
                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-2">
                        Select Payment Method
                      </label>
                      <div className="space-y-2">
                        <label
                          className={`flex items-center gap-3 p-3 rounded-xs border cursor-pointer transition-colors ${
                            paymentMethod === 'cash_on_delivery'
                              ? 'border-[#2D4532] bg-[#FAF8F5]'
                              : 'border-[#DDD5CA] bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'cash_on_delivery'}
                            onChange={() => setPaymentMethod('cash_on_delivery')}
                            className="text-[#2D4532] focus:ring-0"
                          />
                          <Banknote className="w-4 h-4 text-[#2D4532]" />
                          <div className="text-xs">
                            <span className="font-semibold text-[#1A1E1B] block">
                              Cash on Delivery / Pickup
                            </span>
                            <span className="text-[#7F8881]">
                              Pay in cash or bKash / POS upon arrival
                            </span>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-3 p-3 rounded-xs border cursor-pointer transition-colors ${
                            paymentMethod === 'online_payment'
                              ? 'border-[#2D4532] bg-[#FAF8F5]'
                              : 'border-[#DDD5CA] bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'online_payment'}
                            onChange={() => setPaymentMethod('online_payment')}
                            className="text-[#2D4532] focus:ring-0"
                          />
                          <CreditCard className="w-4 h-4 text-[#2D4532]" />
                          <div className="text-xs">
                            <span className="font-semibold text-[#1A1E1B] block">
                              Online Payment Gateway (Simulated / Ready)
                            </span>
                            <span className="text-[#7F8881]">
                              Debit/Credit Card, bKash, Nagad
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Special Chef Instructions */}
                    <div>
                      <label className="block text-xs text-[#555E57] mb-1">
                        Kitchen / Preparation Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Less spicy, dressing on the side..."
                        value={specialInstructions}
                        onChange={e => setSpecialInstructions(e.target.value)}
                        className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                      />
                    </div>

                    {/* Cart Items List in summary */}
                    <div className="space-y-2 border-t border-[#EAE4DC] pt-4">
                      <div className="flex justify-between items-center text-xs text-[#7F8881] mb-2">
                        <span>Items ({itemCount})</span>
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(1)}
                          className="text-[#2D4532] hover:underline"
                        >
                          Edit Details
                        </button>
                      </div>

                      <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                        {cart.map(ci => (
                          <div key={ci.item.id} className="flex justify-between text-xs">
                            <span className="text-[#1A1E1B] truncate max-w-[200px]">
                              {ci.quantity}x {ci.item.name}
                            </span>
                            <span className="font-semibold text-[#1A1E1B]">
                              ৳ {(ci.item.price * ci.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-1.5 text-xs text-[#5F6660] border-t border-[#EAE4DC] pt-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>৳ {subtotal.toLocaleString()}</span>
                      </div>
                      {orderType === 'delivery' && (
                        <div className="flex justify-between">
                          <span>Delivery Fee ({selectedArea})</span>
                          <span>৳ {deliveryFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold text-[#1A1E1B] pt-2 border-t border-[#EAE4DC]">
                        <span>Total Due</span>
                        <span className="text-[#2D4532]">৳ {grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="p-3 border border-[#DDD5CA] text-xs font-semibold rounded-xs hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <button
                        id="submit-order-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <span>Dispatching Order...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Confirm & Place Order</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Error Notice */}
                {formError && (
                  <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xs border border-red-200">
                    {formError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
