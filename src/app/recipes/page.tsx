import { mockRecipes } from "@/lib/mock-recipes";


export default function RecipesPage() {

  const recipeData = mockRecipes;

  return (
    <div>
      <h1>レシピ一覧</h1>
      <ul>
        {recipeData.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p>{recipe.description || "記載なし"}</p>
            <p>最新バージョン: {recipe.latestVersionNumber}</p>
            <p>更新日: {recipe.updatedAt.toLocaleDateString('ja-JP', { timeZone: "Asia/Tokyo" }).replaceAll('/', '-')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
