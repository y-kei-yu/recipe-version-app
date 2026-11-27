import RecipeDetail from "@/components/recipes/recipe-detail";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function RecipesDetail({ params }: PageProps<'/recipes/[id]'>) {
  const { id } = await params;
  const recipeId = Number(id);

  // id が DB に入る範囲の整数（1〜2147483647）でなければ 404 にする（そのまま Prisma に渡すとエラーになるため）
  if (!Number.isInteger(recipeId) || recipeId < 1 || recipeId > 2147483647) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId }
  });

  if (!recipe) {
    notFound();
  }

  const latestVersion = await prisma.recipeVersion.findUnique({
    where: {
      recipeId_versionNumber: { recipeId: recipe.id, versionNumber: recipe.latestVersionNumber },
    }
  });

  if (!latestVersion) {
    notFound();
  }

  return (<RecipeDetail recipe={recipe} latestVersion={latestVersion} />);
}
