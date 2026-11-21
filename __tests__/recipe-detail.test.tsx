import RecipeDetail from "@/components/recipes/recipe-detail";
import { Recipe, RecipeVersion } from "@/lib/types";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

const mockRecipe1: Recipe =
{
  id: 1,
  title: "レシピ1",
  description: "レシピ1の説明",
  latestVersionNumber: 1,
  updatedAt: new Date("2026-11-01T10:00:00+09:00"),
};

const mockRecipe2: Recipe =
{
  id: 2,
  title: "レシピ2",
  description: "レシピ2の説明",
  latestVersionNumber: 2,
  updatedAt: new Date("2026-11-02T10:00:00+09:00"),
};


const mockRecipeVersion1: RecipeVersion =
{
  id: 1,
  recipeId: 1,
  versionNumber: 1,
  ingredients: "じゃがいも\n玉ねぎ\n卵\nオリーブオイル",
  steps: "じゃがいもの皮を剥く\n玉ねぎを1cm間隔で切る\n卵を溶く",
  changeMemo: null,
  rating: null,
  resultMemo: null,
  createdAt: new Date("2026-11-01T10:00:00+09:00"),
};
const mockRecipeVersion2: RecipeVersion =
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
};

const mockRecipeVersion3: RecipeVersion =
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
};

afterEach(() => {
  cleanup();
});

test("レシピ名、説明、材料、手順が表示される", () => {
  render(<RecipeDetail recipe={mockRecipe1} latestVersion={mockRecipeVersion1} />);

  expect(screen.getByText("レシピ1")).toBeInTheDocument();
  expect(screen.getByText("レシピ1の説明")).toBeInTheDocument();
  expect(screen.getByText("玉ねぎ")).toBeInTheDocument();
  expect(screen.getByText("玉ねぎを1cm間隔で切る")).toBeInTheDocument();
});

test("材料と手順が行ごとに分かれて表示される", () => {
  render(<RecipeDetail recipe={mockRecipe1} latestVersion={mockRecipeVersion1} />);
  const lists = screen.getAllByRole("list");

  //　材料のテスト
  const ingredientItemLines = within(lists[0]).getAllByRole("listitem");
  expect(ingredientItemLines).toHaveLength(4);

  expect(ingredientItemLines[0]).toHaveTextContent("じゃがいも");

  //手順
  const stepItemLines = within(lists[1]).getAllByRole("listitem");
  expect(stepItemLines).toHaveLength(3);

  expect(stepItemLines[0]).toHaveTextContent("じゃがいもの皮を剥く");
});
