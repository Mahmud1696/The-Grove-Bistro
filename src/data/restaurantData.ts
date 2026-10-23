import { MenuItem, MenuCategory, RestaurantInfo, Review, GalleryItem } from '../types';

export const RESTAURANT_INFO: RestaurantInfo = {
  name: "The Grove Bistro",
  tagline: "A refined dining experience in Dhaka.",
  subheading: "Thoughtfully prepared food, inviting surroundings, and memorable moments — all in one place.",
  address: {
    line1: "Level 12, Hamid Tower",
    line2: "22 DIT II Circle, Gulshan Circle 2",
    area: "Gulshan-2",
    city: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh"
  },
  phone: "+880 1315-063084",
  email: "reservations@thegrovebistro.com",
  hours: {
    regular: "Monday – Sunday: 12:00 PM – 10:30 PM",
    brunch: "Friday – Saturday: 11:00 AM – 1:00 PM",
    dinner: "Daily: 6:00 PM – 10:30 PM",
    kitchenCloses: "Last order at 10:00 PM"
  },
  coordinates: {
    lat: 23.7951945,
    lng: 90.4148383
  },
  googleMapsUrl: "https://www.google.com/maps/place/The+Grove+Bistro/@23.7951945,90.4122634,17z/data=!4m8!3m7!1s0x3755c7e8631ff7ab:0x20a244f263d33abe!8m2!3d23.7951945!4d90.4148383!9m1!1b1!16s%2Fg%2F11hdphyhhj?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D",
  social: {
    facebook: "https://facebook.com/thegrovebistro",
    instagram: "https://www.instagram.com/grovebistro/",
    tiktok: "https://tiktok.com/@thegrovebistro"
  }
};

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'All Dishes', slug: 'all' },
  { id: 'starters', name: 'Starters & Shareables', slug: 'starters', description: 'Light bites and shared plates crafted to awaken the palate.', addToHome: true },
  { id: 'mains', name: 'Signature Mains', slug: 'mains', description: 'Chef-crafted meat, poultry and seafood centerpieces.', addToHome: true },
  { id: 'pasta', name: 'Handcraft Pasta', slug: 'pasta', description: 'Freshly prepared pasta tossed with slow-simmered sauces.', addToHome: false },
  { id: 'soups-salads', name: 'Soups & Salads', slug: 'soups-salads', description: 'Vibrant local and imported produce with house-made dressings.', addToHome: false },
  { id: 'steaks', name: 'Prime Grills', slug: 'steaks', description: 'Carefully trimmed cuts seared over open flames.', addToHome: false },
  { id: 'desserts', name: 'Artisan Desserts', slug: 'desserts', description: 'Decadent sweet creations crafted daily by our pastry team.', addToHome: false },
  { id: 'beverages', name: 'Beverage & Coffee', slug: 'beverages', description: 'Handcrafted mocktails, specialty roasts and refreshing coolers.', addToHome: false },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Signature Mains
  {
    id: 'dish-1',
    name: 'Slow Cooked Beef Short Ribs',
    category: 'mains',
    description: 'Tender prime beef short ribs slow-braised for 8 hours in rich jus, served over buttery potato mousseline and glazed root vegetables.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prepTimeMinutes: 25,
    calories: '680 kcal'
  },
  {
    id: 'dish-2',
    name: 'Chicken Cordon Bleu',
    category: 'mains',
    description: 'Crispy golden chicken breast stuffed with smoked turkey ham and melting Gruyère, paired with grain mustard cream sauce and fresh greens.',
    price: 1150,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prepTimeMinutes: 20,
    calories: '590 kcal'
  },
  {
    id: 'dish-3',
    name: 'Pan Seared Sea Bass',
    category: 'mains',
    description: 'Crispy-skinned fresh sea bass fillet over saffron-infused risotto, finished with caper herb butter and blistered cherry tomatoes.',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: false,
    prepTimeMinutes: 22,
    calories: '520 kcal'
  },
  {
    id: 'dish-4',
    name: 'Seafood Paella Valenciana',
    category: 'mains',
    description: 'Spanish bomba rice infused with saffron, calamari rings, tiger prawns, and ocean mussels finished with fresh lemon and parsley.',
    price: 1680,
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prepTimeMinutes: 30,
    calories: '610 kcal'
  },

  // Handcrafted Pasta
  {
    id: 'dish-5',
    name: 'Truffle Mushroom Tagliatelle',
    category: 'pasta',
    description: 'Handmade fresh pasta ribbons tossed with wild forest mushrooms, white truffle cream, fresh thyme, and 24-month aged Parmigiano-Reggiano.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    vegetarian: true,
    popular: true,
    prepTimeMinutes: 18,
    calories: '540 kcal'
  },
  {
    id: 'dish-6',
    name: 'Blue Crab Linguine',
    category: 'pasta',
    description: 'Sweet hand-picked blue crab meat, garlic confit, bird’s eye chili, sweet cherry tomatoes, and extra virgin olive oil deglazed with white grape reduction.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    spicy: true,
    popular: true,
    prepTimeMinutes: 20,
    calories: '490 kcal'
  },
  {
    id: 'dish-7',
    name: 'Seafood Marinara Spaghetti',
    category: 'pasta',
    description: 'Spaghetti al dente with tiger prawns, tender calamari, and shellfish simmered in our signature San Marzano tomato basil sauce.',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prepTimeMinutes: 20,
    calories: '530 kcal'
  },
  {
    id: 'dish-8',
    name: 'Beef Carbonara Rustica',
    category: 'pasta',
    description: 'Traditional Roman-style spaghetti enriched with cured beef bacon lardons, fresh egg yolks, cracked black pepper, and sharp Pecorino.',
    price: 1190,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prepTimeMinutes: 18,
    calories: '620 kcal'
  },

  // Starters & Shareables
  {
    id: 'dish-9',
    name: 'Crispy Calamari with Garlic Aioli',
    category: 'starters',
    description: 'Tender squid rings lightly tossed in seasoned semolina, fried crisp and served with charred lemon and smoked garlic aioli.',
    price: 720,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prepTimeMinutes: 15,
    calories: '380 kcal'
  },
  {
    id: 'dish-10',
    name: 'Sautéed Garlic Butter Mushrooms',
    category: 'starters',
    description: 'Button and cremini mushrooms sautéed in clarified herb butter, roasted garlic cloves, cracked sea salt, and crusty sourdough toast.',
    price: 580,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    vegetarian: true,
    popular: false,
    prepTimeMinutes: 12,
    calories: '310 kcal'
  },
  {
    id: 'dish-11',
    name: 'Artisan Bruschetta Trio',
    category: 'starters',
    description: 'Toasted baguette slices topped with marinated heirloom tomatoes, whipped goat cheese with honey, and wild mushroom pâté.',
    price: 640,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    vegetarian: true,
    popular: false,
    prepTimeMinutes: 12,
    calories: '320 kcal'
  },
  {
    id: 'dish-12',
    name: 'Classic Fish & Chips',
    category: 'starters',
    description: 'Battered red snapper fillet served with triple-cooked hand-cut fries, house tartar sauce, and crushed mint peas.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prepTimeMinutes: 18,
    calories: '610 kcal'
  },

  // Soups & Salads
  {
    id: 'dish-13',
    name: 'Avocado & Grilled Tiger Shrimp Salad',
    category: 'soups-salads',
    description: 'Hass avocado chunks, chargrilled Bengal tiger shrimp, organic mixed greens, cherry tomatoes, and citrus shallot dressing.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: true,
    popular: true,
    prepTimeMinutes: 14,
    calories: '390 kcal'
  },
  {
    id: 'dish-14',
    name: 'Grove Caesar with Charred Chicken',
    category: 'soups-salads',
    description: 'Crisp Romaine hearts tossed in house anchovy dressing, topped with sliced grilled chicken breast, herb croutons, and shaved Parmesan.',
    price: 780,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prepTimeMinutes: 12,
    calories: '420 kcal'
  },
  {
    id: 'dish-15',
    name: 'Rich Seafood Chowder',
    category: 'soups-salads',
    description: 'Velvety New England style chowder brimming with snapper chunks, prawns, squid, sweet corn, and leeks in a sourdough bowl.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: false,
    prepTimeMinutes: 15,
    calories: '360 kcal'
  },

  // Prime Grills
  {
    id: 'dish-16',
    name: 'Charcoal Grilled Sirloin Steak',
    category: 'steaks',
    description: '280g prime tender cut grilled over charcoal embers, served with creamy potato mousseline, blistered garden vegetables, and herb peppercorn jus.',
    price: 2450,
    image: '/assets/aistudio/714930613_1045228344508298_5916473412862540533_n_2dddfe3d.jpg',
    available: true,
    featured: true,
    popular: true,
    prepTimeMinutes: 25,
    calories: '720 kcal'
  },
  {
    id: 'dish-17',
    name: 'Pan-Seared Norwegian Salmon',
    category: 'steaks',
    description: 'Fresh Norwegian salmon fillet cooked medium rare, resting on a bed of warm quinoa, baby spinach, and lemon dill emulsion.',
    price: 1980,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    popular: true,
    prepTimeMinutes: 20,
    calories: '550 kcal'
  },

  // Desserts
  {
    id: 'dish-18',
    name: 'New York Blueberry Cheesecake',
    category: 'desserts',
    description: 'Dense and creamy baked Philadelphia cheesecake with a graham cracker base, smothered in wild blueberry compote.',
    price: 580,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    vegetarian: true,
    popular: true,
    prepTimeMinutes: 8,
    calories: '440 kcal'
  },
  {
    id: 'dish-19',
    name: 'Classic Mango Panna Cotta',
    category: 'desserts',
    description: 'Silky Madagascar vanilla bean panna cotta topped with seasonal Rajshahi sweet mango coulis and fresh mint leaves.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    vegetarian: true,
    popular: true,
    prepTimeMinutes: 5,
    calories: '310 kcal'
  },
  {
    id: 'dish-20',
    name: 'Warm Belgian Chocolate Brownie',
    category: 'desserts',
    description: 'Gooey 70% dark chocolate fudge brownie served warm with a scoop of artisan French vanilla bean gelato and salted caramel drizzle.',
    price: 520,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    vegetarian: true,
    popular: false,
    prepTimeMinutes: 10,
    calories: '480 kcal'
  },

  // Beverages & Coffee
  {
    id: 'dish-21',
    name: 'The Grove Signature Specialty Roast & Latte',
    category: 'beverages',
    description: 'Double shot of single-origin Colombian espresso poured over cold silky oat milk and infused with Madagascar vanilla bean, served in our illustrated botanical cup.',
    price: 390,
    image: '/assets/aistudio/747753191_1083828523981613_1738728827763148336_n_99727991.jpg',
    available: true,
    featured: true,
    vegetarian: true,
    popular: true,
    prepTimeMinutes: 5,
    calories: '140 kcal'
  },
  {
    id: 'dish-22',
    name: 'Sparkling Hibiscus Berry Fizz',
    category: 'beverages',
    description: 'Cold-steeped organic hibiscus blossom, crushed wild berries, fresh lime juice, and sparkling soda over botanical ice.',
    price: 360,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    available: true,
    featured: false,
    vegetarian: true,
    popular: true,
    prepTimeMinutes: 5,
    calories: '95 kcal'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-grove-steak',
    title: 'Charcoal Grilled Sirloin & Citrus Mocktail',
    category: 'FOOD',
    imageUrl: '/assets/aistudio/714930613_1045228344508298_5916473412862540533_n_2dddfe3d.jpg',
    caption: 'Prime steak seared over open fire with whipped potato mousseline, sauteed garden vegetables, and fresh orange cooler.'
  },
  {
    id: 'gal-grove-terrace',
    title: 'Sunlit Dining Hall & Greenery Vistas',
    category: 'INTERIOR',
    imageUrl: '/assets/aistudio/745019829_1083828577314941_875227384916130874_n_528e9966.jpg',
    caption: 'Grand dining tables framed by expansive floor-to-ceiling glass windows and lush garden greenery on Level 12, Hamid Tower.'
  },
  {
    id: 'gal-grove-lounge',
    title: 'Amber Nook & Bistro Seating',
    category: 'AMBIENCE',
    imageUrl: '/assets/aistudio/745546055_1083828587314940_1887363832029969781_n_6341a8e4.jpg',
    caption: 'Intimate dining corner with plush velvet armchairs, vintage floor lamp, and European bistronomy atmosphere.'
  },
  {
    id: 'gal-grove-coffee',
    title: 'The Grove Artisan Roast & Botanical Cup',
    category: 'BEVERAGE',
    imageUrl: '/assets/aistudio/747753191_1083828523981613_1738728827763148336_n_99727991.jpg',
    caption: 'Specialty hot coffee poured into custom botanical painted cups for relaxed cafe moments and work sessions.'
  },
  {
    id: 'gal-1',
    title: 'Warm Dining Atmosphere',
    category: 'INTERIOR',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Intimate evening seating on Level 12 overlooking the Gulshan skyline.'
  },
  {
    id: 'gal-2',
    title: 'Slow Braised Short Ribs',
    category: 'FOOD',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    caption: 'Our signature short ribs prepared with 8-hour braising method.'
  },
  {
    id: 'gal-3',
    title: 'Bistro Ambience & Lighting',
    category: 'AMBIENCE',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Soft ambient illumination designed for relaxed, unhurried conversations.'
  },
  {
    id: 'gal-4',
    title: 'Handcrafted Pasta Making',
    category: 'FOOD',
    imageUrl: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fresh pasta rolled and prepared daily in our open kitchen.'
  },
  {
    id: 'gal-5',
    title: 'Private Dining Alcove',
    category: 'INTERIOR',
    imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1200&q=80',
    caption: 'A quiet corner tailored for celebrations, anniversaries, and business dinners.'
  },
  {
    id: 'gal-6',
    title: 'Cocktails & Evening Hospitality',
    category: 'AMBIENCE',
    imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
    caption: 'Crafted coolers and mocktails poured fresh at the bar counter.'
  },
  {
    id: 'gal-7',
    title: 'Fresh Seafood Preparation',
    category: 'FOOD',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    caption: 'Crisp skin sea bass with herb butter and seasonal greens.'
  },
  {
    id: 'gal-8',
    title: 'Gatherings & Fellowship',
    category: 'PEOPLE',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    caption: 'Friends and families sharing memorable moments around good food.'
  }
];

export const TESTIMONIALS: Review[] = [
  {
    id: 'gmap-rev-1',
    customerName: 'Shadman Sakib',
    rating: 5,
    review: 'One of the most aesthetically pleasing bistros in Dhaka! Located on the 12th floor of Hamid Tower with beautiful indoor greenery and warm ambient lighting. Their Chicken Cordon Bleu was crispy on the outside and super juicy inside. Also loved the Seafood Chowder and warm garlic bread. Service was prompt and hospitable. Definitely a 5-star experience in Gulshan.',
    date: 'Recent Google Review',
    visitType: 'Dine in • Dinner',
    source: 'Google Maps',
    isLocalGuide: true,
    reviewCount: '42 reviews',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'gmap-rev-2',
    customerName: 'Afsana Mimi',
    rating: 5,
    review: 'Visited The Grove Bistro for a special celebration. The atmosphere feels straight out of an upscale European cafe with rustic wood and lush plants. The Slow Cooked Beef Short Ribs were melt-in-the-mouth tender, and the potato mousseline was velvety smooth. Outstanding hospitality and breathtaking evening views over Gulshan from level 12.',
    date: 'Recent Google Review',
    visitType: 'Dine in • Dinner',
    source: 'Google Maps',
    isLocalGuide: true,
    reviewCount: '18 reviews',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'gmap-rev-3',
    customerName: 'Syed Raihanul Islam',
    rating: 5,
    review: 'Cozy, high-end bistro atmosphere right at Gulshan 2 circle. Great place for both friendly hangouts and family dinners. The Truffle Mushroom Tagliatelle and Fried Calamari were spot on. Coffee and artisan desserts rounded off a wonderful meal. Highly recommend booking a window table in advance!',
    date: 'Recent Google Review',
    visitType: 'Dine in • Lunch',
    source: 'Google Maps',
    isLocalGuide: true,
    reviewCount: '65 reviews',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'gmap-rev-4',
    customerName: 'Nabila Rahman',
    rating: 5,
    review: 'The ambiance is top tier — the greenery, rustic wooden furnishings, and floor-to-ceiling glass windows overlooking Gulshan. The Grilled Chicken Mango Salad was so refreshing and their handcrafted coolers were fantastic. Polite staff and very clean presentation.',
    date: 'Recent Google Review',
    visitType: 'Dine in • Weekend Brunch',
    source: 'Google Maps',
    isLocalGuide: true,
    reviewCount: '29 reviews',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'gmap-rev-5',
    customerName: 'Mahmud Hasan',
    rating: 5,
    review: 'Great pan-European dining experience. Ordered the Pan-Seared Chilean Sea Bass and Cream of Mushroom Soup in sourdough bowl. Everything tasted fresh and well-balanced. The staff was courteous and attentive throughout our dinner.',
    date: 'Recent Google Review',
    visitType: 'Dine in • Dinner',
    source: 'Google Maps',
    isLocalGuide: true,
    reviewCount: '51 reviews',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'gmap-rev-6',
    customerName: 'Zarin Tasnim',
    rating: 5,
    review: 'Loved the vibe! Perfect lighting, peaceful background jazz, and delicious food. The molten chocolate dessert and specialty roasts were the highlights of our evening. A true culinary gem on Level 12 of Hamid Tower.',
    date: 'Recent Google Review',
    visitType: 'Dine in • Evening',
    source: 'Google Maps',
    isLocalGuide: false,
    reviewCount: '12 reviews',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  }
];

export const DHAKA_DELIVERY_AREAS = [
  { name: 'Gulshan 1 & 2', fee: 100, estMin: '30-40 mins' },
  { name: 'Banani & Banani DOHS', fee: 100, estMin: '35-45 mins' },
  { name: 'Baridhara & Baridhara DOHS', fee: 100, estMin: '30-40 mins' },
  { name: 'Bashundhara R/A', fee: 140, estMin: '45-55 mins' },
  { name: 'Niketan', fee: 120, estMin: '35-45 mins' },
  { name: 'Mohakhali & DOHS', fee: 130, estMin: '40-50 mins' },
  { name: 'Uttara (Sector 1-14)', fee: 180, estMin: '50-65 mins' },
  { name: 'Dhanmondi', fee: 160, estMin: '50-60 mins' },
];
