import mongoose from "mongoose";



const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      enum: ["new", "refurbished"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
reviews: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
],

numReviews: {
  type: Number,
  default: 0,
},
    numReviews: {
      type: Number,
      default: 0,
    },

   
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);