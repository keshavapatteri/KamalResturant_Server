
import { cloudinaryInstance } from "../Config/cloudinary.js";
import Product from "../Models/ProductModel.js";
import multer from "multer";
//Product side ----->

//Add Product

export const createProduct = async (req, res) => {
    try {
      const { title, description, price, category, mrp, restaurantId } = req.body;
  console.log(req.body);
  
      // Validate required fields
      if (!title || !description || !price || !category || !mrp || ! restaurantId) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if image file is uploaded
      let imageUrl = "";
      if (req.file) {
        console.log("Uploading Image to Cloudinary...");
        const result = await cloudinaryInstance.uploader.upload(req.file.path, {
          folder: "products", // Upload to "products" folder
        });
        imageUrl = result.secure_url; // Store the uploaded image URL
      }
  
      // Create and save new product
      const newProduct = new Product({
        restaurantId,
        title,
        description,
        price,
        category,
        mrp,
        image: imageUrl,
      });
  
      await newProduct.save();
  
      return res.status(201).json({
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

 //Edit Product

  export const editProduct = async (req, res) => {
    try {
      const { id } = req.params; // Get product ID from URL params
      const { title, description, price, category, mrp } = req.body;
  
      // Find product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Check if a new image is uploaded
      let imageUrl = product.image;
      if (req.file) {
        console.log("Uploading new image to Cloudinary...");
        // Delete the old image if available
        if (product.image) {
          const publicId = product.image
            .split("/")
            .pop()
            .split(".")[0]; // Extract public ID from image URL
          await cloudinaryInstance.uploader.destroy(`products/${publicId}`);
        }
        // Upload new image
        const result = await cloudinaryInstance.uploader.upload(req.file.path, {
          folder: "products",
        });
        imageUrl = result.secure_url;
      }
  
      // Update product fields
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.mrp = mrp || product.mrp;
      product.image = imageUrl;
  
      // Save updated product
      await product.save();
  
      return res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
//Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete product by ID
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated image from Cloudinary if available
    if (product.image) {
      const publicId = product.image
        .split("/")
        .pop()
        .split(".")[0]; // Extract public ID from image URL
      await cloudinaryInstance.uploader.destroy(`products/${publicId}`);
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get All Product

export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find().populate('restaurantId');

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get Product By Id

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



