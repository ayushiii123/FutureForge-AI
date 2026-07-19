import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/techrevive';

const productImageMap = {
  'iPhone 14 Pro': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop',
  'MacBook Air M2': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop',
  'Galaxy S23 Ultra': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop',
  'Dell XPS 13': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop',
  'Apple Watch Series 9': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop',
  'Sony WH-1000XM5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop',
  'Canon EOS R10': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop',
  'Samsung Galaxy Tab S9': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop',
  'Bose QuietComfort Earbuds': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop',
  'Garmin Forerunner 255': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop',
  'Nikon Z50': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop',
  'ASUS Zenbook 14': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop',
  'Pixel 8 Pro': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop',
  'iPhone 15 Mini': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&auto=format&fit=crop',
  'OnePlus Nord CE': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop',
  'iPad Air': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop',
  'Galaxy Tab S8': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop',
  'Lenovo Tab P11': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop',
  'Microsoft Surface Go 3': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop',
  'Amazon Fire HD 10': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&auto=format&fit=crop',
  'Galaxy Watch 6': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop',
  'Apple Watch SE': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop',
  'Fitbit Versa 4': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop',
  'Sony Alpha a6400': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop',
  'Canon EOS M50': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop',
  'Bose QuietComfort Earbuds': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop',
  'Sony WH-1000XM4': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop',
  'Jabra Elite 75t': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop',
  'Beats Studio3': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop',
  'MacBook Pro 14': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop',
  'Dell XPS 13': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop',
  'Anker PowerBank 20,000mAh': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&auto=format&fit=crop',
};

const main = async () => {
  await mongoose.connect(uri);
  let updated = 0;

  for (const [name, image] of Object.entries(productImageMap)) {
    const result = await Product.updateMany({ name }, { $set: { image } });
    updated += result.modifiedCount || 0;
  }

  console.log(`Updated ${updated} product image(s)`);
  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
