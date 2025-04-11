import Address from "../Models/AddressModel";


export const createAddress = async (req, res) => {
  try {
    const { cartId, userId, street, city, state, postalCode } = req.body;

    const newAddress = new Address({
      cartId,
      userId,
      street,
      city,
      state,
      postalCode,
      
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address saved successfully', data: newAddress });
  } catch (err) {
    res.status(500).json({ message: 'Error saving address', error: err.message });
  }
};
