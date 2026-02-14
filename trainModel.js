const fs = require("fs");

// Load recipes
const recipes = JSON.parse(
  fs.readFileSync("recipes_clean.json", "utf-8")
);

// Initialize profile
let userProfile = {
  liked_regions: {},
  liked_flavors: {},
  ingredient_preference: {},
  avg_spice_level: 0,
  interaction_count: 0
};

// Training function
function updateUserProfile(profile, recipe) {
  profile.interaction_count += 1;

  // Region learning
  profile.liked_regions[recipe.region] =
    (profile.liked_regions[recipe.region] || 0) + 1;

  // Flavor learning
  recipe.flavor_tags.forEach(tag => {
    profile.liked_flavors[tag] =
      (profile.liked_flavors[tag] || 0) + 1;
  });

  // Ingredient learning
  recipe.ingredients.forEach(ingredient => {
    profile.ingredient_preference[ingredient] =
      (profile.ingredient_preference[ingredient] || 0) + 1;
  });

  // Spice learning (running average)
  profile.avg_spice_level =
    ((profile.avg_spice_level * (profile.interaction_count - 1)) +
      recipe.spice_level) /
    profile.interaction_count;

  return profile;
}

// 🔥 Simulate user liking 3 dishes
userProfile = updateUserProfile(userProfile, recipes[0]);
userProfile = updateUserProfile(userProfile, recipes[5]);
userProfile = updateUserProfile(userProfile, recipes[10]);

console.log("User profile after training:");
console.log(userProfile);

