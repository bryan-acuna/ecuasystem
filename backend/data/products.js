const products = [
  // ── Phones ───────────────────────────────────────────────────────────────
  {
    name: 'iPhone 15 Pro 256GB',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    description:
      'Apple iPhone 15 Pro with A17 Pro chip, titanium design, 48MP main camera, Action Button, and USB-C connectivity. Available in Natural Titanium.',
    brand: 'Apple',
    category: 'Phones',
    price: 999.99,
    countInStock: 12,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://images.unsplash.com/photo-1706220988722-2fbdc5c3d717?w=500',
    description:
      'Samsung Galaxy S24 Ultra with built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and a 5000mAh battery. The ultimate Android flagship.',
    brand: 'Samsung',
    category: 'Phones',
    price: 1199.99,
    countInStock: 8,
    rating: 4.7,
    numReviews: 18,
  },
  {
    name: 'Google Pixel 8 Pro',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
    description:
      'Google Pixel 8 Pro with Tensor G3 chip, 50MP triple camera system, 7 years of OS updates, and AI-powered features including Magic Eraser.',
    brand: 'Google',
    category: 'Phones',
    price: 799.99,
    countInStock: 15,
    rating: 4.6,
    numReviews: 14,
  },
  {
    name: 'OnePlus 12 5G',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    description:
      'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad-tuned 50MP camera, 100W fast charging, and a smooth 120Hz AMOLED display.',
    brand: 'OnePlus',
    category: 'Phones',
    price: 699.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 11,
  },
  {
    name: 'iPhone 13 Pro 256GB',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500',
    description:
      'Introducing the iPhone 13 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life.',
    brand: 'Apple',
    category: 'Phones',
    price: 599.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },

  // ── Tablets ───────────────────────────────────────────────────────────────
  {
    name: 'iPad Pro 12.9" M2 WiFi 256GB',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    description:
      'iPad Pro with M2 chip, Liquid Retina XDR display, ProMotion 120Hz, Thunderbolt port, and support for Apple Pencil and Magic Keyboard.',
    brand: 'Apple',
    category: 'Tablets',
    price: 1099.99,
    countInStock: 6,
    rating: 4.9,
    numReviews: 20,
  },
  {
    name: 'Samsung Galaxy Tab S9+',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
    description:
      'Samsung Galaxy Tab S9+ with Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, S Pen included, IP68 water resistance, and 12600mAh battery.',
    brand: 'Samsung',
    category: 'Tablets',
    price: 899.99,
    countInStock: 9,
    rating: 4.6,
    numReviews: 16,
  },
  {
    name: 'iPad Air 10.9" M1 64GB',
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500',
    description:
      'iPad Air with M1 chip, 10.9-inch Liquid Retina display, Touch ID, USB-C connectivity, and support for Apple Pencil 2nd gen and Magic Keyboard.',
    brand: 'Apple',
    category: 'Tablets',
    price: 599.99,
    countInStock: 14,
    rating: 4.7,
    numReviews: 22,
  },
  {
    name: 'Microsoft Surface Pro 9',
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500',
    description:
      'Microsoft Surface Pro 9 with Intel Core i5, 8GB RAM, 256GB SSD, 13-inch PixelSense display, and Windows 11. The tablet that can replace your laptop.',
    brand: 'Microsoft',
    category: 'Tablets',
    price: 1299.99,
    countInStock: 5,
    rating: 4.4,
    numReviews: 9,
  },
  {
    name: 'Amazon Fire HD 10 Tablet',
    image: 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=500',
    description:
      'Amazon Fire HD 10 with 10.1-inch Full HD display, octa-core processor, 3GB RAM, up to 12 hours battery life, and Alexa hands-free.',
    brand: 'Amazon',
    category: 'Tablets',
    price: 149.99,
    countInStock: 20,
    rating: 4.2,
    numReviews: 30,
  },

  // ── Electronics ───────────────────────────────────────────────────────────
  {
    name: 'AirPods Pro 2nd Generation',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
    description:
      'AirPods Pro with Active Noise Cancellation, Transparency mode, Adaptive Audio, personalized Spatial Audio, and MagSafe Charging Case.',
    brand: 'Apple',
    category: 'Electronics',
    price: 249.99,
    countInStock: 18,
    rating: 4.8,
    numReviews: 35,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    description:
      'Sony WH-1000XM5 with industry-leading noise cancellation, 30-hour battery life, multipoint connection, and crystal clear hands-free calling.',
    brand: 'Sony',
    category: 'Electronics',
    price: 349.99,
    countInStock: 10,
    rating: 4.9,
    numReviews: 28,
  },
  {
    name: 'Cannon EOS 80D DSLR Camera',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
    description:
      'Canon EOS 80D with 24.2MP APS-C sensor, Dual Pixel CMOS AF, 45-point all cross-type AF system, and built-in Wi-Fi and NFC.',
    brand: 'Canon',
    category: 'Electronics',
    price: 929.99,
    countInStock: 5,
    rating: 4.3,
    numReviews: 12,
  },
  {
    name: 'Sony PlayStation 5',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
    description:
      'PlayStation 5 with ultra-high speed SSD, ray tracing, 4K gaming, DualSense haptic feedback controller, and backwards compatibility with PS4 games.',
    brand: 'Sony',
    category: 'Electronics',
    price: 499.99,
    countInStock: 11,
    rating: 5,
    numReviews: 40,
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    description:
      'Logitech MX Master 3S with 8K DPI sensor, MagSpeed scroll wheel, USB-C charging, Quiet Clicks, and multi-device connectivity via Bolt receiver or Bluetooth.',
    brand: 'Logitech',
    category: 'Electronics',
    price: 99.99,
    countInStock: 14,
    rating: 4.7,
    numReviews: 19,
  },
  {
    name: 'Amazon Echo Dot 5th Generation',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500',
    description:
      'Echo Dot 5th Gen with improved audio, built-in temperature sensor, motion detection, Eero Wi-Fi extender, and hands-free Alexa.',
    brand: 'Amazon',
    category: 'Electronics',
    price: 49.99,
    countInStock: 25,
    rating: 4.4,
    numReviews: 50,
  },
  {
    name: 'Samsung 55" 4K QLED Smart TV',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=500',
    description:
      'Samsung 55-inch QLED 4K Smart TV with Quantum HDR, Motion Xcelerator 120Hz, Object Tracking Sound, and built-in Alexa and Google Assistant.',
    brand: 'Samsung',
    category: 'Electronics',
    price: 799.99,
    countInStock: 7,
    rating: 4.6,
    numReviews: 17,
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    description:
      'Apple Watch Series 9 with S9 chip, double tap gesture, Always-On Retina display, crash detection, ECG app, and blood oxygen sensor.',
    brand: 'Apple',
    category: 'Electronics',
    price: 429.99,
    countInStock: 13,
    rating: 4.7,
    numReviews: 21,
  },
  {
    name: 'DJI Mini 4 Pro Drone',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500',
    description:
      'DJI Mini 4 Pro under 249g foldable drone with 4K HDR video, omnidirectional obstacle sensing, 34-min flight time, and ActiveTrack 360.',
    brand: 'DJI',
    category: 'Electronics',
    price: 759.99,
    countInStock: 4,
    rating: 4.8,
    numReviews: 13,
  },
];

export default products;
