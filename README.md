# 🍽️ Cravelecious

### AI-Powered Indian Food Taste Prediction Platform

> Don’t order blindly. Predict your taste.

---

## 🚀 Overview

Cravelecious is an AI-powered food taste prediction platform that helps users discover dishes they are most likely to enjoy — before ordering.

Traditional food reviews reflect public opinion.
Cravelecious predicts *your personal taste*.

Using a structured rule-based recommendation engine, the system calculates:

* ✅ Like Probability (%)
* 🎯 Confidence Score
* 🧠 Taste Explanation
* 📊 Matched Preference Factors

---

## 🔥 Key Features

### 🧠 1. AI Taste Prediction Engine

Predicts whether a user will *LIKE or DISLIKE* a dish based on:

* Regional similarity
* Cuisine preference alignment
* Flavor tag matches
* Spice tolerance compatibility

> This is not random scoring.
> It uses weighted rule-based intelligence for realistic AI simulation.

---

### 🌎 2. Indian Regional Intelligence System

Deep understanding of Indian cuisine across:

* North India
* South India
* East India
* West India

Each dish contains structured metadata:

ts
{
  id,
  name,
  region,
  cuisine,
  flavorTags,
  spiceLevel,
  texture,
  category,
  image,
  description
}


Dataset includes *100+ authentic Indian dishes*, evenly distributed across regions.

---

### 🔄 3. Swipe-Based Taste Learning (Tinder-Style)

Users swipe:

* 👉 Right = LIKE
* 👈 Left = DISLIKE

The system dynamically updates:

* Regional affinity
* Flavor tag weights
* Cuisine preferences
* Spice tolerance modeling

Taste profile evolves in real time.

---

### 📊 4. Smart Confidence System

If the user profile is weak (low interactions):

> “We need more taste signals.”

The system then shows 20–25 famous dishes from the user’s selected region to strengthen the taste model before making strong predictions.

---

### 🔎 5. Intelligent Cross-Region Handling

If a user searches for a dish outside their primary region:

Example:
User region = South India
Searches = Butter Chicken (North)

System:

1. Predicts likelihood
2. Explains regional mismatch
3. Suggests 20–25 regional dishes for profile strengthening

This prevents inaccurate predictions and improves personalization accuracy.

---

## 🏗 Architecture

Clean service abstraction layer:


/services
  ├── api.ts
  ├── mockData.ts
  ├── recommendationEngine.ts


### 🧠 Recommendation Engine Logic

Scoring Weights:

* Region match → +3
* Cuisine match → +2
* Flavor tag match → +1 per tag
* Spice tolerance match → +1
* Category match → +1
* Opposite spice mismatch → -2
* Strong disliked flavor → -2

Probability is derived from:


(finalScore / maxPossibleScore) * 100


Confidence is based on:

* Number of swipes
* Taste vector strength
* Region certainty

Fully replaceable with real ML model in future.

---

## 🎨 UI / UX

Built with:

* ⚡ Next.js
* 🎨 Tailwind CSS
* 🎞 Framer Motion

Design Philosophy:

* Mobile-first
* Vibrant but soothing gradients
* Warm food-inspired color palette
* Glass-style cards
* Smooth swipe animations
* Premium startup feel

---

## 📈 Future Scope

* Zomato / Swiggy API Integration
* AI flavor embedding models
* Restaurant personalization engine
* Smart ordering assistant
* Subscription-based food personalization

---

## 🎯 Why Cravelecious?

Food discovery is chaotic.
Reviews are generic.
Recommendations are popularity-based.

Cravelecious predicts:

> YOUR taste.
> Not everyone else's.

In a country as diverse as India’s culinary landscape, personalization is the future.
