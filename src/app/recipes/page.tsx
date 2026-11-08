import RecipeList from "@/components/recipes/recipe-list";
import { mockRecipes } from "@/lib/mock-recipes";

export default function RecipesPage() {

  return (
    <div>
      <h1>レシピ一覧</h1>
      <RecipeList recipes={mockRecipes} />
    </div>
  );
}
