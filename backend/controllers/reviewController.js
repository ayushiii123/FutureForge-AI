import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const productId = req.body.productId || req.params.id;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const purchased = await Order.findOne({
      user: req.user.id,
      "items.product": productId,
      orderStatus: "Delivered",
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: "You can review only purchased and delivered products.",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    product.reviews = product.reviews || [];
    product.reviews.push(review._id);

    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review Added Successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product Reviews
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });

    if (product) {
      product.numReviews = reviews.length;
      product.rating = reviews.length
        ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        : 0;
      product.reviews = reviews.map((r) => r._id);
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });

    if (product) {
      product.numReviews = reviews.length;
      product.rating = reviews.length
        ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        : 0;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Review Updated Successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};