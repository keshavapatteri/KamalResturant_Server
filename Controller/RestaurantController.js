import Restaurant from "../Models/RestaurantModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

  // Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: "Restaurant" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};





// Admin Signup Controller
export const RestaurantSignup = async (req, res) => {
    const { email, password,restaurantname,address,workingtime,phonenumber} = req.body;
  console.log(req.body);
  
    try {
      // Check if all fields are provided
      if (!email || !password || !restaurantname || ! address || !workingtime || ! phonenumber) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Check if Restaurant already exists
      const existingRestaurant = await Restaurant.findOne({ email });
      if (existingRestaurant) {
        return res.status(400).json({ message: "Restaurant already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new Restaurant
      const newRestaurant = new Restaurant({
        email,
        password: hashedPassword,
        restaurantname,address,workingtime,phonenumber
      });
  
      // Save Restaurant to database
      await newRestaurant.save();
  
      res.status(201).json({ message: "Restaurant registered successfully." });
      console.log(`Restaurant registered successfully with email: ${email}`);
    } catch (error) {
      console.error("Error during Restaurant signup:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

   //Login

  export const Restaurantlogin = async (req, res) => {
    const { email, password } = req.body;
  console.log(req.body);
  
    try {
      // Check if the user exists
      const restaurant = await Restaurant.findOne({ email });
  
      // Check if Restaurant exists and compare plain text password
      
      const passwordcompare = await bcrypt.compare(password,restaurant.password)
if(!passwordcompare) return res.status(400).json({msg:"Invalid credentials"});
    
        // Generate and log the token
        const token = generateToken(restaurant.id);
  
        res.json({
          _id: restaurant.id,
          name: restaurant.name,
          email: restaurant.email,
          token: token,
          message: "Login successful",
        });
      
        res.status(401).json({ message: "Invalid email or password" });
      
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
      
    }
  };
  
  //Logout
  
  export const logoutRestaurant = async (req, res) => {
    try {
      // Clear the token (if using cookies)
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // Expire the token immediately
      });
  
      res.status(200).json({ message: "Restaurant logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

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



  