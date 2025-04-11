import Review from "../Models/ReviewModel.js";


// Create a new review
export const createReview = async (req, res) => {
  try {
    const { userId, username, reviewText, rating } = req.body;
    const newReview = new Review({
      userId,
      username,
      reviewText,
      rating,
    });
    await newReview.save();
    res.status(201).json({ message: "Review added successfully", newReview });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Get a review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error });
  }
};

// Update a review by ID
export const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

// Delete a review by ID
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};
