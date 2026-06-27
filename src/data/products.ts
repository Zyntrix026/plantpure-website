import productColorKit from "/image-kit.png";
import productShampoo from "/hair-cleanser.jpg";
import productColorSecure from "/hair-cleanser2.jpg";
import productJojoba from "/flower-oil.png";
import productMoringa from "/morninga-oil.jpg";
import productHibiscusOil from "/seed-oil.jpg";
import Cervical from "/Cervical-image.png";

export const PRODUCTS: Product[] = [
  {
    id: "color-kit",
    category: "Hair Color",
    name: "Natural Hair Coloring Kit",
    tagline: "Henna Powder, Indigo Powder, Hibiscus Oil",
    description:
      "A complete herbal hair colouring ritual crafted with Henna, Indigo and Hibiscus. Designed to provide rich natural colour, grey coverage and nourishment without ammonia or harsh chemicals.",
    benefits: [
      "100% Herbal Formula",
      "Grey Hair Coverage",
      "Adds Natural Shine",
      "Strengthens Hair",
    ],
    ingredients: ["hibiscus", "amla"],
    sku: "PP-HC-001",
    price: 900,
    image: productColorKit,
    rating: 5,
    reviews: 128,
  },

  {
    id: "cleansing-cleanser",
    category: "Hair Cleanser",
    name: "Cleansing & Nourishing Hair Cleanser",
    tagline: "Rosemary, Saw Palmetto, Hibiscus",
    description:
      "A sulphate-free botanical cleanser that gently removes impurities while nourishing the scalp and strengthening roots.",
    benefits: [
      "Deep Cleansing",
      "Reduces Hair Fall",
      "Strengthens Roots",
      "Hydrates Scalp",
    ],
    ingredients: ["rosemary", "hibiscus"],
    sku: "PP-HCL-002",
    price: 340,
    originalPrice: 680,
    image: productShampoo,
    rating: 5,
    reviews: 74,
  },

  {
    id: "color-secure-cleanser",
    category: "Hair Cleanser",
    name: "Color Secure Hair Cleanser",
    tagline: "Rosemary, Saw Palmetto, Hibiscus",
    description:
      "Specially developed for coloured hair to maintain vibrancy while keeping the scalp fresh and balanced.",
    benefits: [
      "Protects Hair Colour",
      "Gentle Daily Use",
      "Hydrates Scalp",
      "Adds Shine",
    ],
    ingredients: ["rosemary", "hibiscus"],
    sku: "PP-HCL-003",
    price: 340,
    originalPrice: 680,
    image: productColorSecure,
    rating: 5,
    reviews: 52,
  },

  {
    id: "jojoba",
    category: "Hair Oil",
    name: "Hibiscus Flower Oil",
    tagline:
      "Hibiscus Flower Extract, Black Sesame Seed Oil, Fenugreek Seed Extract, Rose Oil",
    description:
      "A luxurious botanical hair oil infused with hibiscus and sesame to strengthen follicles, nourish roots and improve shine.",
    benefits: [
      "Reduces Hair Breakage",
      "Improves Shine",
      "Deep Nourishment",
      "Healthy Scalp",
    ],
    ingredients: ["hibiscus", "sesame"],
    sku: "PP-OIL-004",
    price: 680,
    image: productJojoba,
    rating: 5,
    reviews: 84,
  },

  {
    id: "moringa",
    category: "Hair Oil",
    name: "Organic Cold-Pressed Jojoba Seed Oil",
    tagline: "100% Pure Cold-Pressed Jojoba Oil",
    description:
      "Cold-pressed jojoba oil that mimics natural scalp oils and delivers lightweight hydration without greasiness.",
    benefits: [
      "Balances Oil Production",
      "Deep Hydration",
      "Frizz Control",
      "Lightweight Formula",
    ],
    ingredients: ["jojoba"],
    sku: "PP-OIL-005",
    price: 375,
    image: productMoringa,
    rating: 5,
    reviews: 61,
  },

  {
    id: "hibiscus-oil",
    category: "Hair Oil",
    name: "Moringa Oil",
    tagline: "Cold-Pressed Moringa Oil",
    description:
      "Nutrient-rich moringa oil packed with antioxidants, vitamins and minerals to strengthen hair and restore scalp health.",
    benefits: [
      "Repairs Damage",
      "Reduces Dryness",
      "Improves Hair Texture",
      "Rich in Nutrients",
    ],
    ingredients: ["moringa"],
    sku: "PP-OIL-006",
    price: 350,
    image: productHibiscusOil,
    rating: 5,
    reviews: 88,
  },

  {
    id: "cervical-oil",
    category: "Pain Relief Oil",
    name: "Cervical & Back Pain Oil",
    tagline: "Herbal Pain Relief Oil",
    description:
      "A traditional herbal oil formulated to provide soothing relief from cervical discomfort, muscle stiffness and back pain.",
    benefits: [
      "Relieves Muscle Pain",
      "Improves Mobility",
      "Reduces Stiffness",
      "Herbal Formula",
    ],
    ingredients: ["sesame", "brahmi"],
    sku: "PP-PR-007",
    price: 680,
    image: Cervical,
    rating: 5,
    reviews: 88,
  },
];