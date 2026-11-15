import { mockRecipes } from "@/lib/mock-recipes";
import { notFound } from "next/navigation";

export default async function RecipesDetail({ params }: PageProps<'/recipes/[id]'>) {
  const { id } = await params;
  const recipeId = Number(id);

  const recipe = mockRecipes.find((recipe) => recipe.id === recipeId);

  if (!recipe) {
    notFound();
  }



  return (
    <>
      <h1>レシピ詳細画面</h1>
      <p>{recipeId}</p>
      <p>{recipe.title}</p>
    </>
  );
}
