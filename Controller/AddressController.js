import Address from "../Models/AddressModel.js";
import Cart from "../Models/CartModel.js";

// export const createAddress = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { formData, cartId } = req.body;

//     const { street, city, state, postalCode, phoneNumber } = formData;

//     // Fetch the cart details to extract restaurantId
//     const cart = await Cart.findById(cartId).populate('Product.restaurantId');

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     // Assuming you want to save the first restaurantId from the cart's products
//     const restaurantIds = [...new Set(cart.Product.map(item => item.restaurantId._id))];

//     const restaurantId = cart.Product.length > 0 ? cart.Product[0].restaurantId._id : null;

//     const newAddress = new Address({
//       userId,
//       cartId,
//       restaurantId,  // Save the restaurantId in the Address
//       street,
//       city,
//       state,
//       postalCode,
//       phoneNumber,
//     });

//     await newAddress.save();
// console.log(`dfdgdsgaDGGAfg`,restaurantId);

//     // Populate the Address with Product and restaurantId information
//     const populatedAddress = await Address.findById(newAddress._id)
//       .populate({
//         path: 'cartId',
//         populate: [
//           {
//             path: 'Product.ProductId',
//             model: 'Product',
//           },
//           {
//             path: 'Product.restaurantId',
//             model: 'Restaurant',
//           },
//         ],
//       });

//     // Logging individual Product objects
//     if (populatedAddress.cartId && populatedAddress.cartId.Product) {
//       populatedAddress.cartId.Product.forEach((product, index) => {
//         console.log(`Product ${index + 1}:`, product);
//         console.log('ProductId:', product.ProductId);
//         console.log('RestaurantId:', product.restaurantId);
//         console.log('Quantity:', product.quantity);
//         console.log('PricePerDay:', product.pricePerDay);
//         console.log('TotalCost:', product.totalCost);
//       });
//     }

//     res.status(201).json({
//       message: 'Address saved successfully',
//       data: populatedAddress,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error saving address', error: err.message });
//   }
// };



export const createAddress = async (req, res) => {
  try {
    const {  street, city, state, postalCode, phoneNumber } = req.body;
    const userId = req.user.id;
    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate('Product.restaurantId');
    if (!cart || cart.Product.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or not found' });
    }

    // Get all unique restaurant IDs from the cart
    const restaurantIds = [...new Set(cart.Product.map(item => item.restaurantId._id.toString()))];

    // Save the new address with all restaurant IDs
    const newAddress = new Address({
      userId,
      cartId: cart._id,
      restaurantId: restaurantIds, // storing multiple IDs
      street,
      city,
      state,
      postalCode,
      phoneNumber,
    });

    await newAddress.save();

    res.status(201).json({
      message: 'Address created successfully',
      address: newAddress,
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Server error while creating address' });
  }
};


