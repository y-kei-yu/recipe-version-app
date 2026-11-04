import RecipeList from "@/components/recipes/recipe-list";
import { Recipe } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";


const mockRecipe: Recipe[] = [
  {
    id: 1,
    title: "レシピ1",
    description: "レシピ1の説明",
    latestVersionNumber: 1,
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "レシピ2",
    description: "レシピ2の説明",
    latestVersionNumber: 2,
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "レシピ3",
    description: "レシピ3の説明",
    latestVersionNumber: 3,
    updatedAt: new Date(),
  }
];

test("複数のレシピが、渡した件数分表示される", () => {
  render(<RecipeList recipes={mockRecipe} />);
  const listItem = screen.getAllByRole("listitem");

  expect(listItem).toHaveLength(3);

});
