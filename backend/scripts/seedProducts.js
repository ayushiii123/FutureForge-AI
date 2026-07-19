import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/techrevive";

const samples = [
  // Smartphones
  {
    name: "Pixel 8 Pro",
    brand: "Google",
    category: "Smartphones",
    condition: "new",
    description: "Google Pixel 8 Pro with 50MP camera, excellent low-light performance and flagship speed.",
    price: 799,
    originalPrice: 999,
    stock: 10,
    image: "",
  },
  {
    name: "iPhone 15 Mini",
    brand: "Apple",
    category: "Smartphones",
    condition: "new",
    description: "Compact iPhone 15 Mini with A16 chip and advanced camera features.",
    price: 699,
    originalPrice: 799,
    stock: 7,
    image: "",
  },
  {
    name: "OnePlus Nord CE",
    brand: "OnePlus",
    category: "Smartphones",
    condition: "refurbished",
    description: "Refurbished OnePlus Nord CE — smooth 90Hz display and reliable battery.",
    price: 179,
    originalPrice: 299,
    stock: 20,
    image: "",
  },

  // Tablets
  {
    name: "iPad Air",
    brand: "Apple",
    category: "Tablets",
    condition: "new",
    description: "iPad Air 10.9-inch — lightweight tablet perfect for media and note-taking.",
    price: 599,
    originalPrice: 699,
    stock: 8,
    image: "",
  },
  {
    name: "Galaxy Tab S8",
    brand: "Samsung",
    category: "Tablets",
    condition: "refurbished",
    description: "Refurbished Galaxy Tab S8 with S-Pen support and great display.",
    price: 349,
    originalPrice: 649,
    stock: 5,
    image: "",
  },
  {
    name: "Lenovo Tab P11",
    brand: "Lenovo",
    category: "Tablets",
    condition: "new",
    description: "Lenovo Tab P11 — affordable tablet with good battery life and stereo speakers.",
    price: 229,
    originalPrice: 299,
    stock: 10,
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=21",
  },
  {
    name: "Microsoft Surface Go 3",
    brand: "Microsoft",
    category: "Tablets",
    condition: "refurbished",
    description: "Surface Go 3 — compact 2-in-1 tablet for productivity on the go.",
    price: 399,
    originalPrice: 549,
    stock: 4,
    image: "https://images.unsplash.com/photo-1580910051077-8e7f1a79a9d8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=22",
  },
  {
    name: "Amazon Fire HD 10",
    brand: "Amazon",
    category: "Tablets",
    condition: "new",
    description: "Fire HD 10 — budget tablet with vibrant display and long battery life.",
    price: 149,
    originalPrice: 199,
    stock: 20,
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=23",
  },

  // Smart Watches
  {
    name: "Galaxy Watch 6",
    brand: "Samsung",
    category: "Smart Watches",
    condition: "new",
    description: "Galaxy Watch with advanced health tracking and long battery life.",
    price: 249,
    originalPrice: 299,
    stock: 15,
    image: "",
  },
  {
    name: "Apple Watch SE",
    brand: "Apple",
    category: "Smart Watches",
    condition: "refurbished",
    description: "Refurbished Apple Watch SE — great value for fitness tracking.",
    price: 129,
    originalPrice: 199,
    stock: 6,
    image: "",
  },
  {
    name: "Fitbit Versa 4",
    brand: "Fitbit",
    category: "Smart Watches",
    condition: "new",
    description: "Fitbit Versa 4 — fitness-focused smartwatch with long battery life.",
    price: 179,
    originalPrice: 219,
    stock: 10,
    image: "https://images.unsplash.com/photo-1543168256-1b31e7d2b6c8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=31",
  },

  // Cameras
  {
    name: "Sony Alpha a6400",
    brand: "Sony",
    category: "Cameras",
    condition: "refurbished",
    description: "Mirrorless Sony a6400 — fast autofocus and great for vlogging.",
    price: 549,
    originalPrice: 899,
    stock: 4,
    image: "",
  },
  {
    name: "Canon EOS M50",
    brand: "Canon",
    category: "Cameras",
    condition: "new",
    description: "Canon EOS M50 Mark II — beginner-friendly mirrorless camera.",
    price: 499,
    originalPrice: 599,
    stock: 7,
    image: "",
  },

  // Headphones / Earbuds
  {
    name: "Bose QuietComfort Earbuds",
    brand: "Bose",
    category: "Headphones",
    condition: "new",
    description: "Noise cancelling true wireless earbuds with top-tier audio.",
    price: 199,
    originalPrice: 279,
    stock: 12,
    image: "",
  },
  {
    name: "Sony WH-1000XM4",
    brand: "Sony",
    category: "Headphones",
    condition: "refurbished",
    description: "Refurbished Sony over-ear ANC headphones — studio-quality sound.",
    price: 149,
    originalPrice: 349,
    stock: 9,
    image: "",
  },
  {
    name: "Jabra Elite 75t",
    brand: "Jabra",
    category: "Headphones",
    condition: "new",
    description: "True wireless earbuds with great fit and sound.",
    price: 129,
    originalPrice: 179,
    stock: 14,
    image: "https://images.unsplash.com/photo-1593011953131-3a3f7c0a1b6a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=32",
  },
  {
    name: "Beats Studio3",
    brand: "Beats",
    category: "Headphones",
    condition: "refurbished",
    description: "Refurbished Beats over-ear headphones with noise cancellation.",
    price: 119,
    originalPrice: 349,
    stock: 6,
    image: "https://images.unsplash.com/photo-1512499617640-c2f99912f9b6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=33",
  },

  // Laptops
  {
    name: "MacBook Pro 14",
    brand: "Apple",
    category: "Laptops",
    condition: "refurbished",
    description: "MacBook Pro M1 Pro — powerful performance for creators.",
    price: 1299,
    originalPrice: 1999,
    stock: 3,
    image: "",
  },
  {
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    condition: "new",
    description: "Dell XPS 13 — compact ultrabook with great display.",
    price: 999,
    originalPrice: 1199,
    stock: 6,
    image: "",
  },

  // Accessories (mapped to Headphones category to ensure visibility)
  {
    name: "Anker PowerBank 20,000mAh",
    brand: "Anker",
    category: "Accessories",
    condition: "new",
    description: "High-capacity power bank for long travel days.",
    price: 39,
    originalPrice: 59,
    stock: 25,
    image: "",
  },
];

const run = async () => {
  try {
    await mongoose.connect(MONGO);
    console.log("Connected to MongoDB for seeding.");

    const images = {
      "Pixel 8 Pro": "https://images.unsplash.com/photo-1603898037225-5d1d0f3e2d5d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1",
      "iPhone 15 Mini": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2",
      "OnePlus Nord CE": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
      "iPad Air": "https://images.unsplash.com/photo-1587825140408-4dcbf1f0b0f6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4",
      "Galaxy Tab S8": "https://images.unsplash.com/photo-1581276879432-15a6d0e3f0b4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5",
      "Galaxy Watch 6": "https://images.unsplash.com/photo-1516222338252-9f1b3b6f2f6a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6",
      "Apple Watch SE": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7",
      "Sony Alpha a6400": "https://images.unsplash.com/photo-1519183071298-a2962be54d7b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8",
      "Canon EOS M50": "https://images.unsplash.com/photo-1519183071298-a2962be54d7b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9",
      "Bose QuietComfort Earbuds": "https://images.unsplash.com/photo-1585386959984-a4155222c2c3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=10",
      "Sony WH-1000XM4": "https://images.unsplash.com/photo-1594711373584-9f7f1b2b8d3b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=11",
      "MacBook Pro 14": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=12",
      "Dell XPS 13": "https://images.unsplash.com/photo-1541807084-5c52b6b3a5d0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=13",
      "Anker PowerBank 20,000mAh": "https://images.unsplash.com/photo-1585386959984-a4155222c2c3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=14",
      "Pixel 8 Pro": "https://images.unsplash.com/photo-1603898037225-5d1d0f3e2d5d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=15",
    };

    for (const s of samples) {
      const exists = await Product.findOne({ name: s.name });
      const img = images[s.name] || s.image || "";
      if (!exists) {
        s.image = img;
        await Product.create(s);
        console.log(`Inserted: ${s.name}`);
      } else {
        // update image if missing
        if ((!exists.image || exists.image.trim() === "") && img) {
          exists.image = img;
          await exists.save();
          console.log(`Updated image for: ${s.name}`);
        } else {
          console.log(`Skipping (exists): ${s.name}`);
        }
      }
    }

    console.log("Seeding done.");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
