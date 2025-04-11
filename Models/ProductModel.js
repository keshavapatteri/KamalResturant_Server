import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    restaurantId : {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Restaurant"
              },



    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    mrp: {
      type: Number,
      required: [true, "Stock is required"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
