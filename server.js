const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const recipes = JSON.parse(
  fs.readFileSync("recipes_clean.json", "utf-8")
);

let userProfile = {
  liked_regions: {},
  liked_flavors: {},
  ingredient_preference: {},
  avg_spice_level: 0,
  interaction_count: 0
};

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

function calculateScore(recipe, profile) {
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

  return (
    0.3 * regionScore +
    0.25 * flavorScore +
    0.25 * ingredientScore +
    0.2 * spiceScore
  );
}

// 🔥 TRAIN ENDPOINT
app.post("/train", (req, res) => {
  const { dishName } = req.body;

  const recipe = recipes.find(r =>
    r.name.toLowerCase() === dishName.toLowerCase()
  );

  if (!recipe) {
    return res.json({ error: "Dish not found" });
  }

  userProfile = updateUserProfile(userProfile, recipe);

  res.json({ message: "Profile updated", profile: userProfile });
});

// 🔥 RECOMMEND ENDPOINT
app.get("/recommend", (req, res) => {
  const ranked = recipes
    .map(r => ({
      name: r.name,
      score: calculateScore(r, userProfile)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json(ranked);
});

// 🔥 PREDICT ENDPOINT
app.post("/predict", (req, res) => {
  const { dishName } = req.body;

  const recipe = recipes.find(r =>
    r.name.toLowerCase() === dishName.toLowerCase()
  );

  if (!recipe) {
    return res.json({ error: "Dish not found" });
  }

  const score = calculateScore(recipe, userProfile);

  res.json({
    dish: recipe.name,
    score,
    result: score > 2.5
      ? "LIKELY TO LIKE"
      : "UNLIKELY TO LIKE"
  });
});

app.listen(3000, () =>
  console.log("Server running on port 3000")
);

