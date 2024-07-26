const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cloudinaryImageId: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  cuisines: {
    type: [String],
    required: true,
  },
  avgRating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  totalRatingsString: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: [String],
    required: true,
  },
});

const Recipes = mongoose.model("Recipes", restaurantSchema);

module.exports = Recipes;
