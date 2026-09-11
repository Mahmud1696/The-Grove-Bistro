import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMenu: () => void;
}

export function CartDrawer({ onProceedToCheckout, onExploreMenu }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    itemCount,
    subtotal
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] text-[#1E221E] shadow-2xl flex flex-col border-l border-[#E6E0D6]">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE4DC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#2D4532]" />
              <h2 className="font-serif-display text-xl font-semibold text-[#1A1E1B]">
                Your Order
              </h2>
              <span className="text-xs bg-[#EFEAE2] text-[#2D4532] px-2 py-0.5 rounded-full font-bold">
                {itemCount}
              </span>
            </div>
            <button
              id="close-cart-btn"
              onClick={closeCart}
              aria-label="Close cart drawer"
              className="p-1.5 rounded-full text-[#6F7770] hover:text-[#1A1E1B] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div id="cart-empty-state" className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#2D4532] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif-display text-xl font-medium text-[#1A1E1B] mb-1">
                  Your table is waiting.
                </h3>
                <p className="text-sm text-[#6F7770] mb-6 max-w-xs font-light">
                  Your cart is currently empty. Explore our chef-prepared dishes to get started.
                </p>
                <button
                  id="cart-explore-menu-btn"
                  onClick={() => {
                    closeCart();
                    onExploreMenu();
                  }}
                  className="px-6 py-3 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-[#EAE4DC]">
                {cart.map(ci => (
                  <div key={ci.item.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-18 h-18 rounded-sm object-cover bg-[#E8E2D8] shrink-0 border border-[#DDD6CB]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif-display text-sm font-semibold text-[#1A1E1B] truncate">
                          {ci.item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(ci.item.id)}
                          aria-label={`Remove ${ci.item.name}`}
                          className="text-[#98A199] hover:text-red-700 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-[#2D4532] font-semibold mt-0.5">
                        ৳ {ci.item.price.toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-[#DDD5CA] rounded-sm bg-[#FAF8F5]">
                          <button
                            onClick={() => updateQuantity(ci.item.id, -1)}
                            aria-label="Decrease quantity"
                            className="p-1 px-2 text-[#4C534D] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-[#1A1E1B]">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(ci.item.id, 1)}
                            aria-label="Increase quantity"
                            className="p-1 px-2 text-[#4C534D] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#1A1E1B]">
                          ৳ {(ci.item.price * ci.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F5F1EB] border-t border-[#E6E0D6] space-y-4">
              <div className="space-y-2 text-xs text-[#5F6660]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1E1B]">৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery / Packaging</span>
                  <span className="font-medium text-[#2D4532]">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1A1E1B] pt-2 border-t border-[#E2DBD1]">
                  <span>Total</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                id="proceed-checkout-btn"
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
