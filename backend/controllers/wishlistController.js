import Wishlist from "../models/Wishlist.js";

// Add Wishlist
export const addWishlist = async (req, res) => {
  try {

    const exists = await Wishlist.findOne({
      user: req.user.id,
      product: req.body.product,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already in Wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user.id,
      product: req.body.product,
    });

    res.status(201).json({
      success: true,
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Remove Wishlist
export const removeWishlist = async (req, res) => {
  try {

    await Wishlist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Removed Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};