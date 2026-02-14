const fs = require("fs");

const recipes = JSON.parse(
  fs.readFileSync("recipes_clean.json", "utf-8")
);

const userProfile = JSON.parse(
  fs.readFileSync("user_profile.json", "utf-8")
);

function calculateScore(recipe, profile) {
  let score = 0;

  const regionScore =
    profile.liked_regions[recipe.region] || 0;

  let flavorScore = 0;
  recipe.flavor_tags.forEach(tag => {
    if (profile.liked_flavors[tag]) {
      flavorScore += profile.liked_flavors[tag];
    }
  });

  let ingredientScore = 0;
  recipe.ingredients.forEach(ingredient => {
    if (profile.ingredient_preference[ingredient]) {
      ingredientScore += profile.ingredient_preference[ingredient];
    }
  });

  const spiceDiff = Math.abs(
    profile.avg_spice_level - recipe.spice_level
  );
  const spiceScore = 5 - spiceDiff;

  score =
    0.3 * regionScore +
    0.25 * flavorScore +
    0.25 * ingredientScore +
    0.2 * spiceScore;

  return score;
}

const rankedRecipes = recipes
  .map(recipe => ({
    ...recipe,
    score: calculateScore(recipe, userProfile)
  }))
  .sort((a, b) => b.score - a.score);

console.log("🔥 Top 5 Recommendations:");
rankedRecipes.slice(0, 5).forEach((r, i) => {
  console.log(
    `${i + 1}. ${r.name} (Score: ${r.score.toFixed(2)})`
  );
});
