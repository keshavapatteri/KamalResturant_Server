 import express from 'express'
import { addToCart, clearCart, getAllCarts, getCartByUserId, removeCartItem, updateCartItem } from '../Controller/CartController.js';
import { verifyUserToken } from '../Middleware/AuthMiddleware.js';






 const CartRouter = express.Router();

CartRouter.post("/add",verifyUserToken,addToCart);
CartRouter.get("/productuserid",verifyUserToken, getCartByUserId);
CartRouter.put("/update",verifyUserToken,updateCartItem);
CartRouter.delete("/remove",verifyUserToken, removeCartItem);
CartRouter.delete("/clear/:userId", clearCart);

CartRouter.get("/getAllCarts",getAllCarts);




//get user id via cart


 export default CartRouter; 