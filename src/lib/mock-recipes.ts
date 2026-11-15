import { Recipe, RecipeVersion } from "./types";

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "レシピ1",
    description: "レシピ1の説明",
    latestVersionNumber: 1,
    updatedAt: new Date("2026-10-01T10:00:00+09:00"),
  },
  {
    id: 2,
    title: "レシピ2",
    description: null,
    latestVersionNumber: 2,
    updatedAt: new Date("2026-10-02T10:00:00+09:00"),
  },
];

export const mockRecipeVersions: RecipeVersion[] = [
  {
    id: 1,
    recipeId: 1,
    versionNumber: 1,
    ingredients: "りんご\nバター\n砂糖",
    steps: "皮を剥く\n四等分にカット\n焼く",
    changeMemo: null,
    rating: 5,
    resultMemo: "美味しかった",
    createdAt: new Date("2026-10-01T10:00:00+09:00"),
  },
  {
    id: 2,
    recipeId: 2,
    versionNumber: 1,
    ingredients: "卵\n塩\n胡椒\n油",
    steps:
      "塩コショウを入れて卵を混ぜる\n油をフライパンに入れる\n溶いた卵を入れる",
    changeMemo: null,
    rating: null,
    resultMemo: null,
    createdAt: new Date("2026-10-02T09:00:00+09:00"),
  },
  {
    id: 3,
    recipeId: 2,
    versionNumber: 2,
    ingredients: "卵\n塩\n胡椒\nバター",
    steps:
      "塩コショウを入れて卵を混ぜる\nバターをフライパンに入れる\n溶いた卵を入れる",
    changeMemo: "油をバターに変更",
    rating: 5,
    resultMemo: "美味しかった",
    createdAt: new Date("2026-10-02T10:00:00+09:00"),
  },
];
