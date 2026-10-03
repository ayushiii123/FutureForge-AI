import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCog,
  FaCreditCard,
  FaFileAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaCheckCircle,
  FaBell,
  FaMoon,
  FaGlobe,
  FaLock,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Profile = () => {
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // -----------------------------
  // Password
  // -----------------------------
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // -----------------------------
  // Preferences
  // -----------------------------
  const [language, setLanguage] = useState(
    localStorage.getItem("techrevive_language") || "English"
  );

  const [orderNotifications, setOrderNotifications] = useState(
    localStorage.getItem("techrevive_order_notifications") !== "false"
  );

  const [promoNotifications, setPromoNotifications] = useState(
    localStorage.getItem("techrevive_promo_notifications") === "true"
  );

  const [wishlistNotifications, setWishlistNotifications] = useState(
    localStorage.getItem("techrevive_wishlist_notifications") !== "false"
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("techrevive_dark_mode") === "true"
  );

  const [preferencesSaved, setPreferencesSaved] = useState(false);

  // -----------------------------
  // Address
  // -----------------------------
  const initialAddress = {
    fullName: user?.address?.fullName || user?.name || "",
    phone: user?.address?.phone || user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    country: user?.address?.country || "India",
  };

  const [addressForm, setAddressForm] = useState(initialAddress);

  const [savedAddress, setSavedAddress] = useState(
    user?.address?.street ? user.address : null
  );

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");
  const [addressError, setAddressError] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  // -----------------------------
  // Change Password
  // -----------------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordMessage(
        response.data?.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // -----------------------------
  // Save Address
  // -----------------------------
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    setAddressMessage("");
    setAddressError("");

    const requiredFields = [
      "fullName",
      "phone",
      "street",
      "city",
      "state",
      "pincode",
    ];

    const missingField = requiredFields.find(
      (field) => !String(addressForm[field] || "").trim()
    );

    if (missingField) {
      setAddressError("Please fill all address fields.");
      return;
    }

    if (!/^\d{6}$/.test(addressForm.pincode.trim())) {
      setAddressError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setSavingAddress(true);

      const response = await api.put(
        "/user/address",
        addressForm
      );

      const returnedAddress =
        response.data?.user?.address || addressForm;

      setSavedAddress(returnedAddress);

      setAddressMessage(
        response.data?.message ||
          "Address saved successfully."
      );

      setAddressError("");

      setShowAddressForm(false);
    } catch (error) {
      setAddressError(
        error.response?.data?.message ||
          "Failed to save address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // -----------------------------
  // Save Preferences
  // -----------------------------
  const handleSavePreferences = () => {
    localStorage.setItem(
      "techrevive_language",
      language
    );

    localStorage.setItem(
      "techrevive_order_notifications",
      String(orderNotifications)
    );

    localStorage.setItem(
      "techrevive_promo_notifications",
      String(promoNotifications)
    );

    localStorage.setItem(
      "techrevive_wishlist_notifications",
      String(wishlistNotifications)
    );

    localStorage.setItem(
      "techrevive_dark_mode",
      String(darkMode)
    );

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );

    setPreferencesSaved(true);

    setTimeout(() => {
      setPreferencesSaved(false);
    }, 2500);
  };

  // -----------------------------
  // Open Add Address
  // -----------------------------
  const openAddAddress = () => {
    setAddressForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });

    setAddressMessage("");
    setAddressError("");
    setShowAddressForm(true);
  };

  // -----------------------------
  // Open Edit Address
  // -----------------------------
  const openEditAddress = () => {
    setAddressForm({
      fullName:
        savedAddress?.fullName || user?.name || "",
      phone:
        savedAddress?.phone || user?.phone || "",
      street: savedAddress?.street || "",
      city: savedAddress?.city || "",
      state: savedAddress?.state || "",
      pincode: savedAddress?.pincode || "",
      country:
        savedAddress?.country || "India",
    });

    setAddressMessage("");
    setAddressError("");
    setShowAddressForm(true);
  };

  // -----------------------------
  // Sidebar
  // -----------------------------
  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: FaUser,
    },
    {
      id: "orders",
      label: "My Orders",
      icon: FaBoxOpen,
      link: "/my-orders",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: FaHeart,
      link: "/wishlist",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: FaMapMarkerAlt,
    },
    {
      id: "security",
      label: "Security",
      icon: FaShieldAlt,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: FaCog,
    },
    {
      id: "payments",
      label: "Payments",
      icon: FaCreditCard,
    },
    {
      id: "policies",
      label: "Policies",
      icon: FaFileAlt,
    },
    {
      id: "support",
      label: "Help & Support",
      icon: FaQuestionCircle,
    },
  ];

  const policies = [
    {
      id: "terms",
      title: "Terms & Conditions",
      short:
        "Rules and conditions for using TechRevive services and purchasing products.",
      content: [
        {
          heading: "Using TechRevive",
          text:
            "By using TechRevive, you agree to use the platform lawfully and provide accurate information when creating an account or placing an order.",
        },
        {
          heading: "Product Information",
          text:
            "Product descriptions, specifications, prices, availability and images are provided for product discovery and may be updated when required.",
        },
        {
          heading: "User Account",
          text:
            "You are responsible for keeping your account credentials secure and for activity performed through your account.",
        },
        {
          heading: "Orders",
          text:
            "An order is subject to product availability, successful payment where applicable, and confirmation by TechRevive.",
        },
        {
          heading: "Policy Updates",
          text:
            "TechRevive may update its terms, policies or services from time to time.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      short:
        "Information about how account, order and platform data is handled.",
      content: [
        {
          heading: "Information We Collect",
          text:
            "TechRevive may collect information such as name, email address, phone number, delivery details, order information and account activity needed to provide services.",
        },
        {
          heading: "How Information Is Used",
          text:
            "Information may be used for account management, order processing, delivery, customer support, security and improving the shopping experience.",
        },
        {
          heading: "Payment Information",
          text:
            "Payment information should be processed through supported payment services and appropriate security controls.",
        },
        {
          heading: "Data Protection",
          text:
            "Reasonable technical and organizational measures should be used to protect account and transaction-related information.",
        },
      ],
    },
    {
      id: "return",
      title: "Return & Refund Policy",
      short:
        "Information about eligible returns, replacements and refunds.",
      content: [
        {
          heading: "Return Eligibility",
          text:
            "A product may be eligible for return when it meets the return conditions shown for that product or order.",
        },
        {
          heading: "Product Condition",
          text:
            "Returned products should be in the required condition and should include applicable accessories, packaging or other items specified with the order.",
        },
        {
          heading: "Damaged or Incorrect Product",
          text:
            "If a product arrives damaged, defective or different from the ordered item, contact TechRevive support with the relevant order details.",
        },
        {
          heading: "Refund Processing",
          text:
            "Approved refunds are processed through the applicable payment method or refund mechanism associated with the order.",
        },
      ],
    },
    {
      id: "shipping",
      title: "Shipping Policy",
      short:
        "Information about order processing and delivery handling.",
      content: [
        {
          heading: "Order Processing",
          text:
            "Orders are prepared for shipment after the order is successfully confirmed and the product is available.",
        },
        {
          heading: "Delivery",
          text:
            "Estimated delivery information may vary depending on destination, product availability, courier operations and other logistical factors.",
        },
        {
          heading: "Address Accuracy",
          text:
            "Customers are responsible for providing a correct and complete delivery address during checkout.",
        },
        {
          heading: "Order Tracking",
          text:
            "Where tracking is available, tracking information may be provided through the order or shipping system.",
        },
      ],
    },
    {
      id: "payment",
      title: "Payment Policy",
      short:
        "Supported payment methods and payment handling information.",
      content: [
        {
          heading: "Supported Payment Modes",
          text:
            "TechRevive may support UPI, credit/debit cards, net banking and Cash on Delivery where available for the selected order.",
        },
        {
          heading: "Payment Confirmation",
          text:
            "An order may require successful payment confirmation before it is processed for shipment.",
        },
        {
          heading: "Failed Payments",
          text:
            "If a payment fails or is not confirmed, the order may remain incomplete until valid payment is received.",
        },
        {
          heading: "Refunds",
          text:
            "Where a refund is approved, the amount is processed according to the applicable payment method and refund procedure.",
        },
      ],
    },
  ];

  // -----------------------------
  // Content renderer
  // -----------------------------
  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return (
          <div className="bg-white rounded-2xl p-8 border border-violet-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              My Orders
            </h2>

            <p className="text-gray-500 mt-2">
              View and track all your orders.
            </p>

            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 mt-6 bg-[#5b3df5] text-white px-5 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
            >
              View Orders
              <FaChevronRight />
            </Link>
          </div>
        );

      case "wishlist":
        return (
          <div className="bg-white rounded-2xl p-8 border border-violet-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Wishlist
            </h2>

            <p className="text-gray-500 mt-2">
              Products you have saved for later.
            </p>

            <Link
              to="/wishlist"
              className="inline-flex items-center gap-2 mt-6 bg-[#5b3df5] text-white px-5 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
            >
              View Wishlist
              <FaHeart />
            </Link>
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Saved Addresses
                </h2>

                <p className="text-gray-500 mt-1">
                  Manage your delivery address.
                </p>
              </div>

              {!showAddressForm && (
                <button
                  type="button"
                  onClick={openAddAddress}
                  className="bg-[#5b3df5] text-white px-5 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {!showAddressForm && savedAddress?.street ? (
              <div className="bg-white border border-violet-100 rounded-2xl p-7 shadow-sm">

                <div className="flex items-start justify-between gap-5">

                  <div className="flex gap-4">

                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <FaMapMarkerAlt className="text-[#5b3df5]" />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {savedAddress.fullName ||
                          user.name}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        {savedAddress.street}
                      </p>

                      <p className="text-gray-600">
                        {savedAddress.city},{" "}
                        {savedAddress.state} -{" "}
                        {savedAddress.pincode}
                      </p>

                      <p className="text-gray-600">
                        {savedAddress.country ||
                          "India"}
                      </p>

                      <p className="text-gray-500 text-sm mt-2">
                        Phone:{" "}
                        {savedAddress.phone ||
                          user.phone ||
                          "Not Added"}
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={openEditAddress}
                    className="text-[#5b3df5] font-semibold hover:underline"
                  >
                    Edit
                  </button>

                </div>

              </div>
            ) : !showAddressForm ? (
              <div className="bg-white border border-violet-100 rounded-2xl p-8 shadow-sm text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-xl text-[#5b3df5]" />
                </div>

                <h3 className="text-lg font-bold mt-5 text-slate-800">
                  No saved addresses
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Add your delivery address for faster checkout.
                </p>

              </div>
            ) : null}

            {showAddressForm && (
              <div className="bg-white border border-violet-100 rounded-2xl p-7 shadow-sm">

                <div className="flex items-center justify-between mb-7">

                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {savedAddress?.street
                        ? "Edit Address"
                        : "Add New Address"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Enter your delivery details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setAddressMessage("");
                      setAddressError("");
                    }}
                    className="text-gray-500 hover:text-red-500 font-semibold"
                  >
                    Cancel
                  </button>

                </div>

                <form
                  onSubmit={handleSaveAddress}
                  className="grid md:grid-cols-2 gap-5"
                >

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Street / House Address
                    </label>

                    <textarea
                      rows="3"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          street: e.target.value,
                        })
                      }
                      placeholder="House number, street, locality"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          city: e.target.value,
                        })
                      }
                      placeholder="Enter city"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          state: e.target.value,
                        })
                      }
                      placeholder="Enter state"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      value={addressForm.pincode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          pincode: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        })
                      }
                      placeholder="6-digit pincode"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Country
                    </label>

                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          country: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  {addressError && (
                    <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {addressError}
                    </div>
                  )}

                  {addressMessage && (
                    <div className="md:col-span-2 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <FaCheckCircle />
                      {addressMessage}
                    </div>
                  )}

                  <div className="md:col-span-2 flex gap-3">

                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="bg-[#5b3df5] text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60 transition"
                    >
                      {savingAddress
                        ? "Saving Address..."
                        : "Save Address"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressError("");
                        setAddressMessage("");
                      }}
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>

                  </div>

                </form>
              </div>
            )}

          </div>
        );

      case "security":
        return (
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Security
              </h2>

              <p className="text-gray-500 mt-1">
                Protect your account and manage your password.
              </p>
            </div>

            <div className="bg-white border border-violet-100 rounded-2xl p-8 shadow-sm">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                    <FaLock className="text-[#5b3df5]" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Password
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Update your account password.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(
                      !showPasswordForm
                    );
                    setPasswordMessage("");
                    setPasswordError("");
                  }}
                  className="bg-[#5b3df5] text-white px-5 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
                >
                  {showPasswordForm
                    ? "Cancel"
                    : "Change Password"}
                </button>

              </div>

              {showPasswordForm && (
                <form
                  onSubmit={handleChangePassword}
                  className="mt-7 bg-violet-50 rounded-2xl p-6 space-y-4"
                >

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current Password
                    </label>

                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      placeholder="Enter current password"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Enter new password"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
                      required
                    />
                  </div>

                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                      {passwordMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="bg-[#5b3df5] text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60 transition"
                  >
                    {changingPassword
                      ? "Changing Password..."
                      : "Update Password"}
                  </button>

                </form>
              )}

            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Preferences
              </h2>

              <p className="text-gray-500 mt-1">
                Personalize your TechRevive experience.
              </p>
            </div>

            <div className="bg-white border border-violet-100 rounded-2xl p-7 shadow-sm space-y-7">

              {/* Language */}
              <div className="flex items-center justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                    <FaGlobe className="text-[#5b3df5]" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Language
                    </h3>

                    <p className="text-sm text-gray-500">
                      Choose your preferred language.
                    </p>
                  </div>

                </div>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  className="border border-gray-300 rounded-xl px-4 py-2 outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>

              </div>

              {/* Notifications */}
              <div className="border-t pt-6">

                <h3 className="font-bold text-slate-800 mb-5">
                  Notifications
                </h3>

                <div className="space-y-4">

                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-800">
                        Order Updates
                      </p>

                      <p className="text-sm text-gray-500">
                        Get updates about your orders.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={orderNotifications}
                      onChange={(e) =>
                        setOrderNotifications(
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 accent-violet-600"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-800">
                        Promotional Offers
                      </p>

                      <p className="text-sm text-gray-500">
                        Receive offers and new product alerts.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={promoNotifications}
                      onChange={(e) =>
                        setPromoNotifications(
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 accent-violet-600"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-800">
                        Wishlist Alerts
                      </p>

                      <p className="text-sm text-gray-500">
                        Get alerts about saved products.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={wishlistNotifications}
                      onChange={(e) =>
                        setWishlistNotifications(
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 accent-violet-600"
                    />
                  </label>

                </div>
              </div>

              {/* Dark mode */}
              <div className="border-t pt-6">

                <div className="flex items-center justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                      <FaMoon className="text-[#5b3df5]" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        Dark Mode
                      </h3>

                      <p className="text-sm text-gray-500">
                        Use a darker appearance for the interface.
                      </p>
                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) =>
                      setDarkMode(e.target.checked)
                    }
                    className="w-5 h-5 accent-violet-600"
                  />

                </div>

              </div>

              <div className="flex items-center gap-4">

                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="bg-[#5b3df5] text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
                >
                  Save Preferences
                </button>

                {preferencesSaved && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <FaCheckCircle />
                    Preferences saved
                  </div>
                )}

              </div>

            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Payments
              </h2>

              <p className="text-gray-500 mt-1">
                Available payment methods on TechRevive.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {[
                "UPI",
                "Credit / Debit Card",
                "Net Banking",
                "Cash on Delivery",
              ].map((method) => (
                <div
                  key={method}
                  className="bg-white rounded-2xl border border-violet-100 p-6 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                        <FaCreditCard className="text-[#5b3df5]" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-800">
                          {method}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Available at checkout
                        </p>
                      </div>

                    </div>

                    <FaCheckCircle className="text-green-500" />
                  </div>

                </div>
              ))}

            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">

              <h3 className="font-bold text-slate-800">
                Payment Security
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Payment details are handled securely during checkout.
              </p>

            </div>

          </div>
        );

      case "policies": {
        if (selectedPolicy) {
          const policy = policies.find(
            (item) => item.id === selectedPolicy
          );

          if (!policy) {
            return null;
          }

          return (
            <div className="space-y-6">

              <button
                type="button"
                onClick={() =>
                  setSelectedPolicy(null)
                }
                className="inline-flex items-center gap-2 text-[#5b3df5] font-semibold hover:underline"
              >
                ← Back to Policies
              </button>

              <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden">

                <div className="bg-[linear-gradient(135deg,_#5b3df5_0%,_#8b5cf6_100%)] p-7 text-white">

                  <p className="text-violet-100 text-sm font-medium">
                    TechRevive Policies
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {policy.title}
                  </h2>

                  <p className="text-violet-100 mt-2">
                    {policy.short}
                  </p>

                </div>

                <div className="p-7 md:p-9 space-y-7">

                  {policy.content.map((section) => (
                    <div key={section.heading}>
                      <h3 className="text-lg font-bold text-slate-800">
                        {section.heading}
                      </h3>

                      <p className="text-gray-600 leading-7 mt-2">
                        {section.text}
                      </p>
                    </div>
                  ))}

                </div>

              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Policies & Legal
              </h2>

              <p className="text-gray-500 mt-1">
                Important information about using TechRevive.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white border border-violet-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >

                  <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                    <FaFileAlt className="text-[#5b3df5]" />
                  </div>

                  <h3 className="font-bold text-slate-800 mt-5">
                    {policy.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    {policy.short}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPolicy(policy.id)
                    }
                    className="mt-4 text-[#5b3df5] font-semibold text-sm hover:underline"
                  >
                    Read Policy →
                  </button>

                </div>
              ))}

            </div>

          </div>
        );
      }

      case "support":
        return (
          <div className="space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Help & Support
              </h2>

              <p className="text-gray-500 mt-1">
                Need help? We are here for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-white border border-violet-100 rounded-2xl p-7 shadow-sm">

                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <FaQuestionCircle className="text-xl text-[#5b3df5]" />
                </div>

                <h3 className="font-bold text-slate-800 mt-5">
                  FAQs
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Find answers to common questions about orders,
                  returns and payments.
                </p>

                <button
                  type="button"
                  className="mt-5 text-[#5b3df5] font-semibold"
                >
                  View FAQs →
                </button>

              </div>

              <div className="bg-white border border-violet-100 rounded-2xl p-7 shadow-sm">

                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <FaBell className="text-xl text-[#5b3df5]" />
                </div>

                <h3 className="font-bold text-slate-800 mt-5">
                  Contact Support
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Get in touch with the TechRevive support team.
                </p>

                <button
                  type="button"
                  className="mt-5 text-[#5b3df5] font-semibold"
                >
                  Contact Us →
                </button>

              </div>

            </div>

          </div>
        );

      default:
        return (
          <div className="space-y-6">

            <div className="bg-[linear-gradient(135deg,_#5b3df5_0%,_#8b5cf6_100%)] rounded-2xl p-7 text-white shadow-lg">

              <p className="text-violet-100 text-sm">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold mt-1">
                {user.name}
              </h2>

              <p className="text-violet-100 mt-2">
                Manage your account, orders and preferences from one place.
              </p>

            </div>

            <div className="bg-white rounded-2xl p-7 border border-violet-100 shadow-sm">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Profile Information
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Your basic account details
                  </p>
                </div>

                <FaUser className="text-2xl text-violet-500" />

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div className="bg-slate-50 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Full Name
                  </p>

                  <p className="font-semibold text-slate-800 mt-2">
                    {user.name}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <p className="font-semibold text-slate-800 mt-2 break-all">
                    {user.email}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <p className="font-semibold text-slate-800 mt-2">
                    {user.phone || "Not Added"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Account Role
                  </p>

                  <p className="font-semibold text-slate-800 mt-2 capitalize">
                    {user.role || "User"}
                  </p>
                </div>

              </div>

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Quick Access
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection("security")
                  }
                  className="text-left bg-white p-5 rounded-2xl border border-violet-100 shadow-sm hover:shadow-md transition"
                >
                  <FaShieldAlt className="text-xl text-[#5b3df5]" />

                  <h3 className="font-bold text-slate-800 mt-4">
                    Security
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Change your password
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection("preferences")
                  }
                  className="text-left bg-white p-5 rounded-2xl border border-violet-100 shadow-sm hover:shadow-md transition"
                >
                  <FaCog className="text-xl text-[#5b3df5]" />

                  <h3 className="font-bold text-slate-800 mt-4">
                    Preferences
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Language and notifications
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection("payments")
                  }
                  className="text-left bg-white p-5 rounded-2xl border border-violet-100 shadow-sm hover:shadow-md transition"
                >
                  <FaCreditCard className="text-xl text-[#5b3df5]" />

                  <h3 className="font-bold text-slate-800 mt-4">
                    Payments
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Supported payment modes
                  </p>
                </button>

              </div>
            </div>

          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-5 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h1 className="text-3xl font-bold text-slate-800">
            Please Login First
          </h1>

          <p className="text-gray-500 mt-3">
            Login to access your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <p className="text-sm font-semibold text-[#5b3df5] uppercase tracking-wider">
            TechRevive Account
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
            My Account
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your profile, security and preferences.
          </p>

        </div>

        <div className="grid lg:grid-cols-[270px_1fr] gap-6">

          {/* Sidebar */}
          <aside className="bg-white rounded-2xl border border-violet-100 shadow-sm p-4 h-fit">

            <div className="bg-violet-50 rounded-2xl p-4 mb-4">

              <div className="flex items-center gap-3">

                <img
                  src={
                    user.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}&background=5b3df5&color=fff&size=128`
                  }
                  alt={user.name || "Profile"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />

                <div className="min-w-0">

                  <p className="font-bold text-slate-800 truncate">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-1">

              {menuItems.map((item) => {

                const Icon = item.icon;

                if (item.link) {
                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 hover:bg-violet-50 hover:text-[#5b3df5] transition"
                    >
                      <span className="flex items-center gap-3">
                        <Icon />
                        {item.label}
                      </span>

                      <FaChevronRight className="text-xs opacity-50" />
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setSelectedPolicy(null);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                      activeSection === item.id
                        ? "bg-[#5b3df5] text-white shadow-md"
                        : "text-slate-700 hover:bg-violet-50 hover:text-[#5b3df5]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon />
                      {item.label}
                    </span>

                    <FaChevronRight className="text-xs opacity-60" />
                  </button>
                );
              })}

            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-semibold"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>

          </aside>

          {/* Main Content */}
          <main>
            {renderContent()}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Profile;