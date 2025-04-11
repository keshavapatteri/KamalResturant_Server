
import express from 'express'
import {AdminLogin, AdminLogut, AdminSignup, createProduct, deleteById, deleteProduct, editById, editProduct, getAllProducts, getAllRestaurant, getAllUser, getById, getProductById, getRestuarantById} from '../Controller/adminController.js';
import { upload } from '../Config/multer.js';




/////// Admin Side  =========================......>
const AdminRouter = express.Router();

AdminRouter.use('/register',AdminSignup)

//AdminLogin
AdminRouter.use('/adminlogin',AdminLogin)

//AdminLogout
AdminRouter.use('/adminlogout',AdminLogut)

/////// User Side  =========================......>

//ALL USER
AdminRouter.use('/AllUser',getAllUser)

// USER By Id

AdminRouter.use('/user/:id',getById)

//Edit By User
AdminRouter.use('/edituser/:id',editById)

//Edit By Id
AdminRouter.use('/delete/:id',deleteById)


/////// Product Side  =========================.....>

// Add Product 
AdminRouter.post('/addProduct',upload.single("image"),createProduct)

// Edit Product
AdminRouter.put("/edit/:id",upload.single("image"),editProduct)              

// Delete Product
AdminRouter.delete("/deleteProduct/:id", deleteProduct);

// GetAll   Products
AdminRouter.get("/getAllProducts", getAllProducts);

//Get By Id
AdminRouter.get("/getProductById/:id",getProductById);


/////// Restuarant Side  =========================.....>

AdminRouter.get('/allRestaurant',getAllRestaurant)

AdminRouter.get('/RestuarantById/:id',getRestuarantById)







export default AdminRouter; 