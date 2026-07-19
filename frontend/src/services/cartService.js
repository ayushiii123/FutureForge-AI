// Get Cart
export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

// Save Cart
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Add Product
export const addToCart = (product) => {
  const cart = getCart();

  const existing = cart.find(
    (item) => item._id === product._id
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);
};

// Remove Product
export const removeFromCart = (id) => {
  const cart = getCart().filter(
    (item) => item._id !== id
  );

  saveCart(cart);
};

// Increase Quantity
export const increaseQty = (id) => {
  const cart = getCart();

  cart.forEach((item) => {
    if (item._id === id) {
      item.quantity++;
    }
  });

  saveCart(cart);
};

// Decrease Quantity
export const decreaseQty = (id) => {
  const cart = getCart();

  cart.forEach((item) => {
    if (item._id === id && item.quantity > 1) {
      item.quantity--;
    }
  });

  saveCart(cart);
};

// Clear Cart
export const clearCart = () => {
  localStorage.removeItem("cart");
};

// Total Items
export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
};

// Total Price
export const getCartTotal = () => {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};