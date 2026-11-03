import { mockRecipes } from "@/lib/mock-recipes";
import Link from "next/link";


export default function RecipesPage() {

  const recipeData = mockRecipes;

  return (
    <div>
      <h1>レシピ一覧</h1>
      <Link href="/recipes/new">
        新規作成
      </Link>
      <ul>
        {recipeData.map((recipe) => (
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
    </div>
  );
}
