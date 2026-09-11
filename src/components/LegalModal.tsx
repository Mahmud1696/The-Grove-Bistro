import { X } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  return (
    <div
      id="legal-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
    >
      <div className="bg-[#FAF8F5] text-[#1E221E] w-full max-w-2xl rounded-sm shadow-xl border border-[#E3DDD4] overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-[#EAE4DC] flex items-center justify-between">
          <h3 className="font-serif-display text-2xl font-semibold text-[#1A1E1B]">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFEAE2] text-[#6F7770] hover:text-[#1A1E1B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#555E57] leading-relaxed font-light">
          {type === 'privacy' ? (
            <>
              <p className="font-medium text-[#1A1E1B]">
                Effective Date: January 1, 2026 • The Grove Bistro, Dhaka
              </p>
              <p>
                At The Grove Bistro, we respect your privacy. This policy outlines our standards regarding information collected when reserving a table, ordering meals for pickup or delivery, or contacting our team.
              </p>
              <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B] pt-2">
                1. Information We Collect
              </h4>
              <p>
                We only collect contact details (name, phone number, email address, delivery location) that you voluntarily provide to confirm restaurant table reservations and fulfill food delivery orders.
              </p>
              <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B] pt-2">
                2. Use of Information
              </h4>
              <p>
                Your information is used exclusively for order preparation, delivery dispatch, reservation booking notifications, and hospitality service enhancements at our Hamid Tower, Gulshan-2 restaurant.
              </p>
              <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B] pt-2">
                3. Contact Us
              </h4>
              <p>
                For privacy requests, reach out directly to {RESTAURANT_INFO.email} or call {RESTAURANT_INFO.phone}.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-[#1A1E1B]">
                Terms & Conditions • The Grove Bistro Dhaka
              </p>
              <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B] pt-2">
                1. Reservations
              </h4>
              <p>
                Table reservations are held for up to 15 minutes past the scheduled booking time. For large parties (8+ guests), kindly confirm 2 hours in advance.
              </p>
              <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B] pt-2">
                2. Delivery & Food Preparation
              </h4>
              <p>
                All dishes are cooked fresh to order. Estimated delivery times range from 35 to 55 minutes depending on distance within Dhaka metropolitan zones and peak road conditions.
              </p>
              <h4 className="font-serif-display text-base font-semibold text-[#1A1E1B] pt-2">
                3. Allergies & Dietary Preferences
              </h4>
              <p>
                Please notify our kitchen staff of severe allergies through order notes or reservation remarks. While we maintain strict culinary hygiene, cross-contact with shellfish, dairy, or gluten is possible in an artisanal kitchen.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-[#F5F1EB] border-t border-[#E6E0D6] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2D4532] text-white text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#223626] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
