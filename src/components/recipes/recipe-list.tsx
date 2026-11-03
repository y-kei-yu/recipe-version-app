import { Recipe } from "@/lib/types";
import Link from "next/link";

export default function RecipeList({
  recipes
}: {
  recipes: Recipe[];
}) {
  return (
    <>
      <Link href="/recipes/new">
        新規作成
      </Link>
      {recipes.length === 0 ? (
        <p>まだレシピがありません。新規作成から追加しましょう</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h2>
                <Link href={`/recipes/${recipe.id}`}>
                  {recipe.title}
                </Link>
              </h2>
              <p>{recipe.description || "記載なし"}</p>
              <p>最新バージョン: {recipe.latestVersionNumber}</p>
              <p>更新日: {recipe.updatedAt.toLocaleDateString('ja-JP', { timeZone: "Asia/Tokyo" }).replaceAll('/', '-')}</p>
            </li>
          ))}
        </ul>
      )
      }
    </>
  );
}
