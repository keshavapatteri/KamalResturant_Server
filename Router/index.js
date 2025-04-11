import express from 'express'
import UserRouter from './UserRouter.js';
import AdminRouter from './adminRouter.js';
import RestaurantRouter from './RestaurantRouter.js';
import ProductRouter from './ProductRouter.js';
import ReviewRouter from './ReviewRouter.js';
import CartRouter from './CartRouter.js';
import AddressRouter from './AddressRouter.js';


const v1Router = express.Router();

v1Router.use('/user',UserRouter)

v1Router.use('/admin',AdminRouter)

v1Router.use('/restaurant',RestaurantRouter)

v1Router.use('/Product',ProductRouter)

v1Router.use('/Review',ReviewRouter)

v1Router.use('/Cart',CartRouter)

v1Router.use('/Address',AddressRouter)



export default v1Router; 