const axios = require("axios");
const fs = require("fs");

// 🔴 REPLACE THIS WITH YOUR ACTUAL BASE URL
const BASE_URL =
  "http://cosylab.iiitd.edu.in:6969/recipe2-api/recipe/recipe-day/with-ingredients-categories?excludeIngredients=water,flour&excludeCategories=Dairy";

async function fetchRecipes(page = 1, limit = 10) {
  try {
    const response = await axios.get(
      "https://api.foodoscope.com/recipe2-api/recipebyingredient/by-ingredients-categories-title",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer g4dz0YY945qfYABbLMKje6ep-7T6jwJnkSu6u_B6F96wFrvX",
        },
        params: {
          includeIngredients: "salt",
          excludeIngredients: "",
          includeCategories: "",
          excludeCategories: "",
          title: "",
          page,
          limit,
        },
      }
    );

    return response.data?.payload?.data || [];

  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return [];
  }
}





function cleanRecipe(recipe) {
  const cuisineType =
    recipe.vegan === "1.0"
      ? "Vegan"
      : recipe.ovo_lacto_vegetarian === "1.0"
      ? "Vegetarian"
      : "Non-Vegetarian";

  return {
    id: recipe.Recipe_id,
    name: recipe.Recipe_title,
    region: recipe.Region,
    cuisine_type: cuisineType,
    ingredients: [] // we will fill in next step
  };
}

async function buildBaseDataset() {
  const rawRecipes = await fetchRecipes(1, 10);

  console.log("RAW FIRST RECIPE:");
  console.log(rawRecipes[0]);

  const cleanedRecipes = rawRecipes.map(cleanRecipe);

  console.log("Cleaned Recipes:");
  console.log(cleanedRecipes);
}


buildBaseDataset();
