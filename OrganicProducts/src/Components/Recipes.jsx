import { useNavigate } from "react-router-dom";

const recipes = [
  {
    id: 1,
    title: "Dahi Saunf Tikki",
    author: "Nipura Fashion",
    date: "May 24 2024",
    img: "Recipi1.png"
  },
  {
    id: 2,
    title: "Vegetable Wheat Dalia",
    author: "Nipura Fashion",
    date: "May 24 2024",
    img: "Recipi2.png"
  },
  {
    id: 3,
    title: "Crispy Urad Dal Vada",
    author: "Nipura Fashion",
    date: "May 24 2024",
    img: "Recipi3.png"
  }
];

export default function Recipes() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Recipes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition"
          >
            <img
              src={recipe.img}
              alt={recipe.title}
              className="w-full h-69 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-1">
                {recipe.title}
              </h2>
              <p className="text-sm text-gray-600">
                By {recipe.author} · {recipe.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
