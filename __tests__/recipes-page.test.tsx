import RecipesPage from "@/app/recipes/page";
import prisma from "@/lib/prisma";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("@/lib/prisma", () => ({
  default: {
    recipe: {
      findMany: vi.fn(),
    }
  }
}));

const mockRecipes = [
  {
    id: 1,
    title: "レシピ1",
    description: "テストテスト",
    latestVersionNumber: 1,
    createdAt: new Date("2026-11-01T10:00:00+09:00"),
    updatedAt: new Date("2026-11-02T10:00:00+09:00"),
  },
  {
    id: 2,
    title: "レシピ2",
    description: null,
    latestVersionNumber: 1,
    createdAt: new Date("2026-11-05T10:00:00+09:00"),
    updatedAt: new Date("2026-11-06T10:00:00+09:00"),
  },
  {
    id: 3,
    title: "レシピ3",
    description: "説明3",
    latestVersionNumber: 1,
    createdAt: new Date("2026-11-09T10:00:00+09:00"),
    updatedAt: new Date("2026-11-10T10:00:00+09:00"),
  },
];

test("レシピのデータが複数件表示されている", async () => {
  vi.mocked(prisma.recipe.findMany).mockResolvedValue(mockRecipes);
  const result = await RecipesPage();
  render(result);
  expect(screen.getByText("レシピ1")).toBeInTheDocument();
  expect(screen.getByText("レシピ2")).toBeInTheDocument();
  expect(screen.getByText("レシピ3")).toBeInTheDocument();
});

test("更新日の新しい順でレシピを取得する", async () => {
  vi.mocked(prisma.recipe.findMany).mockResolvedValue(mockRecipes);
  const result = await RecipesPage();
  render(result);
  expect(prisma.recipe.findMany).toHaveBeenCalledWith({
    orderBy: {
      updatedAt: 'desc',
    }
  });
});
