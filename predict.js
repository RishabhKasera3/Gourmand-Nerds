const fs = require("fs");

// Read files once
const recipes = JSON.parse(
  fs.readFileSync("recipes_clean.json", "utf-8")
);

const userProfile = JSON.parse(
  fs.readFileSync("user_profile.json", "utf-8")
);

function calculateScore(recipe, profile) {
  const regionScore =
    (profile.liked_regions?.[recipe.region]) || 0;

  let flavorScore = 0;
  recipe.flavor_tags?.forEach(tag => {
    flavorScore += profile.liked_flavors?.[tag] || 0;
  });

  let ingredientScore = 0;
  recipe.ingredients?.forEach(ingredient => {
    ingredientScore += profile.ingredient_preference?.[ingredient] || 0;
  });

  const spiceDiff = Math.abs(
    (profile.avg_spice_level || 0) - (recipe.spice_level || 0)
  );

  const spiceScore = Math.max(0, 5 - spiceDiff); // avoid negative score

  return (
    0.3 * regionScore +
    0.25 * flavorScore +
    0.25 * ingredientScore +
    0.2 * spiceScore
  );
}

function predictLike(recipe) {
  const score = calculateScore(recipe, userProfile);
  const THRESHOLD = 2.5;

  return {
    result:
      score >= THRESHOLD
        ? "LIKELY TO LIKE 👍"
        : "UNLIKELY TO LIKE 👎",
    confidence: score.toFixed(2)
  };
}

// Example usage
recipes.forEach(recipe => {
  console.log(recipe.name, predictLike(recipe));
});
// 🔎 Take dish name from command line
const dishName = process.argv.slice(2).join(" ");

if (!dishName) {
  console.log("Please provide a dish name.");
  process.exit();
}

// Find dish
const recipe = recipes.find(r =>
  r.name.toLowerCase() === dishName.toLowerCase()
);

if (!recipe) {
  console.log("Dish not found in dataset.");
  process.exit();
}

// Predict
const prediction = predictLike(recipe);

console.log("\n🔎 Dish:", recipe.name);
console.log("Prediction:", prediction.result);
console.log("Score:", prediction.confidence);
