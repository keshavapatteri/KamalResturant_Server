import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../Models/AdminModel.js";
import User from "../models/userModel.js";
import Product from "../Models/ProductModel.js";
import { cloudinaryInstance } from "../Config/cloudinary.js";
import { upload } from '../Config/multer.js';
import Restaurant from "../Models/RestaurantModel.js";
// Admin Signup Controller
export const AdminSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    // Save admin to database
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully." });
    console.log(`Admin registered successfully with email: ${email}`);
  } catch (error) {
    console.error("Error during admin signup:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Admin Login Controller
export const AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });

    // Check if admin exists and compare hashed password
    if (admin && (await bcrypt.compare(password, admin.password))) {
      // Generate and log the token
      const token = generateToken(admin.id);

      res.json({
        _id: admin.id,
        email: admin.email,
        token: token,
        message: "Login successful",
      });

      // Log successful login
      console.log(`Admin logged in successfully with email: ${email}`);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//AdminLogut

export const AdminLogut = async (req,res) => {
    try {
        // Clear the token (if using cookies)
        res.cookie("token", "", {
          httpOnly: true,
          expires: new Date(0), // Expire the token immediately
        });
    
        res.status(200).json({ message: "Admin logged out successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}


//Get All User

export const getAllUser = async (req, res) => {
  try {
    // Get all users from the database
    const users = await User.find({}).select("-password"); // Exclude password for security

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get By Id

export const getById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find user by ID and exclude password
      const user = await User.findById(id).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

//edit by id
  export const editById = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
  
    try {
      // Find user by ID and update fields
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true, runValidators: true }
      ).select("-password"); // Exclude password from response
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

//Delete By id

  export const deleteById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find user by ID and delete
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };



//Product side ----->

//Add Product

  export const createProduct = async (req, res) => {
    try {
      const { title, description, price, category, mrp } = req.body;
  console.log(req.body);
  
      // Validate required fields
      if (!title || !description || !price || !category || !mrp) {
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
    const products = await Product.find();

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


/////// Restuarant Side  =========================.....>


  //Get all

  export const getAllRestaurant = async (req, res) => {
    try {
      // Get all users from the database
      const restaurant = await Restaurant.find({}).select("-password"); // Exclude password for security
  
      if (restaurant.length === 0) {
        return res.status(404).json({ message: "No Restaurant found" });
      }
  
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //Get By Id

  export const getRestuarantById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find product by ID
      const restaurant = await Restaurant.findById(id);
  
      // Check if product exists
      if (!restaurant) {
        return res.status(404).json({ message: "restaurant not found" });
      }
  
      return res.status(200).json({
        message: "restaurant fetched successfully",
        data: restaurant,
      });
    } catch (error) {
      console.error("Error fetching Restaurant by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
