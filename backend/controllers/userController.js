import User from "../models/User.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// Update Shipping Address
export const updateAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.address = {
      fullName: fullName?.trim() || "",
      phone: phone?.trim() || "",
      street: street?.trim() || "",
      city: city?.trim() || "",
      state: state?.trim() || "",
      pincode: pincode?.trim() || "",
      country: country?.trim() || "India",
    };

    await user.save();

    const safeUser = await User.findById(req.user.id).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Address saved successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};