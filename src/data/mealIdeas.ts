import foods from "./foods.json";

export const mealIdeas = [
  {
    name: "A bigger breakfast bowl",
    category: "Breakfast",
    plantBased: false,
    ingredients: [
      { id: "41", grams: 40, label: "40 g dry oats" },
      { id: "131", grams: 170, label: "170 g plain nonfat Greek yogurt" },
      { id: "66", grams: 150, label: "150 g chopped apple" },
    ],
    why: "Oats and apple add fibre; yogurt adds protein. Cook oats with water, then add the toppings.",
    budget: "Buy store-brand oats and seasonal fruit.",
    color: "oat",
  },
  {
    name: "Lentil & rice comfort bowl",
    category: "Lunch & dinner",
    plantBased: true,
    ingredients: [
      { id: "30", grams: 200, label: "200 g cooked lentils" },
      { id: "38", grams: 80, label: "80 g cooked rice" },
      { id: "104", grams: 150, label: "150 g tomato" },
      { id: "93", grams: 100, label: "100 g spinach" },
      { id: "159", grams: 5, label: "5 g oil (about 1 tsp)" },
    ],
    why: "Lentils bring protein and fibre. A generous helping of vegetables adds volume without needing a second large rice portion.",
    budget: "Use dried lentils, tinned tomatoes, and frozen greens.",
    color: "lentil",
  },
  {
    name: "Chicken, potatoes & plenty of greens",
    category: "Lunch & dinner",
    plantBased: false,
    ingredients: [
      { id: "1", grams: 100, label: "100 g cooked chicken breast" },
      { id: "53", grams: 180, label: "180 g boiled potatoes" },
      { id: "98", grams: 200, label: "200 g cooked broccoli" },
      { id: "159", grams: 5, label: "5 g oil (about 1 tsp)" },
    ],
    why: "Keep the potatoes — carbs are welcome. Chicken adds protein and broccoli makes the plate generous.",
    budget: "Swap chicken for beans or tofu if that is cheaper where you shop.",
    color: "greens",
  },
  {
    name: "Chickpea crunch bowl",
    category: "Lunch & dinner",
    plantBased: true,
    ingredients: [
      { id: "32", grams: 150, label: "150 g cooked chickpeas" },
      { id: "101", grams: 150, label: "150 g shredded cabbage" },
      { id: "102", grams: 80, label: "80 g carrot" },
      { id: "104", grams: 100, label: "100 g tomato" },
      { id: "159", grams: 5, label: "5 g oil (about 1 tsp)" },
    ],
    why: "Chickpeas provide protein and fibre; crunchy vegetables make a large bowl. Add lemon, herbs, or spices to taste.",
    budget: "Rinse canned chickpeas; use long-lasting cabbage and carrots.",
    color: "lentil",
  },
  {
    name: "Yogurt & fruit pause",
    category: "Snacks",
    plantBased: false,
    ingredients: [
      { id: "131", grams: 170, label: "170 g plain nonfat Greek yogurt" },
      { id: "67", grams: 100, label: "100 g banana" },
    ],
    why: "Pair fruit with a protein source instead of assuming a small snack must keep you full on its own.",
    budget:
      "A large yogurt tub is often cheaper per portion than individual pots.",
    color: "oat",
  },
];

export function mealCalories(
  ingredients: (typeof mealIdeas)[number]["ingredients"],
) {
  return Math.round(
    ingredients.reduce(
      (total, ingredient) =>
        total +
        ((foods.find((food) => food.id === ingredient.id)?.caloriesPer100g ??
          0) *
          ingredient.grams) /
          100,
      0,
    ),
  );
}
