import { Recipe, RecipeVersion } from "@/lib/types";
import Link from "next/link";

export default function RecipeDetail({
  recipe,
  latestVersion
}: {
  recipe: Recipe;
  latestVersion: RecipeVersion;
}) {

  const ingredientLines = latestVersion.ingredients.split("\n");
  const stepLines = latestVersion.steps.split("\n");

  return (
    <>
      <Link href={`/recipes/${recipe.id}/versions/new`}>
        新しいバージョンを作る
      </Link>
      <h1>{recipe.title}</h1>
      <p>{recipe.description || "記載なし"}</p>
      <h2>材料</h2>
      <ul>
        {ingredientLines.map((ingredient, index) => (
          <li key={index}>
            {ingredient}
          </li>
        ))}
      </ul>
      <h2>手順</h2>
      <ol>
        {stepLines.map((step, index) => (
          <li key={index}>
            {step}
          </li>
        ))}
      </ol>
      <Link href="/recipes">
        一覧へ
      </Link>
    </>
  );
}
