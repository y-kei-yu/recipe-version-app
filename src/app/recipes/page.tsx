import RecipeList from "@/components/recipes/recipe-list";
import prisma from "@/lib/prisma";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div>
      <h1>レシピ一覧</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
}
