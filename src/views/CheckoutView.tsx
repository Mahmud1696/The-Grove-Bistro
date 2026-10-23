import { useState, type FormEvent } from 'react';
import {
  ShieldCheck,
  Truck,
  Store,
  UtensilsCrossed,
  Clock,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  Link2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { DHAKA_DELIVERY_AREAS } from '../data/restaurantData';
import { OrderType, PaymentMethod, Order } from '../types';

interface CheckoutViewProps {
  onNavigate: (view: string) => void;
  onOpenOrderTracker: (orderId: string) => void;
}

export function CheckoutView({ onNavigate, onOpenOrderTracker }: CheckoutViewProps) {
  const { cart, clearCart, subtotal, itemCount } = useCart();
  const { createOrder } = useOrder();

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedTrackingLink, setCopiedTrackingLink] = useState(false);

  // Form fields
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

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

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError('Please provide a valid contact phone number.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setFormError('Please enter your full delivery address.');
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
      <div id="checkout-confirmed-view" className="pt-28 pb-24 bg-[#FAF8F5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E3DDD4] rounded-sm p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#2D4532]" />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#2D4532] block mb-2">
              Order Confirmed
            </span>

            <h1 className="font-serif-display text-3xl sm:text-4xl text-[#1A1E1B] mb-2">
              Thank you for your order.
            </h1>

            <p className="text-sm text-[#666F67] max-w-md mx-auto mb-6 font-light">
              Your order has been received by our kitchen at Level 12, Hamid Tower, Gulshan-2.
            </p>

            <div className="inline-block bg-[#F5F1EB] border border-[#E8E1D7] px-8 py-3.5 rounded-xs mb-8">
              <div className="text-xs text-[#7F8881] uppercase tracking-wider">Order Reference</div>
              <div className="font-serif-display text-2xl font-bold text-[#1A1E1B] tracking-wide">
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
                <span className="text-[#8A928B] block">Fulfillment</span>
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

            <div className="text-left border-t border-[#EAE4DC] pt-6 mb-8 text-xs text-[#555E57] space-y-2">
              <p>
                <span className="font-semibold text-[#1A1E1B]">Customer: </span>
                {confirmedOrder.customerName} ({confirmedOrder.phone})
              </p>
              {confirmedOrder.orderType === 'delivery' && (
                <p>
                  <span className="font-semibold text-[#1A1E1B]">Delivery Address: </span>
                  {confirmedOrder.address}, {confirmedOrder.area}
                </p>
              )}
              {confirmedOrder.orderType === 'pickup' && (
                <p>
                  <span className="font-semibold text-[#1A1E1B]">Pickup Time: </span>
                  {confirmedOrder.pickupTime || 'Within 25–35 mins'}
                </p>
              )}
              {confirmedOrder.orderType === 'dine-in' && (
                <p>
                  <span className="font-semibold text-[#1A1E1B]">Table Reference: </span>
                  {confirmedOrder.tableReference || 'Assigned by hostess'}
                </p>
              )}
            </div>

            {/* Unique Tracking Link Section */}
            {(() => {
              const trackingLink = `${window.location.origin}${window.location.pathname}#track-${confirmedOrder.orderId}`;

              const handleCopy = async () => {
                try {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(trackingLink);
                  } else {
                    throw new Error('Clipboard API unavailable');
                  }
                } catch {
                  const el = document.createElement('textarea');
                  el.value = trackingLink;
                  el.style.position = 'fixed';
                  el.style.opacity = '0';
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand('copy');
                  document.body.removeChild(el);
                }
                setCopiedTrackingLink(true);
                setTimeout(() => setCopiedTrackingLink(false), 2500);
              };

              const handleTrack = () => {
                window.location.hash = `track-${confirmedOrder.orderId}`;
                onOpenOrderTracker(confirmedOrder.orderId);
              };

              return (
                <div className="space-y-4 mb-8">
                  {/* Read-only Unique Tracking Link Display */}
                  <div className="p-3.5 bg-[#FAF8F5] border border-[#E3DDD4] rounded-xs text-left space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#2D4532] uppercase tracking-wider flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" />
                        Unique Order Tracking Link
                      </span>
                      <span className="font-mono text-[#7F8881]">
                        Order #{confirmedOrder.orderId}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={trackingLink}
                        className="flex-1 min-h-[42px] bg-white border border-[#DDD5CA] rounded-xs px-3 py-2 text-xs font-mono text-[#1A1E1B] select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        id="copy-tracking-link-btn"
                        onClick={handleCopy}
                        className="min-h-[42px] px-4 py-2.5 bg-[#1B3B2B] hover:bg-black text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                      >
                        {copiedTrackingLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy the Tracking Link</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-[#7F8881]">
                      Share or bookmark this unique link to check live dispatch status from any device at any time.
                    </p>
                  </div>

                  {/* Actions: Track your Order, Copy the Tracking Link, Back to Home */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      id="track-order-btn"
                      onClick={handleTrack}
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#2D4532] hover:bg-[#233727] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Track your Order</span>
                    </button>

                    <button
                      type="button"
                      id="copy-tracking-action-btn"
                      onClick={handleCopy}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#F3EFE9] border border-[#2D4532] text-[#2D4532] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {copiedTrackingLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy the Tracking Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      id="back-home-btn"
                      onClick={() => onNavigate('home')}
                      className="w-full sm:w-auto px-6 py-3.5 bg-transparent border border-[#DDD5CA] hover:bg-[#F3EFE9] text-[#1A1E1B] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart Guard Screen
  if (cart.length === 0) {
    return (
      <div id="checkout-empty-view" className="pt-28 pb-28 bg-[#FAF8F5]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E3DDD4] rounded-sm p-10 text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#2D4532] mx-auto mb-4">
              <ShoppingBag className="w-7 h-7 opacity-75" />
            </div>
            <h2 className="font-serif-display text-2xl font-normal text-[#1A1E1B] mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-[#666F67] max-w-sm mx-auto mb-6 font-light">
              Please select your favorite dishes from our menu before proceeding to checkout.
            </p>
            <button
              onClick={() => onNavigate('menu')}
              className="px-8 py-3.5 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Explore Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Dedicated Checkout Page (Only Checkout Information, NO Food Items or Dishes)
  return (
    <div id="checkout-page-view" className="pt-24 pb-28 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pt-8 pb-10 border-b border-[#E6E0D6] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#2D4532] mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
              Complete Your Order
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-xs text-[#555E57] hover:text-[#1A1E1B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Menu</span>
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="pt-8 space-y-8">
          {/* Step 1: Order Type Selection */}
          <div className="bg-white border border-[#E3DDD4] p-6 sm:p-8 rounded-sm shadow-2xs">
            <h2 className="font-serif-display text-xl font-semibold text-[#1A1E1B] mb-4">
              1. Fulfillment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                id="checkout-type-delivery"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  orderType === 'delivery'
                    ? 'bg-[#2D4532] text-white border-[#2D4532] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#1E221E] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Truck className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                    Dhaka Zones
                  </span>
                </div>
                <div>
                  <span className="font-serif-display text-base font-semibold block">Delivery</span>
                  <span
                    className={`text-xs block mt-0.5 ${
                      orderType === 'delivery' ? 'text-[#C9D6CB]' : 'text-[#6F7770]'
                    }`}
                  >
                    Direct to your doorstep
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="checkout-type-pickup"
                onClick={() => setOrderType('pickup')}
                className={`p-4 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  orderType === 'pickup'
                    ? 'bg-[#2D4532] text-white border-[#2D4532] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#1E221E] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Store className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                    Hamid Tower
                  </span>
                </div>
                <div>
                  <span className="font-serif-display text-base font-semibold block">Pickup</span>
                  <span
                    className={`text-xs block mt-0.5 ${
                      orderType === 'pickup' ? 'text-[#C9D6CB]' : 'text-[#6F7770]'
                    }`}
                  >
                    Collect at Level 12
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="checkout-type-dine-in"
                onClick={() => setOrderType('dine-in')}
                className={`p-4 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  orderType === 'dine-in'
                    ? 'bg-[#2D4532] text-white border-[#2D4532] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#1E221E] border-[#DDD5CA] hover:bg-[#EFEAE2]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                    In Restaurant
                  </span>
                </div>
                <div>
                  <span className="font-serif-display text-base font-semibold block">Dine-in</span>
                  <span
                    className={`text-xs block mt-0.5 ${
                      orderType === 'dine-in' ? 'text-[#C9D6CB]' : 'text-[#6F7770]'
                    }`}
                  >
                    Served at your table
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Customer Contact Information */}
          <div className="bg-white border border-[#E3DDD4] p-6 sm:p-8 rounded-sm shadow-2xs space-y-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#1A1E1B]">
              2. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                  Full Name *
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  placeholder="e.g. Abrar Chowdhury"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  placeholder="e.g. +880 1711..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                  Email Address
                </label>
                <input
                  id="checkout-email-input"
                  type="email"
                  placeholder="For receipt & status updates"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Fulfillment Destination Details */}
          <div className="bg-white border border-[#E3DDD4] p-6 sm:p-8 rounded-sm shadow-2xs space-y-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#1A1E1B]">
              3. {orderType === 'delivery' ? 'Delivery Address' : orderType === 'pickup' ? 'Pickup Details' : 'Table Details'}
            </h2>

            {orderType === 'delivery' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                    Select Delivery Zone
                  </label>
                  <select
                    id="checkout-zone-select"
                    value={selectedArea}
                    onChange={e => setSelectedArea(e.target.value)}
                    className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532] cursor-pointer"
                  >
                    {DHAKA_DELIVERY_AREAS.map(area => (
                      <option key={area.name} value={area.name}>
                        {area.name} — Delivery Fee ৳{area.fee} (Estimated {area.estMin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                    Street Address & Landmarks *
                  </label>
                  <textarea
                    id="checkout-address-input"
                    rows={3}
                    required
                    placeholder="House / Apartment number, Road name, Block / Sector, Landmark..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                  />
                </div>
              </div>
            )}

            {orderType === 'pickup' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                    Preferred Collection Time
                  </label>
                  <select
                    id="checkout-pickup-time"
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532] cursor-pointer"
                  >
                    <option value="As soon as ready (25-35 mins)">As soon as ready (25-35 mins)</option>
                    <option value="In 45 minutes">In 45 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                    <option value="This evening at 7:30 PM">This evening at 7:30 PM</option>
                    <option value="This evening at 8:30 PM">This evening at 8:30 PM</option>
                  </select>
                </div>

                <div className="p-4 bg-[#FAF8F5] rounded-xs border border-[#E3DDD4] flex items-start gap-3 text-xs text-[#555E57]">
                  <MapPin className="w-4 h-4 text-[#2D4532] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1A1E1B] block">Collection Point:</span>
                    <span>The Grove Bistro, Level 12, Hamid Tower, Gulshan Circle 2, Dhaka 1212</span>
                  </div>
                </div>
              </div>
            )}

            {orderType === 'dine-in' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                    Table Number or Booking Code
                  </label>
                  <input
                    id="checkout-table-ref"
                    type="text"
                    placeholder="e.g. Table 14 or #RSV-XXXX"
                    value={tableReference}
                    onChange={e => setTableReference(e.target.value)}
                    className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                  />
                  <p className="text-[11px] text-[#7F8881] mt-1">
                    If not yet seated, leave empty and our hostess will assist you upon arrival.
                  </p>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="pt-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                Special Kitchen / Delivery Notes (Optional)
              </label>
              <input
                id="checkout-notes-input"
                type="text"
                placeholder="e.g. Cutlery requested, gate call instructions, allergies..."
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
              />
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="bg-white border border-[#E3DDD4] p-6 sm:p-8 rounded-sm shadow-2xs space-y-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#1A1E1B]">
              4. Payment Method
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-3.5 p-4 rounded-xs border cursor-pointer transition-colors ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#2D4532] bg-[#FAF8F5]'
                    : 'border-[#DDD5CA] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="checkout_payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="text-[#2D4532] focus:ring-0"
                />
                <Banknote className="w-5 h-5 text-[#2D4532]" />
                <div className="text-xs">
                  <span className="font-semibold text-[#1A1E1B] block">
                    {orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Restaurant'}
                  </span>
                  <span className="text-[#7F8881]">
                    Pay in cash, card, or bKash when your order arrives or at pickup
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3.5 p-4 rounded-xs border cursor-pointer transition-colors ${
                  paymentMethod === 'online_payment'
                    ? 'border-[#2D4532] bg-[#FAF8F5]'
                    : 'border-[#DDD5CA] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="checkout_payment"
                  checked={paymentMethod === 'online_payment'}
                  onChange={() => setPaymentMethod('online_payment')}
                  className="text-[#2D4532] focus:ring-0"
                />
                <CreditCard className="w-5 h-5 text-[#2D4532]" />
                <div className="text-xs">
                  <span className="font-semibold text-[#1A1E1B] block">
                    Online Payment (Cards / Mobile Banking)
                  </span>
                  <span className="text-[#7F8881]">
                    Visa, Mastercard, bKash, Nagad
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Step 5: Financial Order Total & Confirmation (No Food Items Shown) */}
          <div className="bg-[#F5F1EB] border border-[#E3DDD4] p-6 sm:p-8 rounded-sm space-y-4">
            <h2 className="font-serif-display text-xl font-semibold text-[#1A1E1B]">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs text-[#555E57] border-b border-[#E2DBD0] pb-4">
              <div className="flex justify-between">
                <span>Selected Items ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="font-medium text-[#1A1E1B]">৳ {subtotal.toLocaleString()}</span>
              </div>

              {orderType === 'delivery' ? (
                <div className="flex justify-between">
                  <span>Delivery Charge ({selectedArea})</span>
                  <span className="font-medium text-[#1A1E1B]">৳ {deliveryFee.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Service / Packaging</span>
                  <span className="font-medium text-[#2D4532]">Complimentary</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-[#1A1E1B] pt-3 border-t border-[#E2DBD0]">
                <span>Total Due</span>
                <span className="text-[#2D4532]">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xs border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Confirming Order with Kitchen...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order • ৳ {grandTotal.toLocaleString()}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#7F8881]">
              By clicking "Place Order", your details will be immediately dispatched to The Grove Bistro team for preparation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
