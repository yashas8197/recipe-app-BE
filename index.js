const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");

const app = express();

const Recipes = require("./models/recipe.model");

app.use(express.json());
const corsOption = {
  origin: "*", // Allow all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOption));

initializeDatabase();

const jsonData = fs.readFileSync("recipes.json", "utf8");
const recipesData = JSON.parse(jsonData);

function seedData() {
  try {
    for (const recipeData of recipesData) {
      const newRecipe = new Recipes({
        name: recipeData.name,
        cloudinaryImageId: recipeData.cloudinaryImageId,
        locality: recipeData.locality,
        areaName: recipeData.areaName,
        costForTwo: recipeData.costForTwo,
        cuisines: recipeData.cuisines,
        avgRating: recipeData.avgRating,
        totalRatingsString: recipeData.totalRatingsString,
        deliveryTime: recipeData.deliveryTime,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
      });

      newRecipe.save();
      console.log("Recipe Data: ", newRecipe.name);
    }
  } catch (error) {
    console.log(error);
  }
}

// seedData();

async function getAllRecipes() {
  try {
    const allRecipes = await Recipes.find();
    return allRecipes;
  } catch (error) {
    throw error;
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    if (recipes.length !== 0) {
      res.status(200).json({
        message: "Fetched all recipes successfully",
        recipes: recipes,
      });
    } else {
      res.status(404).json({ error: "recipes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getRecipeById(recipeId) {
  try {
    const allRecipes = await Recipes.findById(recipeId);
    return allRecipes;
  } catch (error) {
    throw error;
  }
}

app.get("/recipeDetail/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const recipes = await getRecipeById(recipeId);
    if (recipes.length !== 0) {
      res.status(200).json({
        message: "Fetched all recipes successfully",
        recipes: recipes,
      });
    } else {
      res.status(404).json({ error: "recipes not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function createRecipe(newRecipe) {
  try {
    const recipe = new Recipes(newRecipe);
    const saveRecipe = await recipe.save();
    return saveRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/add-recipe", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe Added Successfully", recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function deleteRecipe(recipeId) {
  try {
    const deletedMovie = await Recipes.findByIdAndDelete(recipeId);
    return deletedMovie;
  } catch (error) {
    throw error;
  }
}

app.delete("/recipe/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({ message: "Recipe deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running in port " + PORT);
});
