const reviewService = require("../services/reviewService");

exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    // Model-er review object structure onujayi data
    const reviewPayload = {
      user: req.user._id, // Auth middleware theke
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const updatedProduct = await reviewService.addProductReviewService(
      req.params.id,
      reviewPayload,
    );

    res.status(201).json({
      success: true,
      status: 201,
      message: "Review added successfully",
      data: {
        averageRating: updatedProduct.ratings.average,
        reviewCount: updatedProduct.ratings.count,
        reviews: updatedProduct.reviews,
      },
    });
  } catch (error) {
    // Custom error handle (e.g. Already reviewed)
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
