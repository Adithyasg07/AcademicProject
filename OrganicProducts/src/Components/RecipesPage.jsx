import { useParams } from "react-router-dom";

const recipes = [
  {
    id: 1,
    title: "Dahi Saunf Tikki",
    image:
      "https://organictattva.com/cdn/shop/articles/dahi-sauf-tikki_06240b26-649c-49a8-b73b-e6c4d21d7d2e.jpg?v=1742193606&width=1780",
    ingredients: [
      "500 gms – Dahi",
      "2 pcs – Onions, chopped",
      "4 pcs – Green chillies, chopped",
      "1/2 tsp – Salt",
      "75 gms – Cheese",
      "1 tsp – Fennel (Saunf)",
      "2 tbsp – Coriander seeds",
      "2 tbsp – Black pepper powder",
      "1 tbsp – Ginger, chopped",
      "1½ tbsp – Red chilli flakes",
      "1/2 cup – Besan (roasted)"
    ],
    steps: [
      "Mix dahi, onion, chillies and ginger.",
      "Add besan, cheese and spices.",
      "Shape into tikkis.",
      "Shallow fry till golden.",
      "Serve hot with chutney."
    ]
  },
  {
    id: 2,
    title: "Vegetable Wheat Dalia",
    image:
      "https://organictattva.com/cdn/shop/articles/wheat-dalia_6dd991b4-d36b-41bd-8b44-f2225d34c1cc.jpg?v=1742193577&width=1780",
    ingredients: [
      "1 cup – Wheat Dalia",
      "1 Onion – chopped",
      "1 Carrot – chopped",
      "1/2 cup – Green peas",
      "Salt to taste"
    ],
    steps: [
      "Dry roast dalia.",
      "Cook vegetables.",
      "Add dalia and water.",
      "Cook till soft.",
      "Serve hot."
    ]
  },
  {
    id: 3,
    title: "Crispy Urad Dal Vada",
    image:
      "https://organictattva.com/cdn/shop/articles/urad-dal-vada-recipe_1cb78db3-341b-4e08-bdc0-2d009c95283c.jpg?v=1742193589&width=1780",
    ingredients: [
      "1 cup – Urad Dal",
      "2 Green chillies",
      "1 tsp – Ginger",
      "Salt to taste",
      "Oil for frying"
    ],
    steps: [
      "Soak dal for 4 hours.",
      "Grind thick batter.",
      "Add spices.",
      "Fry till crispy.",
      "Serve hot."
    ]
  }
];

export default function RecipesPage() {
  const { id } = useParams();
  const selectedRecipe = recipes.find(r => r.id === Number(id));

  if (!selectedRecipe) return <p className="text-center mt-20 text-xl">Recipe not found</p>;

  return (
    <div>
      {/* Full-width Image */}
      <div className="w-full h-[800px] md:h-[800px] overflow-hidden">
        <img
          src={selectedRecipe.image}
          alt={selectedRecipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Ingredients and Steps */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#5a3a1a] mb-8 text-center">
          {selectedRecipe.title}
        </h1>

        <section className="mb-12">
          <h2 className="bg-[#5a3a1a] text-white px-4 py-2 rounded inline-block mb-4">
            Ingredients
          </h2>
          <ul className="space-y-2 text-gray-700">
            {selectedRecipe.ingredients.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="bg-[#5a3a1a] text-white px-4 py-2 rounded inline-block mb-4">
            Recipe
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-gray-700">
            {selectedRecipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
