import { useEffect, useState, useRef } from 'react'

// ============ API CONFIGURATION ============
const API = 'http://localhost:5000/api'
const IMAGE_BASE = 'http://localhost:5000'
const FREE_DELIVERY = 8000
const DELIVERY_FEE = 200

// Default Admin Credentials
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'

const PAYMENTS = [
  { id: 'cod', label: 'Cash on delivery', labelAm: 'በማድረሻ ጊዜ ክፍያ', note: 'Pay when your order arrives' },
  { id: 'mobile', label: 'Mobile money (Telebirr)', labelAm: 'ሞባይል ገንዘብ (ቴሌብር)', note: 'We send you the payment number' },
  { id: 'pickup', label: 'Pick up in store', labelAm: 'ከመሸጫ ቦታ መውሰድ', note: 'No delivery fee.' },
]

const money = (n) => 'Br ' + Number(n || 0).toLocaleString('en-US')

// ============ TRANSLATIONS ============
const T = {
  en: {
    home: "HOME", shop: "SHOP", newArrivals: "NEW ARRIVALS", collections: "COLLECTIONS", about: "ABOUT",
    heroSmall: "NEW SEASON", heroTitle: "ሽክ", heroDesc: "Discover the new collection. Up to 30% off.",
    shopByCategory: "SHOP BY CATEGORY", findStyle: "Find Your Perfect Style",
    findStyleDesc: "Curated collections for every mood, moment and occasion.",
    women: "Women", men: "Men", accessories: "Accessories", footwear: "Footwear",
    freeShipping: "Free Shipping", freeShipDesc: "On Orders Over Br 8,000",
    securePayment: "Secure Payment", securePayDesc: "100% Safe & Guaranteed",
    trendyCollections: "Trendy Collections", trendDesc: "New Styles Every Week",
    support: "24/7 Support", supportDesc: "Friendly Customer Care",
    addToBag: "Add to Bag", yourBag: "Your Bag", emptyBag: "Your bag is empty.",
    checkout: "Checkout", total: "Total", all: "All", back: "← Back",
    details: "Your details", fullName: "Full name", phone: "Phone", city: "City", address: "Address",
    payment: "Payment", placeOrder: "Place Order", orderPlaced: "Order Placed", thankYou: "Thank you",
    continueShopping: "Continue Shopping", account: "Account", login: "Login / Register",
    storeOwner: "Store Owner", adminLogin: "Admin Login",
    adminDashboard: "Admin Dashboard", addProduct: "Add a New Product", productName: "Product Name",
    price: "Price (Br)", category: "Category", imageUrl: "Image URL",
    tag: "Tag", saveProduct: "Add Product", backToShop: "Back to Shop",
    search: "Search...", menu: "Menu",
    exclusiveOffers: "EXCLUSIVE OFFERS", exclusiveDesc: "Sign up & get 10% off your first order.",
    vipRewards: "VIP REWARDS", vipDesc: "Earn points & redeem exciting rewards.",
    secureCheckout: "100% SECURE", secureCheckoutDesc: "Your information is safe with us.",
    adminLoginTitle: "Admin Portal", username: "Username", password: "Password", loginBtn: "Login",
    overview: "Overview", inventory: "Inventory", orders: "Orders", 
    totalSales: "Total Sales", totalOrders: "Total Orders", totalProducts: "Total Products",
    productImage: "Product Image (Upload)", selectImage: "Choose an image file...",
    orderId: "Order ID", customer: "Customer", date: "Date", status: "Status", amount: "Amount",
    actions: "Actions", featuredProducts: "Featured Products", viewAll: "View All"
  },
  am: {
    home: "መነሻ", shop: "መሸጫ", newArrivals: "አዲስ የገቡ", collections: "ስብስቦች", about: "ስለ እኛ",
    heroSmall: "አዲስ ወቅት", heroTitle: "ሽክ", heroDesc: "አዲሱን ስብስብ ያግኙ። እስከ 30% ቅናሽ።",
    shopByCategory: "በምድብ ይግዙ", findStyle: "ፍጹም ዘይቤዎን ያግኙ",
    findStyleDesc: "ለእያንዳንዱ ስሜት እና አጋጣሚ የተመረጡ ስብስቦች።",
    women: "ሴቶች", men: "ወንዶች", accessories: "መለዋወጫዎች", footwear: "ጫማዎች",
    freeShipping: "ነጻ ማድረስ", freeShipDesc: "ከ 8,000 ብር በላይ ግዢ ላይ",
    securePayment: "አስተማማኝ ክፍያ", securePayDesc: "100% ደህንነቱ የተጠበቀ",
    trendyCollections: "ዘመናዊ ስብስቦች", trendDesc: "በየሳምንቱ አዲስ ስታይል",
    support: "24/7 ድጋፍ", supportDesc: "ተግባባዊ የደንበኞች አገልግሎት",
    addToBag: "ወደ ቦርሳ ጨምር", yourBag: "የእርስዎ ቦርሳ", emptyBag: "ቦርሳዎ ባዶ ነው።",
    checkout: "ክፍያ ይፈጽሙ", total: "ጠቅላላ ድምር", all: "ሁሉም", back: "← ተመለስ",
    details: "የእርስዎ ዝርዝሮች", fullName: "ሙሉ ስም", phone: "ስልክ", city: "ከተማ", address: "አድራሻ",
    payment: "ክፍያ", placeOrder: "ትዕዛዝ ይስጡ", orderPlaced: "ትዕዛዝ ተሰጥቷል", thankYou: "እናመሰግናለን",
    continueShopping: "ግዢን ይቀጥሉ", account: "መለያ", login: "ይግቡ / ይመዝገቡ",
    storeOwner: "የመሸጫ ባለቤት", adminLogin: "የአስተዳዳሪ መግቢያ",
    adminDashboard: "የአስተዳዳሪ ዳሽቦርድ", addProduct: "አዲስ ምርት ይጨምሩ", productName: "የምርት ስም",
    price: "ዋጋ (ብር)", category: "ምድብ", imageUrl: "የምስል አድራሻ",
    tag: "መለያ", saveProduct: "ምርት ጨምር", backToShop: "ወደ መሸጫ ተመለስ",
    search: "ይፈልጉ...", menu: "ማውጫ",
    exclusiveOffers: "ልዩ ቅናሾች", exclusiveDesc: "ይመዝገቡ እና በመጀመሪያ ግዢዎ 10% ቅናሽ ያግኙ።",
    vipRewards: "የቪአይፒ ሽልማቶች", vipDesc: "ነጥቦችን ያግኙ እና አስደሳች ሽልማቶችን ይቀይሩ።",
    secureCheckout: "100% ደህንነቱ የተጠበቀ", secureCheckoutDesc: "የእርስዎ መረጃ ከእኛ ጋር ደህንነቱ የተጠበቀ ነው።",
    adminLoginTitle: "የአስተዳዳሪ መግቢያ", username: "የተጠቃሚ ስም", password: "የመግቢያ ቃል", loginBtn: "ግባ",
    overview: "አጠቃላይ እይታ", inventory: "ክምችት", orders: "ትዕዛዞች", 
    totalSales: "ጠቅላላ ሽያጭ", totalOrders: "ጠቅላላ ትዕዛዞች", totalProducts: "ጠቅላላ ምርቶች",
    productImage: "የምርት ምስል (ይጫኑ)", selectImage: "የምስል ፋይል ይምረጡ...",
    orderId: "የትዕዛዝ መለያ", customer: "ደንበኛ", date: "ቀን", status: "ሁኔታ", amount: "መጠን",
    actions: "እርምጃዎች", featuredProducts: "የተመረጡ ምርቶች", viewAll: "ሁሉንም ይመልከቱ"
  }
}

const CAT_TRANSLATIONS = {
  en: { suits: 'Suits', dresses: 'Dresses', tops: 'Tops', bottoms: 'Bottoms', outerwear: 'Outerwear', shoes: 'Shoes', bags: 'Bags', jewelry: 'Jewelry', accessories: 'Accessories' },
  am: { suits: 'ሱቶች', dresses: 'ቀሚሶች', tops: 'ሸሚዞች', bottoms: 'ሱሪዎች', outerwear: 'ካፖርት', shoes: 'ጫማዎች', bags: 'ቦርሳዎች', jewelry: 'ጌጣጌጦች', accessories: 'መለዋወጫዎች' }
}

// ============ EXPANDED SAMPLE DATA ============
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Satin Cowl Slip Dress', price: 5600, category: 'dresses', color: '#f4c2c2', kind: 'dress', tag: 'Trending', imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600' },
  { _id: '2', name: 'Burgundy Knit Midi Dress', price: 5200, category: 'dresses', color: '#5a1f2c', kind: 'dress', tag: 'Winter', imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=600' },
  { _id: '3', name: 'Black Silk Evening Gown', price: 9800, category: 'dresses', color: '#000000', kind: 'dress', tag: 'Premium', imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600' },
  { _id: '4', name: 'Floral Wrap Dress', price: 4200, category: 'dresses', color: '#e8dccd', kind: 'dress', tag: '', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600' },
  { _id: '5', name: 'Pinstripe Tailored Suit', price: 9200, category: 'suits', color: '#1a1a1a', kind: 'dress', tag: 'Premium', imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600' },
  { _id: '6', name: 'Tweed Blazer & Skirt Set', price: 8500, category: 'suits', color: '#e8dccd', kind: 'dress', tag: '', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600' },
  { _id: '7', name: 'Classic Navy Suit', price: 7800, category: 'suits', color: '#000080', kind: 'dress', tag: 'Office', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600' },
  { _id: '8', name: 'Cable Knit Sweater', price: 3500, category: 'tops', color: '#f5f5dc', kind: 'top', tag: 'New', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600' },
  { _id: '9', name: 'Silk Button-Up Blouse', price: 3200, category: 'tops', color: '#f0e6d2', kind: 'top', tag: 'Classic', imageUrl: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600' },
  { _id: '10', name: 'Cropped Ribbed Tee', price: 1800, category: 'tops', color: '#ffffff', kind: 'top', tag: 'Hot', imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600' },
  { _id: '11', name: 'Tailored Wide-Leg Trousers', price: 4500, category: 'bottoms', color: '#6b4c3a', kind: 'top', tag: 'Hot', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600' },
  { _id: '12', name: 'Pleated Midi Skirt', price: 3800, category: 'bottoms', color: '#2a1d17', kind: 'top', tag: '', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600' },
  { _id: '13', name: 'Camel Wool Long Coat', price: 8900, category: 'outerwear', color: '#c19a6b', kind: 'dress', tag: '', imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600' },
  { _id: '14', name: 'Dark Brown Trench Coat', price: 9500, category: 'outerwear', color: '#3b2b20', kind: 'dress', tag: '', imageUrl: 'https://images.unsplash.com/photo-1544268950-999f7f3f3bf5?q=80&w=600' },
  { _id: '15', name: 'Shearling Lined Jacket', price: 7800, category: 'outerwear', color: '#8b5a2b', kind: 'top', tag: '', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600' },
  { _id: '16', name: 'Classic Black Top Handle', price: 4500, category: 'bags', color: '#000000', kind: 'handbag', tag: 'Bestseller', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600' },
  { _id: '17', name: 'Olive Green Leather Bag', price: 3800, category: 'bags', color: '#556b2f', kind: 'handbag', tag: '', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600' },
  { _id: '18', name: 'Pink Quilted Chain Bag', price: 4200, category: 'bags', color: '#f4c2c2', kind: 'handbag', tag: 'New', imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600' },
  { _id: '19', name: 'Black Suede Gold Heels', price: 5800, category: 'shoes', color: '#000000', kind: 'sneakers', tag: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600' },
  { _id: '20', name: 'Knee-High Leather Boots', price: 6800, category: 'shoes', color: '#4a2c2a', kind: 'sneakers', tag: '', imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=600' },
  { _id: '21', name: 'Classic White Sneakers', price: 3200, category: 'shoes', color: '#ffffff', kind: 'sneakers', tag: '', imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600' },
  { _id: '22', name: 'Pointed Toe Leather Pumps', price: 4600, category: 'shoes', color: '#8b5a2b', kind: 'sneakers', tag: '', imageUrl: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?q=80&w=600' },
  { _id: '23', name: 'Black Stone Gold Earrings', price: 1800, category: 'jewelry', color: '#d4af37', kind: 'top', tag: '', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600' },
  { _id: '24', name: 'Gold Coin Pendant', price: 2200, category: 'jewelry', color: '#d4af37', kind: 'top', tag: 'Hot', imageUrl: 'https://images.unsplash.com/photo-1599643478514-4a4204c05d6d?q=80&w=600' },
  { _id: '25', name: 'Chunky Gold Rings Set', price: 1500, category: 'jewelry', color: '#d4af37', kind: 'top', tag: '', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600' },
  { _id: '26', name: 'Black Cat-Eye Sunglasses', price: 1200, category: 'accessories', color: '#000000', kind: 'sneakers', tag: 'Summer', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600' },
  { _id: '27', name: 'Brown Rectangular Shades', price: 1100, category: 'accessories', color: '#4a2c2a', kind: 'sneakers', tag: '', imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600' },
  { _id: '28', name: 'Beige Cashmere Scarf', price: 2100, category: 'accessories', color: '#f5f5dc', kind: 'top', tag: 'Cozy', imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600' },
  { _id: '29', name: 'Minimalist Gold Watch', price: 6500, category: 'accessories', color: '#d4af37', kind: 'top', tag: '', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600' },
]

const MOCK_CATEGORIES = [
  { _id: 'c1', name: 'Suits', slug: 'suits' }, { _id: 'c2', name: 'Dresses', slug: 'dresses' },
  { _id: 'c3', name: 'Tops', slug: 'tops' }, { _id: 'c4', name: 'Bottoms', slug: 'bottoms' },
  { _id: 'c5', name: 'Outerwear', slug: 'outerwear' }, { _id: 'c6', name: 'Shoes', slug: 'shoes' },
  { _id: 'c7', name: 'Bags', slug: 'bags' }, { _id: 'c8', name: 'Jewelry', slug: 'jewelry' },
  { _id: 'c9', name: 'Accessories', slug: 'accessories' },
]

const MOCK_ORDERS = [
  { _id: 'ORD-1001', customerName: 'Abebe Kebede', phone: '0911223344', total: 5600, date: new Date().toISOString(), status: 'Pending' },
  { _id: 'ORD-1002', customerName: 'Sara Tekle', phone: '0922334455', total: 9800, date: new Date(Date.now() - 86400000).toISOString(), status: 'Delivered' },
]

// ============ FALLBACK ART ============
const W = '#ffffff', K = '#2c221b'
function Art({ kind, color = '#c98f7a' }) {
  let s = null
  switch (kind) {
    case 'dress': s = (<><path d="M38 12 L44 12 L50 24 L56 12 L62 12 L65 42 L82 92 H18 L35 42Z" fill={color} /><path d="M35 42 H65" stroke={W} strokeWidth="3" opacity=".6" /></>); break
    case 'top': s = (<><path d="M34 12 L42 12 Q50 26 58 12 L66 12 L70 30 L64 34 V88 H36 V34 L30 30Z" fill={color} /></>); break
    case 'handbag': s = (<><path d="M32 44 Q32 16 50 16 Q68 16 68 44" stroke={K} strokeWidth="5" fill="none" /><path d="M18 44 H82 L88 90 H12Z" fill={color} /></>); break
    case 'sneakers': s = (<><path d="M10 64 Q10 46 26 44 L40 36 Q46 34 52 42 L58 50 Q76 52 90 62 V74 H10Z" fill={W} stroke={color} strokeWidth="3" /><rect x="10" y="70" width="80" height="10" rx="4" fill={color} /></>); break
    default: s = <circle cx="50" cy="50" r="30" fill={color} />
  }
  return <svg className="art" viewBox="0 0 100 100" aria-hidden="true">{s}</svg>
}

// ============ STYLES & ANIMATIONS ============
const EXTRA_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

:root {
  --bg-dark: #2c221b; --bg-light: #f8f6f4; --text-dark: #1a1512;
  --text-muted: #7a6b60; --accent-rose: #8c5b54; --accent-gold: #d4a373;
  --border: #e6ded5; --white: #ffffff;
}

body { font-family: "Jost", sans-serif; margin: 0; background: var(--bg-light); color: var(--text-dark); overflow-x: hidden; }
h1, h2, h3, h4, .serif { font-family: "Cormorant Garamond", serif; font-weight: 500; margin: 0; }

/* --- SHOP CSS --- */
.nbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem clamp(1rem, 4vw, 4rem); transition: all 0.4s ease; }
.nbar.scrolled { background: rgba(44, 34, 27, 0.95); backdrop-filter: blur(15px); padding: 1rem clamp(1rem, 4vw, 4rem); border-bottom: 1px solid rgba(255,255,255,0.1); }
.logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--white); }
.logo span { font-family: "Cormorant Garamond", serif; font-size: 2rem; font-weight: 600; letter-spacing: 0.05em; }
.nav-links { display: flex; gap: 2.5rem; }
.nav-links a { color: var(--white); text-decoration: none; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; font-weight: 500; transition: opacity 0.3s; }
.nav-links a:hover { opacity: 0.6; }
.nav-icons { display: flex; gap: 1.2rem; align-items: center; }
.nav-icons button { background: none; border: none; color: var(--white); cursor: pointer; padding: 0; display: flex; align-items: center; position: relative; transition: transform 0.2s; }
.cart-badge { position: absolute; top: -5px; right: -8px; background: var(--accent-gold); color: var(--bg-dark); font-size: 0.6rem; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; }

/* --- PAGE CONTAINERS --- */
.page-container { padding-top: 100px; min-height: 70vh; }
.hero { position: relative; height: 100vh; min-height: 600px; background: var(--bg-dark); overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
.hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.hero-overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(to right, rgba(30, 20, 15, 0.8) 0%, rgba(30, 20, 15, 0.2) 100%); }
.hero-bg-text { position: absolute; top: 50%; left: 10%; transform: translateY(-50%); font-family: "Cormorant Garamond", serif; font-size: 20vw; color: var(--white); white-space: nowrap; font-weight: 700; pointer-events: none; z-index: 2; line-height: 1; opacity: 0.15; }
.hero-content { position: absolute; left: 10%; bottom: 25%; z-index: 3; color: var(--white); max-width: 400px; }
.hero-content h3 { font-size: 2rem; margin-bottom: 0.5rem; letter-spacing: 0.05em; color: var(--accent-gold); }
.trust-bar { position: absolute; bottom: 0; left: 0; right: 0; z-index: 10; background: rgba(44, 34, 27, 0.85); backdrop-filter: blur(20px); border-top: 1px solid rgba(255, 255, 255, 0.1); display: grid; grid-template-columns: repeat(4, 1fr); padding: 2rem clamp(1rem, 4vw, 4rem); gap: 2rem; }
.trust-item { display: flex; align-items: center; gap: 1rem; color: var(--white); }
.trust-icon { font-size: 1.5rem; color: var(--accent-gold); }
.trust-text h5 { font-size: 0.9rem; margin-bottom: 0.2rem; font-weight: 500; }
.trust-text p { font-size: 0.75rem; opacity: 0.7; margin: 0; font-weight: 300; }

/* --- SECTIONS --- */
.section-header-center { text-align: center; margin-bottom: 3rem; }
.categories-section { padding: 6rem 2rem; background: var(--bg-light); text-align: center; }
.section-label { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-rose); margin-bottom: 1rem; display: block; font-weight: 600; }
.section-title { font-size: clamp(2.5rem, 4vw, 3.5rem); color: var(--text-dark); margin-bottom: 0.5rem; }
.cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.cat-card { background: var(--white); border-radius: 16px; overflow: hidden; cursor: pointer; transition: transform 0.4s, box-shadow 0.4s; border: 1px solid var(--border); }
.cat-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
.cat-img { width: 100%; aspect-ratio: 1; object-fit: cover; background: #eee; transition: transform 0.6s; }
.cat-card:hover .cat-img { transform: scale(1.05); }
.cat-info { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; background: var(--white); }
.cat-info h4 { font-size: 1.3rem; color: var(--text-dark); }

/* --- SHOP GRID --- */
.shop-section { padding: 4rem 2rem; background: #f4efe9; min-height: 60vh; }
.shop-header { max-width: 1300px; margin: 0 auto 3rem auto; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; }
.filters { display: flex; gap: 1.5rem; flex-wrap: wrap; max-width: 1300px; margin: 0 auto 3rem auto; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
.filters button { background: none; border: none; padding: 0.5rem 0; cursor: pointer; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid transparent; }
.filters button.active { color: var(--accent-rose); border-bottom-color: var(--accent-rose); font-weight: 600; }
.search-bar { padding: 0.8rem 1rem; border: 1px solid var(--border); border-radius: 4px; font-family: inherit; font-size: 0.9rem; width: 250px; background: var(--white); }
.pgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 3rem; max-width: 1300px; margin: 0 auto; }
.pcard { cursor: pointer; }
.pcard-pic { position: relative; aspect-ratio: 4/5; background: #ebe3db; border-radius: 12px; overflow: hidden; margin-bottom: 1.2rem; }
.pcard-pic img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
.pcard:hover .pcard-pic img { transform: scale(1.08); }
.pcard-tag { position: absolute; top: 1rem; left: 1rem; background: var(--accent-rose); color: white; padding: 0.4rem 0.8rem; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; border-radius: 4px; }
.pcard h3 { font-size: 1.1rem; font-weight: 500; margin-bottom: 0.3rem; }
.pcard-price { color: var(--text-muted); font-size: 1rem; }
.pcard-add { margin-top: 1rem; width: 100%; background: transparent; border: 1px solid var(--text-dark); padding: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: 0.3s; border-radius: 4px; }
.pcard-add:hover { background: var(--text-dark); color: var(--white); }
.view-all-btn { background: var(--text-dark); color: white; padding: 1rem 3rem; border: none; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; cursor: pointer; border-radius: 4px; margin-top: 3rem; display: inline-block; }

/* Drawers & Modals */
.scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; backdrop-filter: blur(5px); }
.drawer { position: fixed; top: 0; bottom: 0; width: min(300px, 85vw); background: var(--bg-light); z-index: 210; display: flex; flex-direction: column; transition: transform 0.5s; }
.drawer.right { right: 0; transform: translateX(105%); width: min(400px, 100%); }
.drawer.right.open { transform: none; }
.drawer.left { left: 0; transform: translateX(-105%); }
.drawer.left.open { transform: none; }
.drawer-head { padding: 1.2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
.drawer-body { flex: 1; overflow: auto; padding: 1.2rem; }
.drawer-foot { padding: 1.2rem; border-top: 1px solid var(--border); background: var(--white); }
.btn-primary { width: 100%; padding: 1rem; background: var(--accent-rose); color: var(--white); border: none; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500; cursor: pointer; transition: background 0.3s; border-radius: 4px; }
.btn-primary:hover { background: #6f443f; }
.cart-line { display: grid; grid-template-columns: 70px 1fr auto; gap: 1rem; padding-bottom: 1.2rem; margin-bottom: 1.2rem; border-bottom: 1px solid var(--border); }
.cart-line img { width: 70px; height: 90px; object-fit: cover; border-radius: 6px; }
.qty { display: inline-flex; align-items: center; border: 1px solid var(--border); margin-top: 0.5rem; border-radius: 4px; }
.qty button { width: 28px; height: 28px; background: none; border: none; cursor: pointer; }
.qty span { width: 28px; text-align: center; font-size: 0.85rem; }

/* Benefits Bar */
.benefits-bar { display: flex; justify-content: space-between; align-items: center; background-color: #1a1a1a; padding: 1.5rem clamp(1rem, 4vw, 4rem); border-top: 1px solid rgba(255, 255, 255, 0.1); }
.benefit-item { display: flex; align-items: center; flex: 1; justify-content: center; position: relative; padding: 0 1rem; }
.benefit-item:not(:last-child)::after { content: ""; position: absolute; right: 0; top: 50%; transform: translateY(-50%); height: 35px; width: 1px; background-color: #444; }
.benefit-icon { color: #d1d1d1; margin-right: 12px; display: flex; align-items: center; }
.benefit-icon svg { width: 28px; height: 28px; }
.benefit-text { display: flex; flex-direction: column; text-align: left; }
.benefit-text h5 { margin: 0 0 3px 0; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; color: #ffffff; text-transform: uppercase; }
.benefit-text p { margin: 0; font-size: 11px; color: #a0a0a0; line-height: 1.3; }

/* --- ADMIN DASHBOARD CSS --- */
.admin-layout { display: flex; height: 100vh; background: #f4f6f8; }
.admin-sidebar { width: 250px; background: var(--bg-dark); color: white; display: flex; flex-direction: column; padding: 2rem 1rem; flex-shrink: 0; }
.admin-sidebar h2 { color: var(--accent-gold); font-size: 1.5rem; margin-bottom: 2rem; text-align: center; }
.admin-nav-btn { padding: 1rem; color: #ccc; background: none; border: none; text-align: left; font-size: 1rem; cursor: pointer; border-radius: 8px; margin-bottom: 0.5rem; transition: 0.3s; display: flex; align-items: center; gap: 10px; }
.admin-nav-btn:hover, .admin-nav-btn.active { background: rgba(255,255,255,0.1); color: white; }
.admin-nav-btn.active { border-left: 4px solid var(--accent-gold); background: rgba(255,255,255,0.15); }
.admin-main { flex: 1; padding: 3rem; overflow-y: auto; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.admin-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.admin-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.admin-card h3 { color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.admin-card p { font-size: 2rem; font-weight: 600; color: var(--text-dark); margin: 0; }
.admin-table-container { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; text-align: left; }
.admin-table th { background: #f8f9fa; padding: 1rem; border-bottom: 2px solid #eee; color: var(--text-muted); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; }
.admin-table td { padding: 1rem; border-bottom: 1px solid #eee; vertical-align: middle; }
.admin-table img { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; }
.status-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.status-Pending { background: #fff3cd; color: #856404; }
.status-Delivered { background: #d4edda; color: #155724; }
.admin-form { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 600px; }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
.form-group input, .form-group select { width: 100%; padding: 0.8rem; border: 1px solid var(--border); border-radius: 6px; font-family: inherit; box-sizing: border-box; }
.file-upload-btn { padding: 0.8rem; background: #eee; border: 1px dashed #ccc; border-radius: 6px; width: 100%; cursor: pointer; text-align: center; transition: 0.3s; }
.file-upload-btn:hover { background: #e2e2e2; }
.delete-btn { background: #ff4d4f; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
.delete-btn:hover { background: #ff7875; }

@media (max-width: 900px) {
  .admin-layout { flex-direction: column; }
  .admin-sidebar { width: 100%; flex-direction: row; overflow-x: auto; padding: 1rem; }
  .admin-sidebar h2 { display: none; }
  .admin-nav-btn { white-space: nowrap; margin-bottom: 0; }
  .benefits-bar { flex-direction: column; padding: 1.5rem 1rem; gap: 1.5rem; }
  .benefit-item { justify-content: flex-start; width: 100%; padding: 0; }
  .benefit-item:not(:last-child)::after { height: 1px; width: 100%; top: auto; bottom: -0.75rem; right: 0; transform: none; }
  .nbar { padding: 1rem; }
  .nav-links { display: none; }
  .pgrid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
  .shop-header { flex-direction: column; align-items: flex-start; }
  .search-bar { width: 100%; }
}
`

// ============ COMPONENTS ============
function Logo() {
  return (
    <a className="logo" href="#top" onClick={() => window.scrollTo(0,0)} aria-label="ሽክ home">
      <svg viewBox="0 0 40 40" width="28" height="28">
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M20 29C10 22 9 14 14.5 12.5 17.5 11.7 19.3 13.5 20 15 20.7 13.5 22.5 11.7 25.5 12.5 31 14 30 22 20 29Z" fill="currentColor" />
      </svg>
      <span>ሽክ</span>
    </a>
  )
}

function Photo({ p }) {
  const [bad, setBad] = useState(false)
  if (bad || !p.imageUrl) return <Art kind={p.kind} color={p.color} />
  const fullUrl = p.imageUrl.startsWith('http') || p.imageUrl.startsWith('data:') ? p.imageUrl : `${IMAGE_BASE}${p.imageUrl}`;
  return <img src={fullUrl} alt={p.name} loading="lazy" onError={() => setBad(true)} />
}

function ProductCard({ p, onAdd, t }) {
  return (
    <article className="pcard">
      <div className="pcard-pic">
        <Photo p={p} />
        {p.tag && <span className="pcard-tag">{p.tag}</span>}
      </div>
      <h3>{p.name}</h3>
      <div className="pcard-price">{money(p.price)}</div>
      <button className="pcard-add" onClick={() => onAdd(p)}>{t('addToBag')}</button>
    </article>
  )
}

// ============ MAIN APP ============
export default function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  // View State
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'shop', 'collections', 'new-arrivals'
  
  // Check URL immediately on load so it works with #admin
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname.includes('/admin') || window.location.hash === '#admin'
  })
  
  // Admin Auth State - Defaults to FALSE so it ALWAYS requires login on refresh
  const [isAdminAuth, setIsAdminAuth] = useState(false)
  const [adminForm, setAdminForm] = useState({ user: '', pass: '' })
  const [adminError, setAdminError] = useState('')
  const [adminTab, setAdminTab] = useState('overview')

  const [lang, setLang] = useState('en')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const t = (key) => T[lang][key] || key

  const [buyer, setBuyer] = useState(() => {
    try { return JSON.parse(localStorage.getItem('her-buyer-v2')) || null } catch { return null }
  })
  const [showAuth, setShowAuth] = useState(false)
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '' })

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('her-cart-v2')) || [] } catch { return [] }
  })

  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('bag')
  const [toast, setToast] = useState('')
  const [pay, setPay] = useState('cod')
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', email: '' })
  const [last, setLast] = useState(null)

  // Image Upload State for Admin
  const [uploadImage, setUploadImage] = useState('')
  const fileInputRef = useRef(null)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch(`${API}/products`).then(res => res.json()),
      fetch(`${API}/categories`).then(res => res.json()),
      fetch(`${API}/orders`).then(res => res.json()).catch(() => MOCK_ORDERS)
    ]).then(([prods, cats, ords]) => {
      if (prods.length === 0) {
        setProducts(MOCK_PRODUCTS.map(p => ({ ...p, id: p._id })))
        setCategories(MOCK_CATEGORIES)
      } else {
        setProducts(prods.map(p => ({ ...p, id: p._id })))
        setCategories(cats)
      }
      setOrders(ords.length ? ords : MOCK_ORDERS)
    }).catch(err => {
      setProducts(MOCK_PRODUCTS.map(p => ({ ...p, id: p._id })))
      setCategories(MOCK_CATEGORIES)
      setOrders(MOCK_ORDERS)
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname.includes('/admin') || window.location.hash === '#admin') {
        setIsAdminView(true)
      } else {
        setIsAdminView(false)
      }
    }

    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    
    fetchData()
    
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('her-cart-v2', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const notify = (msg) => setToast(msg)

  // Helper to change page and scroll to top
  const navigateTo = (page, category = 'all') => {
    setCurrentPage(page)
    setCat(category)
    window.scrollTo(0, 0)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setBuyer(authForm)
    localStorage.setItem('her-buyer-v2', JSON.stringify(authForm))
    setShowAuth(false)
    notify(lang === 'en' ? 'Account created!' : 'መለያ ተፈጥሯል!')
  }

  const logoutBuyer = () => {
    setBuyer(null)
    localStorage.removeItem('her-buyer-v2')
    notify(lang === 'en' ? 'Logged out' : 'ወጥተዋል')
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    if (adminForm.user === ADMIN_USER && adminForm.pass === ADMIN_PASS) {
      setIsAdminAuth(true)
      setAdminError('')
    } else {
      setAdminError('Invalid credentials!')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const finalImage = uploadImage || formData.get('imageUrl') || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600';

    const newProduct = {
      name: formData.get('name'), 
      price: Number(formData.get('price')),
      category: formData.get('category'), 
      imageUrl: finalImage,
      tag: formData.get('tag'), 
      color: '#c98f7a', 
      kind: 'dress'
    };

    try {
      const res = await fetch(`${API}/products`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProduct)
      });
      if(res.ok) { 
        notify('Product Added Successfully!'); 
        e.target.reset(); 
        setUploadImage('');
        fetchData(); 
        setAdminTab('inventory');
      }
      else { notify('Failed to add product to backend.'); }
    } catch (err) { 
      setProducts([{...newProduct, id: Date.now(), _id: Date.now()}, ...products]);
      notify('Product Added (Local State)');
      e.target.reset();
      setUploadImage('');
      setAdminTab('inventory');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await fetch(`${API}/products/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.log('Backend offline, deleting locally');
      }
      setProducts(products.filter(p => p.id !== id));
      notify('Product deleted');
    }
  };

  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;

  const allCats = [{ id: 'all', label: t('all') }, ...categories.map(c => ({ id: c.slug, label: CAT_TRANSLATIONS[lang][c.slug] || c.name }))]

  const visible = products.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const lines = cart.map(l => ({ ...l, p: products.find(x => x.id === l.id) })).filter(l => l.p)
  const count = lines.reduce((a, l) => a + l.qty, 0)
  const subtotal = lines.reduce((a, l) => a + l.qty * l.p.price, 0)
  const fee = lines.length === 0 || subtotal >= FREE_DELIVERY || pay === 'pickup' ? 0 : DELIVERY_FEE
  const total = subtotal + fee

  const add = (p) => {
    setCart(c => {
      const existing = c.find(l => l.id === p.id)
      if (existing) return c.map(l => l.id === p.id ? { ...l, qty: l.qty + 1 } : l)
      return [...c, { id: p.id, qty: 1 }]
    })
    notify(p.name + (lang === 'en' ? ' added to bag' : ' ወደ ቦርሳ ተጨምሯል'))
  }
  
  const change = (id, d) => setCart(c => c.map(l => l.id === id ? { ...l, qty: l.qty + d } : l).filter(l => l.qty > 0))

  const placeOrder = async (e) => {
    e.preventDefault()
    const orderData = {
      customerName: form.name, phone: form.phone, city: form.city, address: form.address, email: form.email,
      paymentMethod: pay, items: lines.map(l => ({ productId: l.p.id, name: l.p.name, price: l.p.price, qty: l.qty })),
      subtotal, fee, total, status: 'Pending', date: new Date().toISOString()
    }

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData)
      })
      if (!res.ok) throw new Error('Order failed')
      const savedOrder = await res.json()
      setLast(savedOrder)
      setOrders([savedOrder, ...orders])
    } catch (err) {
      const mockSaved = { ...orderData, _id: 'ORD-' + Math.floor(Math.random()*10000) };
      setLast(mockSaved);
      setOrders([mockSaved, ...orders]);
    }
    
    setCart([])
    setStep('done')
  }

  const icon = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (loading) return <div style={{padding: 50, textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-dark)'}}>Loading...</div>

  // ============ ADMIN VIEW ============
  if (isAdminView) {
    
    if (!isAdminAuth) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-dark)' }}>
          <style>{EXTRA_CSS}</style>
          <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', width: 'min(400px, 90%)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t('adminLoginTitle')}</h2>
            {adminError && <p style={{ color: 'red', marginBottom: '1rem' }}>{adminError}</p>}
            <form onSubmit={handleAdminLogin}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label>{t('username')}</label>
                <input type="text" required value={adminForm.user} onChange={e => setAdminForm({...adminForm, user: e.target.value})} placeholder="admin" />
              </div>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label>{t('password')}</label>
                <input type="password" required value={adminForm.pass} onChange={e => setAdminForm({...adminForm, pass: e.target.value})} placeholder="admin123" />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>{t('loginBtn')}</button>
              
              <button type="button" onClick={() => { window.location.hash = ''; setIsAdminView(false); }} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'gray', textDecoration: 'underline', cursor: 'pointer' }}>
                Back to Shop
              </button>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="admin-layout">
        <style>{EXTRA_CSS}</style>
        
        <aside className="admin-sidebar">
          <h2>ሽክ Admin</h2>
          <button className={`admin-nav-btn ${adminTab === 'overview' ? 'active' : ''}`} onClick={() => setAdminTab('overview')}>📊 {t('overview')}</button>
          <button className={`admin-nav-btn ${adminTab === 'inventory' ? 'active' : ''}`} onClick={() => setAdminTab('inventory')}>📦 {t('inventory')}</button>
          <button className={`admin-nav-btn ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}>🛒 {t('orders')}</button>
          <button className={`admin-nav-btn ${adminTab === 'add-product' ? 'active' : ''}`} onClick={() => setAdminTab('add-product')}>➕ {t('addProduct')}</button>
          
          <div style={{ marginTop: 'auto' }}>
            <button className="admin-nav-btn" onClick={() => { setIsAdminAuth(false); setAdminForm({user:'', pass:''}) }}>🚪 Logout</button>
            <button className="admin-nav-btn" onClick={() => { window.location.hash = ''; setIsAdminView(false); }}>← {t('backToShop')}</button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <h1 style={{ fontSize: '2rem' }}>{t(adminTab)}</h1>
          </div>

          {adminTab === 'overview' && (
            <>
              <div className="admin-card-grid">
                <div className="admin-card"><h3>{t('totalSales')}</h3><p>{money(totalSales)}</p></div>
                <div className="admin-card"><h3>{t('totalOrders')}</h3><p>{totalOrdersCount}</p></div>
                <div className="admin-card"><h3>{t('totalProducts')}</h3><p>{totalProductsCount}</p></div>
              </div>
              <div className="admin-table-container">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}><h3>Recent Orders</h3></div>
                <table className="admin-table">
                  <thead><tr><th>{t('orderId')}</th><th>{t('customer')}</th><th>{t('amount')}</th><th>{t('status')}</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o._id}>
                        <td>{o._id}</td>
                        <td>{o.customerName}</td>
                        <td>{money(o.total)}</td>
                        <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {adminTab === 'inventory' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden' }}>
                          <Photo p={p} />
                        </div>
                      </td>
                      <td>{p.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                      <td>{money(p.price)}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === 'orders' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead><tr><th>{t('orderId')}</th><th>{t('customer')}</th><th>{t('phone')}</th><th>{t('amount')}</th><th>{t('status')}</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{o._id}</td>
                      <td>{o.customerName}</td>
                      <td>{o.phone}</td>
                      <td>{money(o.total)}</td>
                      <td><span className={`status-badge status-${o.status || 'Pending'}`}>{o.status || 'Pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === 'add-product' && (
            <div className="admin-form">
              <form onSubmit={handleAddProduct}>
                <div className="form-group"><label>{t('productName')}</label><input name="name" required placeholder="e.g. Summer Floral Dress" /></div>
                <div className="form-group"><label>{t('price')}</label><input name="price" type="number" required placeholder="e.g. 4500" /></div>
                <div className="form-group"><label>{t('category')}</label>
                  <select name="category" required>
                    {categories.map(c => <option key={c._id} value={c.slug}>{CAT_TRANSLATIONS[lang][c.slug] || c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>{t('tag')}</label><input name="tag" placeholder="New, Sale, Hot" /></div>
                
                <div className="form-group">
                  <label>{t('productImage')}</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />
                  <div className="file-upload-btn" onClick={() => fileInputRef.current.click()}>
                    {uploadImage ? '✅ Image Selected (Click to change)' : `📁 ${t('selectImage')}`}
                  </div>
                  {uploadImage && <img src={uploadImage} alt="Preview" style={{ marginTop: '10px', width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />}
                  
                  <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'gray', textAlign: 'center' }}>— OR PASTE AN IMAGE URL —</div>
                  <input name="imageUrl" placeholder="https://..." style={{ marginTop: '5px' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>{t('saveProduct')}</button>
              </form>
            </div>
          )}
        </main>
      </div>
    )
  }

  // ============ MAIN SHOP VIEW ============
  return (
    <div id="top">
      <style>{EXTRA_CSS}</style>

      <header className={`nbar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="nav-icons" onClick={() => setIsMenuOpen(true)} style={{ color: 'var(--white)' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" {...icon}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            <Logo />
          </div>
        </div>
        
        <nav className="nav-links">
          <a onClick={() => navigateTo('home')}>{t('home')}</a>
          <a onClick={() => navigateTo('shop')}>{t('shop')}</a>
          <a onClick={() => navigateTo('new-arrivals')}>{t('newArrivals')}</a>
          <a onClick={() => navigateTo('collections')}>{t('collections')}</a>
        </nav>

        <div className="nav-icons">
          <button onClick={() => navigateTo('shop')}><svg viewBox="0 0 24 24" {...icon}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></button>
          <button onClick={() => setShowAuth(true)}><svg viewBox="0 0 24 24" {...icon}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
          <button onClick={() => { setStep('bag'); setOpen(true) }}>
            <svg viewBox="0 0 24 24" {...icon}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </header>

      {/* PAGE: HOME */}
      {currentPage === 'home' && (
        <>
          <section className="hero">
            <img className="hero-image" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop" alt="ሽክ Hero" />
            <div className="hero-overlay"></div>
            <div className="hero-bg-text">{t('heroTitle')}</div>
            
            <div className="hero-content">
              <h3>{t('heroSmall')}</h3>
              <p>{t('heroDesc')}</p>
            </div>

            <div className="trust-bar">
              <div className="trust-item"><div className="trust-icon">🚚</div><div className="trust-text"><h5>{t('freeShipping')}</h5><p>{t('freeShipDesc')}</p></div></div>
              <div className="trust-item"><div className="trust-icon">🔒</div><div className="trust-text"><h5>{t('securePayment')}</h5><p>{t('securePayDesc')}</p></div></div>
              <div className="trust-item"><div className="trust-icon">✨</div><div className="trust-text"><h5>{t('trendyCollections')}</h5><p>{t('trendDesc')}</p></div></div>
              <div className="trust-item"><div className="trust-icon">💬</div><div className="trust-text"><h5>{t('support')}</h5><p>{t('supportDesc')}</p></div></div>
            </div>
          </section>

          <section className="categories-section">
            <div className="section-header-center">
              <span className="section-label">— {t('shopByCategory')} —</span>
              <h2 className="section-title">{t('findStyle')}</h2>
            </div>
            <div className="cat-grid">
              <div className="cat-card" onClick={() => navigateTo('shop', 'dresses')}>
                <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400" className="cat-img" alt="Women" />
                <div className="cat-info"><h4>{t('women')}</h4><span>→</span></div>
              </div>
              <div className="cat-card" onClick={() => navigateTo('shop', 'suits')}>
                <img src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=400" className="cat-img" alt="Men" />
                <div className="cat-info"><h4>{t('men')}</h4><span>→</span></div>
              </div>
              <div className="cat-card" onClick={() => navigateTo('shop', 'bags')}>
                <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400" className="cat-img" alt="Accessories" />
                <div className="cat-info"><h4>{t('accessories')}</h4><span>→</span></div>
              </div>
              <div className="cat-card" onClick={() => navigateTo('shop', 'shoes')}>
                <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400" className="cat-img" alt="Footwear" />
                <div className="cat-info"><h4>{t('footwear')}</h4><span>→</span></div>
              </div>
            </div>
          </section>

          <section className="shop-section" style={{ background: 'var(--white)' }}>
            <div className="section-header-center">
              <h2 className="section-title">{t('featuredProducts')}</h2>
            </div>
            <div className="pgrid">
              {products.slice(0, 4).map(p => <ProductCard key={p.id} p={p} onAdd={add} t={t} />)}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="view-all-btn" onClick={() => navigateTo('shop')}>{t('viewAll')}</button>
            </div>
          </section>
        </>
      )}

      {/* PAGE: SHOP & NEW ARRIVALS */}
      {(currentPage === 'shop' || currentPage === 'new-arrivals') && (
        <div className="page-container">
          <section className="shop-section">
            <div className="shop-header">
              <div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-dark)' }}>
                  {currentPage === 'new-arrivals' ? t('newArrivals') : cat === 'all' ? t('shop') : CAT_TRANSLATIONS[lang][cat]}
                </h2>
              </div>
              <input type="search" className="search-bar" placeholder={t('search')} value={q} onChange={e => setQ(e.target.value)} />
            </div>
            
            <div className="filters">
              {allCats.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)} className={cat === c.id ? 'active' : ''}>{c.label}</button>
              ))}
            </div>

            {visible.length > 0 ? (
              <div className="pgrid">
                {visible.map(p => <ProductCard key={p.id} p={p} onAdd={add} t={t} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem' }}><h2 style={{ color: 'var(--text-muted)' }}>No items found.</h2></div>
            )}
          </section>
        </div>
      )}

      {/* PAGE: COLLECTIONS */}
      {currentPage === 'collections' && (
        <div className="page-container">
          <section className="categories-section" style={{ padding: '4rem 2rem' }}>
            <div className="section-header-center">
              <span className="section-label">— {t('collections')} —</span>
              <h2 className="section-title">{t('findStyle')}</h2>
            </div>
            <div className="cat-grid">
              {categories.map(c => (
                <div key={c._id} className="cat-card" onClick={() => navigateTo('shop', c.slug)}>
                  <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400" className="cat-img" alt={c.name} />
                  <div className="cat-info"><h4>{CAT_TRANSLATIONS[lang][c.slug] || c.name}</h4><span>→</span></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="benefits-bar">
        <div className="benefit-item">
          <div className="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg></div>
          <div className="benefit-text"><h5>{t('exclusiveOffers')}</h5><p>{t('exclusiveDesc')}</p></div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg></div>
          <div className="benefit-text"><h5>{t('vipRewards')}</h5><p>{t('vipDesc')}</p></div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
          <div className="benefit-text"><h5>{t('secureCheckout')}</h5><p>{t('secureCheckoutDesc')}</p></div>
        </div>
      </div>

      <footer style={{ background: 'var(--bg-dark)', color: 'var(--white)', padding: '5rem 2rem', textAlign: 'center' }}>
        <Logo />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <a onClick={() => setShowAuth(true)} style={{ color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.9rem' }}>{t('login')}</a>
          <a onClick={() => { window.location.hash = 'admin'; setIsAdminView(true); }} style={{ color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.9rem' }}>
            {t('adminLogin')}
          </a>
        </div>
        <p style={{ marginTop: '3rem', fontSize: '0.8rem', opacity: 0.5 }}>© 2026 ሽክ. All rights reserved.</p>
      </footer>

      {isMenuOpen && <div className="scrim" onClick={() => setIsMenuOpen(false)} />}
      <aside className={`drawer left ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-head"><Logo /><button className="drawer-close" onClick={() => setIsMenuOpen(false)}>✕</button></div>
        <div className="drawer-body">
          <div className="menu-links">
            <a onClick={() => { setIsMenuOpen(false); navigateTo('home'); }}>{t('home')}</a>
            <a onClick={() => { setIsMenuOpen(false); navigateTo('shop'); }}>{t('shop')}</a>
            <a onClick={() => { setIsMenuOpen(false); navigateTo('new-arrivals'); }}>{t('newArrivals')}</a>
            <a onClick={() => { setIsMenuOpen(false); navigateTo('collections'); }}>{t('collections')}</a>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setLang('en')} style={{ flex: 1, padding: '0.6rem', background: lang === 'en' ? 'var(--accent-rose)' : 'transparent', color: lang === 'en' ? 'white' : 'var(--text-dark)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: '4px' }}>English</button>
            <button onClick={() => setLang('am')} style={{ flex: 1, padding: '0.6rem', background: lang === 'am' ? 'var(--accent-rose)' : 'transparent', color: lang === 'am' ? 'white' : 'var(--text-dark)', border: '1px solid var(--border)', cursor: 'pointer', borderRadius: '4px' }}>አማርኛ</button>
          </div>
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={`drawer right ${open ? 'open' : ''}`}>
        <div className="drawer-head">
          {step === 'details' ? <button onClick={() => setStep('bag')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--accent-rose)' }}>{t('back')}</button> : <h2>{step === 'done' ? t('orderPlaced') : t('yourBag')}</h2>}
          <button className="drawer-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {step === 'bag' && (
          <>
            <div className="drawer-body">
              {lines.length === 0 ? <p style={{ textAlign: 'center', marginTop: '2rem' }}>{t('emptyBag')}</p> : lines.map(l => (
                <div className="cart-line" key={l.id}>
                  <Photo p={l.p} />
                  <div>
                    <b>{l.p.name}</b>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{money(l.p.price)}</div>
                    <div className="qty">
                      <button onClick={() => change(l.id, -1)}>−</button><span>{l.qty}</span><button onClick={() => change(l.id, 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 500 }}>{money(l.p.price * l.qty)}</div>
                </div>
              ))}
            </div>
            {lines.length > 0 && (
              <div className="drawer-foot">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 600 }}>
                  <span>{t('total')}</span><span>{money(total)}</span>
                </div>
                <button className="btn-primary" onClick={() => setStep('details')}>{t('checkout')}</button>
              </div>
            )}
          </>
        )}

        {step === 'details' && (
          <form className="drawer-body" onSubmit={placeOrder}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t('details')}</h3>
            <label style={{ display: 'block', marginBottom: '1rem' }}>{t('fullName')}<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', border: '1px solid var(--border)' }} /></label>
            <label style={{ display: 'block', marginBottom: '1rem' }}>{t('phone')}<input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', border: '1px solid var(--border)' }} /></label>
            <label style={{ display: 'block', marginBottom: '1rem' }}>{t('city')}<input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', border: '1px solid var(--border)' }} /></label>
            <label style={{ display: 'block', marginBottom: '1rem' }}>{t('address')}<input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', border: '1px solid var(--border)' }} /></label>
            
            <h3 style={{ margin: '2rem 0 1rem 0', fontSize: '1.5rem' }}>{t('payment')}</h3>
            {PAYMENTS.map(p => (
              <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: pay===p.id ? '#fcf5f4' : 'transparent', padding: '1rem', border: '1px solid var(--border)', cursor: 'pointer', marginBottom: '0.5rem', borderRadius: '4px' }}>
                <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} />
                <div>{lang === 'en' ? p.label : p.labelAm}</div>
              </label>
            ))}
            <button className="btn-primary" style={{ marginTop: '2rem' }}>{t('placeOrder')}</button>
          </form>
        )}

        {step === 'done' && last && (
          <div className="drawer-body" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div style={{ fontSize: '4rem', color: 'var(--accent-rose)' }}>✓</div>
            <h3 style={{ margin: '1rem 0', fontSize: '2rem' }}>{t('thankYou')}, {last.customerName}!</h3>
            <p style={{ color: 'var(--text-muted)' }}>{t('orderPlaced')}.</p>
            <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => { setOpen(false); setStep('bag'); navigateTo('home') }}>{t('continueShopping')}</button>
          </div>
        )}
      </aside>

      {showAuth && (
        <div className="scrim" style={{ display: 'grid', placeItems: 'center' }} onClick={(e) => e.target.classList.contains('scrim') && setShowAuth(false)}>
          <div style={{ background: 'var(--white)', padding: '3rem', width: 'min(400px, 90%)', position: 'relative', borderRadius: '16px' }}>
            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowAuth(false)}>✕</button>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>{buyer ? t('account') : t('login')}</h2>
            {buyer ? (
              <div>
                <p>Welcome back, <b>{buyer.name}</b></p>
                <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={logoutBuyer}>Log Out</button>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                <label style={{ display: 'block', marginBottom: '1rem' }}>{t('fullName')}<input required value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', border: '1px solid var(--border)' }} /></label>
                <label style={{ display: 'block', marginBottom: '1rem' }}>{t('phone')}<input required value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', border: '1px solid var(--border)' }} /></label>
                <label style={{ display: 'block', marginBottom: '1rem' }}>Email<input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{ width: '100%', padding: '0.8rem', marginTop: '0.3rem', border: '1px solid var(--border)' }} /></label>
                <button className="btn-primary" style={{ marginTop: '1rem' }}>Register</button>
              </form>
            )}
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: toast ? 'translate(-50%, 0)' : 'translate(-50%, 20px)', background: 'var(--bg-dark)', color: 'white', padding: '1rem 2rem', borderRadius: '50px', zIndex: 300, opacity: toast ? 1 : 0, transition: 'all 0.3s', pointerEvents: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        {toast}
      </div>
    </div>
  )
}