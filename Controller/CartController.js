
import Cart from "../Models/CartModel.js";
import Product from "../Models/ProductModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
console.log(req.user);
console.log(req.body);

const userId = req.user.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const pricePerDay = product.priceperday;
    const totalCost = pricePerDay * quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        userId,
        Product: [{ ProductId: productId, quantity, pricePerDay, totalCost }],
        totalPrice: totalCost,
      });
    } else {
      // Check if product already exists in the cart
      const existingProductIndex = cart.Product.findIndex(
        (item) => item.ProductId.toString() === productId
      );

      if (existingProductIndex > -1) {
        // Update quantity and totalCost if product exists
        cart.Product[existingProductIndex].quantity += quantity;
        cart.Product[existingProductIndex].totalCost += totalCost;
      } else {
        // Add new product to cart
        cart.Product.push({ ProductId: productId, quantity, pricePerDay, totalCost });
      }

      // Update total price of the cart
      cart.totalPrice += totalCost;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart by userId
export const getCartByUserId = async (req, res) => {
  
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate("Product.ProductId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity of product in cart
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  console.log(req.body);

  const userId = req.user.id;

  try {
    // Find cart by its ID
    const cart = await Cart.findOne({userId});
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    // Find product index in the cart
    const itemIndex = cart.Product.findIndex(
      (item) => item.ProductId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart!" });
    }

    const item = cart.Product[itemIndex];

    // Calculate price difference
    const priceDifference = item.pricePerDay * (quantity - item.quantity);
    item.quantity = quantity;
    item.totalCost = item.pricePerDay * quantity;

    // Update total price of the cart
    cart.totalPrice += priceDifference;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // assuming you're using JWT middleware to get user

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }

    const itemIndex = cart.Product.findIndex(
      (item) => item.ProductId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart!" });
    }

    const removedItem = cart.Product[itemIndex];

    // Subtract totalCost of removed item from cart total
    cart.totalPrice -= removedItem.totalCost;

    // Remove the item from the Product array
    cart.Product.splice(itemIndex, 1);

    // If the cart is now empty, delete it completely
    if (cart.Product.length === 0) {
      await Cart.deleteOne({ userId });
      return res.status(200).json({ message: "Cart is empty now!" });
    } else {
      await cart.save();
      res.status(200).json(cart);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear the cart
export const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: "Cart cleared successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllCarts = async (req, res) => {
 
  try {
    const carts = await Cart.find().populate("userId").populate("Product.ProductId");
    if (!carts || carts.length === 0) {
      return res.status(404).json({ message: "No carts found!" });
    }
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
