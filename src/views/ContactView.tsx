import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Clock, Mail, Send, Compass, ExternalLink, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="contact-page-view" className="pt-24 pb-28 bg-[#FAF8F5]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#2D4532] block mb-3">
          Get in Touch • Gulshan Circle 2
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1E1B] mb-4">
          Contact & Location
        </h1>
        <p className="font-sans-ui text-base sm:text-lg text-[#5D6660] max-w-xl mx-auto font-light leading-relaxed">
          Have a question about table reservations, private events, or corporate catering? We're here to assist.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info (col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-[#E3DDD4] p-8 rounded-sm shadow-2xs space-y-8">
            <div>
              <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                <MapPin className="w-5 h-5" />
                <h3 className="text-xs uppercase tracking-widest font-bold">Location</h3>
              </div>
              <p className="font-serif-display text-xl text-[#1A1E1B] font-semibold">
                The Grove Bistro
              </p>
              <p className="text-sm text-[#5F6660] mt-1">
                {RESTAURANT_INFO.address.line1}
              </p>
              <p className="text-sm text-[#5F6660]">
                {RESTAURANT_INFO.address.line2}, {RESTAURANT_INFO.address.city} {RESTAURANT_INFO.address.postalCode}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                <Clock className="w-5 h-5" />
                <h3 className="text-xs uppercase tracking-widest font-bold">Operating Hours</h3>
              </div>
              <div className="text-sm text-[#5F6660] space-y-1">
                <p className="font-medium text-[#1A1E1B]">{RESTAURANT_INFO.hours.regular}</p>
                <p>Weekend Brunch: {RESTAURANT_INFO.hours.brunch}</p>
                <p className="text-xs text-[#8A928B] pt-1">{RESTAURANT_INFO.hours.kitchenCloses}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                <Phone className="w-5 h-5" />
                <h3 className="text-xs uppercase tracking-widest font-bold">Telephone</h3>
              </div>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="font-sans-ui text-base font-semibold text-[#1A1E1B] hover:text-[#2D4532] transition-colors"
              >
                {RESTAURANT_INFO.phone}
              </a>
              <p className="text-xs text-[#8A928B] mt-0.5">Direct manager line</p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-[#2D4532] mb-2">
                <Mail className="w-5 h-5" />
                <h3 className="text-xs uppercase tracking-widest font-bold">Email</h3>
              </div>
              <a
                href={`mailto:${RESTAURANT_INFO.email}`}
                className="font-sans-ui text-sm text-[#5F6660] hover:text-[#1A1E1B] transition-colors"
              >
                {RESTAURANT_INFO.email}
              </a>
            </div>

            <div className="pt-4 border-t border-[#EAE4DC]">
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form (col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-[#E3DDD4] p-8 rounded-sm shadow-2xs">
            <h3 className="font-serif-display text-2xl font-normal text-[#1A1E1B] mb-2">
              Send a Message
            </h3>
            <p className="text-xs sm:text-sm text-[#6F7770] mb-6 font-light">
              We respond to all inquiries within 2 hours during business operations.
            </p>

            {submitted ? (
              <div className="p-8 bg-[#F5F1EB] rounded-xs text-center border border-[#E6E0D6] space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#2D4532] mx-auto" />
                <h4 className="font-serif-display text-xl font-semibold text-[#1A1E1B]">
                  Thank you, {name}!
                </h4>
                <p className="text-xs text-[#5F6660] max-w-sm mx-auto">
                  Your inquiry regarding "{subject}" has been received. Our hospitality team will be in touch shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 px-6 py-2 bg-[#2D4532] text-white text-xs uppercase tracking-widest font-semibold rounded-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full min-h-[44px] p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+880 1..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full min-h-[44px] p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full min-h-[44px] p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full min-h-[44px] p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532] cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Private Dining / Event">Private Dining / Event</option>
                      <option value="Catering">Corporate Catering</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1A1E1B] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help you..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-3 text-sm sm:text-xs bg-[#FAF8F5] border border-[#DDD5CA] rounded-xs focus:outline-none focus:border-[#2D4532]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 bg-[#2D4532] hover:bg-[#223626] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Map at bottom */}
        <div className="mt-14 bg-white border border-[#E3DDD4] rounded-sm overflow-hidden">
          <div className="p-4 bg-[#F5F1EB] border-b border-[#E6E0D6] flex items-center justify-between text-xs font-semibold text-[#1A1E1B]">
            <span>The Grove Bistro — Level 12, Hamid Tower, Gulshan Circle 2</span>
            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2D4532] hover:underline flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="relative w-full h-[380px]">
            <iframe
              title="Grove Bistro Location Map"
              src="https://maps.google.com/maps?q=The+Grove+Bistro,+Hamid+Tower,+Gulshan+Circle+2,+Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full grayscale-[20%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
