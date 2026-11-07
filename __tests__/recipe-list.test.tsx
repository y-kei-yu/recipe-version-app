import RecipeList from "@/components/recipes/recipe-list";
import { Recipe } from "@/lib/types";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";


const mockRecipe: Recipe[] = [
  {
    id: 1,
    title: "レシピ1",
    description: "レシピ1の説明",
    latestVersionNumber: 1,
    updatedAt: new Date("2026-11-01T10:00:00+09:00"),
  },
  {
    id: 2,
    title: "レシピ2",
    description: "レシピ2の説明",
    latestVersionNumber: 2,
    updatedAt: new Date("2026-11-02T10:00:00+09:00"),
  },
  {
    id: 3,
    title: "レシピ3",
    description: null,
    latestVersionNumber: 3,
    updatedAt: new Date("2026-11-03T10:00:00+09:00"),
  }
];

afterEach(() => {
  cleanup();
});


test("複数のレシピが、渡した件数分表示される", () => {
  render(<RecipeList recipes={mockRecipe} />);
  const listItem = screen.getAllByRole("listitem");

  expect(listItem).toHaveLength(3);
});

test("レシピ名、説明、最新バージョン番号、更新日が表示される", () => {
  render(<RecipeList recipes={mockRecipe} />);
  const listItem = screen.getAllByRole("listitem");

  expect(within(listItem[0]).getByText("レシピ1")).toBeDefined();
  expect(within(listItem[0]).getByText("レシピ1の説明")).toBeDefined();
  expect(within(listItem[0]).getByText("最新バージョン: 1")).toBeDefined();
  expect(within(listItem[0]).getByText("更新日: 2026-11-01")).toBeDefined();

  expect(within(listItem[2]).getByText("記載なし")).toBeDefined();
});

test("説明が未記入の表示確認", () => {
  render(<RecipeList recipes={mockRecipe} />);
  const listItem = screen.getAllByRole("listitem");

  expect(within(listItem[2]).getByText("記載なし")).toBeDefined();
});

test("各レシピに詳細画面へのリンクがある", () => {
  render(<RecipeList recipes={mockRecipe} />);
  const recipeLink1 = screen.getByRole("link", { name: "レシピ1" });
  const recipeLink1Href = recipeLink1.getAttribute("href");
  expect(recipeLink1Href).toBe("/recipes/1");

  const recipeLink2 = screen.getByRole("link", { name: "レシピ2" });
  const recipeLink2Href = recipeLink2.getAttribute("href");
  expect(recipeLink2Href).toBe("/recipes/2");

  const recipeLink3 = screen.getByRole("link", { name: "レシピ3" });
  const recipeLink3Href = recipeLink3.getAttribute("href");
  expect(recipeLink3Href).toBe("/recipes/3");

});

test("新規作成リンクが表示される", () => {
  render(<RecipeList recipes={mockRecipe} />);
  const createLink = screen.getByRole("link", { name: "新規作成" });
  const createLinkHref = createLink.getAttribute("href");
  expect(createLinkHref).toBe("/recipes/new");
});

