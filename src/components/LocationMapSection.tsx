import { MapPin, Clock, Phone, Mail, Compass, ExternalLink } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export function LocationMapSection() {
  return (
    <section id="location-section" className="py-20 sm:py-28 bg-[#F5F1EB] border-t border-[#E8E1D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#2D4532] block mb-2">
            Visit The Grove
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1E1B]">
            Find us.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-stretch">
          {/* Contact & Hours Info Column */}
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E3DDD4] p-8 sm:p-10 rounded-sm flex flex-col justify-between">
            <div className="space-y-8">
              {/* Location */}
              <div>
                <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">Location</span>
                </div>
                <p className="font-serif-display text-lg text-[#1A1E1B] font-medium">
                  {RESTAURANT_INFO.address.line1}
                </p>
                <p className="text-sm text-[#5F6660]">
                  {RESTAURANT_INFO.address.line2}, {RESTAURANT_INFO.address.city} {RESTAURANT_INFO.address.postalCode}
                </p>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">Opening Hours</span>
                </div>
                <div className="text-sm text-[#5F6660] space-y-1 font-light">
                  <p className="font-medium text-[#1A1E1B]">
                    {RESTAURANT_INFO.hours.regular}
                  </p>
                  <p>Weekend Brunch: {RESTAURANT_INFO.hours.brunch}</p>
                  <p className="text-xs text-[#8A928B] pt-1">
                    {RESTAURANT_INFO.hours.kitchenCloses}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">Contact</span>
                </div>
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="font-sans-ui text-base font-medium text-[#1A1E1B] hover:text-[#2D4532] transition-colors block"
                >
                  {RESTAURANT_INFO.phone}
                </a>
                <p className="text-xs text-[#7B837C] mt-0.5">Reservations & banquet inquiries</p>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">Email</span>
                </div>
                <a
                  href={`mailto:${RESTAURANT_INFO.email}`}
                  className="font-sans-ui text-sm text-[#5F6660] hover:text-[#1A1E1B] transition-colors"
                >
                  {RESTAURANT_INFO.email}
                </a>
              </div>
            </div>

            {/* Directions Action */}
            <div className="pt-8 border-t border-[#EAE4DC] mt-8">
              <a
                id="get-directions-btn"
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-colors shadow-xs"
              >
                <Compass className="w-4 h-4" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            </div>
          </div>

          {/* Interactive Map Frame */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#E3DDD4] rounded-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E8E2D9] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-[#5F6660]">
                <MapPin className="w-3.5 h-3.5 text-[#2D4532]" />
                <span>The Grove Bistro on Google Maps • Gulshan 2</span>
              </div>
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#2D4532] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embed Google Map iframe */}
            <div className="relative w-full h-[360px] sm:h-[440px] bg-[#EBE5DF]">
              <iframe
                title="The Grove Bistro Dhaka Google Map Location"
                src="https://maps.google.com/maps?q=The+Grove+Bistro,+Hamid+Tower,+Gulshan+Circle+2,+Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full grayscale-[25%] contrast-[105%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
