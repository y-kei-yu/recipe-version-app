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
  description: null,
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

  // 材料のテスト
  const ingredientItemLines = within(lists[0]).getAllByRole("listitem");
  expect(ingredientItemLines).toHaveLength(4);

  expect(ingredientItemLines[0]).toHaveTextContent("じゃがいも");

  // 手順のテスト
  const stepItemLines = within(lists[1]).getAllByRole("listitem");
  expect(stepItemLines).toHaveLength(3);

  expect(stepItemLines[0]).toHaveTextContent("じゃがいもの皮を剥く");
});

test("一覧画面へ戻るリンクが表示される", () => {
  render(<RecipeDetail recipe={mockRecipe1} latestVersion={mockRecipeVersion1} />);
  const listLink = screen.getByRole("link", { name: "一覧へ" });
  expect(listLink).toHaveAttribute("href", "/recipes");
});

test("新しいバージョン追加画面へのリンクが表示される", () => {
  render(<RecipeDetail recipe={mockRecipe2} latestVersion={mockRecipeVersion2} />);
  const newLink = screen.getByRole("link", { name: "新しいバージョンを作る" });
  expect(newLink).toHaveAttribute("href", "/recipes/2/versions/new");
});

test("説明が未記入のとき「記載なし」と表示される", () => {
  render(<RecipeDetail recipe={mockRecipe2} latestVersion={mockRecipeVersion2} />);
  expect(screen.getByText("記載なし")).toBeInTheDocument();
});
