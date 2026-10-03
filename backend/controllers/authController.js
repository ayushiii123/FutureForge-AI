
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


// ===============================
// Nodemailer Configuration
// ===============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // OTP valid for 5 minutes
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

   await transporter.sendMail({
  from: `"TechRevive AI" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "TechRevive AI - Email Verification OTP",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">

      <h2 style="color: #4f46e5;">
        Welcome to TechRevive AI!
      </h2>

      <p style="font-size: 16px; color: #374151;">
        Hi <strong>${name}</strong>,
      </p>

      <p style="color: #4b5563;">
        Thank you for registering with TechRevive AI.
        Use the OTP below to verify your email address:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="
          display: inline-block;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          padding: 15px 25px;
          border-radius: 10px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color: #6b7280;">
        This OTP is valid for <strong>5 minutes</strong>.
      </p>

      <p style="color: #6b7280;">
        If you did not create this account, you can safely ignore this email.
      </p>

      <hr />

      <p style="font-size: 13px; color: #9ca3af;">
        © 2026 TechRevive AI. All rights reserved.
      </p>

    </div>
  `,
});

console.log(`OTP email sent successfully to ${email}`);

return res.status(201).json({

      success: true,
      message: "Registration successful. OTP generated.",
      requiresVerification: true,
      userId: user._id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }



if (new Date() > user.otpExpiresAt) {


  return res.status(400).json({
    success: false,
    message: "OTP has expired. Please request a new OTP.",
  });
}


    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = "";
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const newOTP = generateOTP();
    const newOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = newOTP;
    user.otpExpiresAt = newOtpExpiresAt;

    await user.save();

    await transporter.sendMail({
      from: `"TechRevive AI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "TechRevive AI - New Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">

          <h2 style="color: #4f46e5;">
            TechRevive AI
          </h2>

          <p>Hi <strong>${user.name}</strong>,</p>

          <p>
            Here is your new OTP for email verification:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="
              display: inline-block;
              background: #eef2ff;
              color: #4f46e5;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 15px 25px;
              border-radius: 10px;
            ">
              ${newOTP}
            </span>
          </div>

          <p style="color: #6b7280;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p style="color: #6b7280;">
            If you did not request this OTP, you can safely ignore this email.
          </p>

        </div>
      `,
    });

    console.log(`New OTP sent successfully to ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("wishlist");

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

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
