import { Recipe, RecipeVersion } from "@/lib/types";

export default function RecipeDetail({
  recipe,
  latestVersion
}: {
  recipe: Recipe;
  latestVersion: RecipeVersion;
}) {

  return (
    <>
      <p>{recipe.title}</p>
      <p>{latestVersion.versionNumber}</p>
    </>
  );
}
