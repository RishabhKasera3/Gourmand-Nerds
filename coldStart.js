const fs = require("fs");
const readline = require("readline");

// Load dataset
const recipes = JSON.parse(
  fs.readFileSync("recipes_clean.json", "utf-8")
);

// Create empty profile
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

  profile.liked_regions[recipe.region] =
    (profile.liked_regions[recipe.region] || 0) + 1;

  recipe.flavor_tags.forEach(tag => {
    profile.liked_flavors[tag] =
      (profile.liked_flavors[tag] || 0) + 1;
  });

  recipe.ingredients.forEach(ingredient => {
    profile.ingredient_preference[ingredient] =
      (profile.ingredient_preference[ingredient] || 0) + 1;
  });

  profile.avg_spice_level =
    ((profile.avg_spice_level * (profile.interaction_count - 1)) +
      recipe.spice_level) /
    profile.interaction_count;

  return profile;
}

// Select diverse dishes
const starterDishes = [
  recipes.find(r => r.spice_level >= 4),
  recipes.find(r => r.sweetness_level >= 4),
  recipes.find(r => r.richness_level >= 4),
  recipes.find(r => r.region === "South Indian"),
  recipes.find(r => r.region === "Italian"),
  recipes.find(r => r.region === "Japanese")
];

// Setup CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n🔥 Initial Taste Setup");
console.log("Select the dishes you like (enter numbers separated by space):\n");

starterDishes.forEach((dish, index) => {
  console.log(`${index + 1}. ${dish.name}`);
});

rl.question("\nYour choices: ", (answer) => {
  const selectedIndexes = answer
    .split(" ")
    .map(num => parseInt(num) - 1)
    .filter(i => i >= 0 && i < starterDishes.length);

  selectedIndexes.forEach(i => {
    userProfile = updateUserProfile(userProfile, starterDishes[i]);
  });

  fs.writeFileSync(
    "user_profile.json",
    JSON.stringify(userProfile, null, 2)
  );

  console.log("\n✅ Profile Created Successfully!");
  console.log(userProfile);

  rl.close();
});
