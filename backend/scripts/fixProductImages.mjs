import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/techrevive';

const nameImageMap = [
  {
    keywords: ['iphone', 'iphone 14', 'iphone 15', 'iphone 13'],
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop',
  },
  {
    keywords: ['macbook', 'thinkpad', 'zenbook', 'xps', 'laptop'],
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop',
  },
  {
    keywords: ['galaxy', 'pixel', 'oneplus', 'samsung', 'android'],
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop',
  },
  {
    keywords: ['watch', 'fitbit', 'garmin', 'forerunner', 'venu'],
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop',
  },
  {
    keywords: ['headphone', 'earbud', 'bose', 'beats', 'jabra', 'sony wh', 'quietcomfort'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop',
  },
  {
    keywords: ['ipad', 'tab', 'surface', 'fire hd'],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop',
  },
  {
    keywords: ['canon', 'nikon', 'camera', 'sony alpha', 'eos', 'mirrorless'],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop',
  },
];

const pickImage = (name) => {
  const normalized = String(name || '').toLowerCase();
  const match = nameImageMap.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
  return match ? match.image : null;
};

const legacyFallbackPatterns = [
  'w=500',
  'photo-1592750475338-74b7b21085ab',
  'photo-1517336714739-489689fd1ca8',
  'photo-1610945265064-0e34e5519bbf',
  'photo-1496181133206-80ce9b88a853',
];

const shouldUpdate = (value) => {
  const current = String(value || '').trim();
  if (!current) return true;
  return legacyFallbackPatterns.some((pattern) => current.includes(pattern));
};

const main = async () => {
  await mongoose.connect(uri);
  const products = await Product.find({});
  let updated = 0;

  for (const product of products) {
    const chosenImage = pickImage(product.name) || product.image;
    if (chosenImage && shouldUpdate(product.image)) {
      await Product.updateOne({ _id: product._id }, { $set: { image: chosenImage } });
      updated += 1;
    }
  }

  console.log(`Updated ${updated} product image(s)`);
  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
