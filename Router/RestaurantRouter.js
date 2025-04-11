import express from 'express'
import { getAllRestaurant, getRestuarantById, logoutRestaurant, Restaurantlogin, RestaurantSignup } from '../Controller/RestaurantController.js';



const RestaurantRouter = express.Router();

RestaurantRouter.post('/Restaurantregister',RestaurantSignup)

RestaurantRouter.post('/Restaurantlogin',Restaurantlogin)



RestaurantRouter.post('/Restaurantlogout',logoutRestaurant)



RestaurantRouter.get('/allRestaurant',getAllRestaurant)

RestaurantRouter.get('/RestuarantById/:id',getRestuarantById)


//Pending add Product......



export default RestaurantRouter; 