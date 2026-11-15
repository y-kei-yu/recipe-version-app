import RecipeDetail from "@/components/recipes/recipe-detail";
import { mockRecipes, mockRecipeVersions } from "@/lib/mock-recipes";
import { notFound } from "next/navigation";

export default async function RecipesDetail({ params }: PageProps<'/recipes/[id]'>) {
  const { id } = await params;
  const recipeId = Number(id);

  const recipe = mockRecipes.find((recipe) => recipe.id === recipeId);

  if (!recipe) {
    notFound();
  }

  const latestVersion = mockRecipeVersions.find((recipeVersion) => recipe.id === recipeVersion.recipeId && recipe.latestVersionNumber === recipeVersion.versionNumber);

  if (!latestVersion) {
    notFound();
  }


  return (
    <>
      <h1>レシピ詳細画面</h1>
      <RecipeDetail recipe={recipe} latestVersion={latestVersion} />

    </>
  );
}
