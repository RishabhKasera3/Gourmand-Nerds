📋 Foodoscope API Issue Log & Feedback
Team Name: Gourmand Nerds Event: Fork It! Hackathon 2026 Date: February 15, 2026

🚀 Summary
While integrating RecipeDB and FlavorDB into our "Taste Intelligence" engine (Cravelecious), we encountered specific challenges regarding connectivity, data normalization, and type safety. Below is a detailed log of these issues with constructive suggestions for improvement.

1. Critical Connectivity & DNS Resolution
Severity: 🔴 Critical
Endpoint(s):
https://cosylab.iiitd.edu/recipe2-api/recipe/recipeofday
https://cosylab.iiitd.edu/flavordb/properties/by-description
Issue Description: The API servers located at cosylab.iiitd.edu were frequently unreachable or failed to resolve (net::ERR_NAME_NOT_RESOLVED / Connection Timeouts) from standard consumer ISPs during the hackathon period.
Impact: We forced to implement a "Circuit Breaker" pattern with local fallback data to keep our application functional.
Suggestion:
Deploy a lightweight caching proxy on a global CDN (like Cloudflare or Vercel Edge) to ensure high availability during hackathons.
Enable CORS (Access-Control-Allow-Origin: *) explicitly to allow direct browser-to-API calls for client-side apps.
2. Inconsistent JSON Naming Conventions
Severity: 🟡 Moderate
Endpoint: GET /recipe/recipeofday
Issue Description: The JSON response payloads mix multiple casing styles, making TypeScript interface definition error-prone.
Recipe_title (PascalSnake?)
img_url (snake_case)
Region (PascalCase)
prep_time (snake_case)
Payload Example:
json
{
  "Recipe_title": "Cosmic Crackers",
  "img_url": "...",
  "Region": "Canadian"
}
Suggestion: Standardize to camelCase (standard for JSON APIs) or snake_case strictly.
Proposed: recipeTitle, imageUrl, region.
3. Data Type Safety (Strings vs. Booleans/Numbers)
Severity: 🟡 Moderate
Endpoint: All RecipeDB endpoints
Issue Description: Numerical and boolean values are returned as Strings.
"vegan": "0.0" (Should be boolean false)
"Calories": "274.8" (Should be number 274.8)
Impact: Requires unnecessary parsing overhead on the client side (parseFloat(), === "1.0" checks).
Suggestion: Use native JSON types for numbers and booleans.
Proposed: "vegan": false, "calories": 274.8.
4. Documentation & Specification Gap
Severity: 🟢 Minor (Enhancement)
Issue: Dependence on Postman Collections.
Description: While the Postman collections are helpful, the simplified examples don't cover all edge cases (e.g., what fields are nullable?).
Suggestion: Provide an OpenAPI 3.0 (Swagger) specification. This would allow teams to:
Auto-generate SDK clients (using openapi-generator).
Have full type safety out of the box.
5. FlavorDB Response Structure
Severity: 🟡 Moderate
Endpoint: GET /flavordb/properties/by-description
Issue: The API often returns empty arrays [] for common descriptors (e.g., "creamy") without a "did you mean" suggestion or fuzzy search capability.
Suggestion: Implement fuzzy matching logic on the backend so slightly inexact terms still yield molecular results.
Conclusion: Despite these challenges, the depth of data provided by Foodoscope is unmatched. Our molecular breakdown feature would be impossible without FlavorDB. We hope this feedback helps refine the ecosystem for future developers!

— Team Gourmand Nerds
