import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  street: String,
  city: String,
  state: String,
  postalCode: String,
  
}, { timestamps: true });


const Address = mongoose.model("Address", AddressSchema);
export default Address;