import express from 'express'
import { upload } from '../Config/multer.js';
import { createProduct, deleteProduct, editProduct, getAllProducts, getProductById } from '../Controller/ProductController.js';




const ProductRouter = express.Router();



// Add Product 
ProductRouter.post('/addfood',upload.single("image"),createProduct)

// Edit Product
ProductRouter.put("/editfood/:id",upload.single("image"),editProduct)

// Delete Product
ProductRouter.delete("/deletefood/:id", deleteProduct);

// GetAll   Products
ProductRouter.get("/getAllfood", getAllProducts);

//Get By Id
ProductRouter.get("/getfoodById/:id",getProductById);



export default ProductRouter; 