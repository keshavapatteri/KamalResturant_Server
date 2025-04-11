 import express from 'express'
import { createReview, deleteReview, getAllReviews, getReviewById, updateReview } from '../Controller/ReviewController.js';



const ReviewRouter = express.Router();



// Create a new review
ReviewRouter.post("/createReview", createReview);

// Get all reviews
ReviewRouter.get("/getallReview", getAllReviews);

// Get a review by ID
ReviewRouter.get("/byId/:id", getReviewById);

// Update a review by ID
ReviewRouter.put("/editReview/:id", updateReview);

// Delete a review by ID
ReviewRouter.delete("/deleteByReview/:id", deleteReview);


 export default ReviewRouter; 