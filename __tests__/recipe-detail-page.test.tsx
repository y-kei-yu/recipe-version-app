import RecipesDetail from "@/app/recipes/[id]/page";
import prisma from "@/lib/prisma";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi, describe } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("@/lib/prisma", () => ({
  default: {
    recipe: {
      findUnique: vi.fn(),
    },
    recipeVersion: {
      findUnique: vi.fn(),
    }
  }
}));

const mockRecipe = {
  id: 5,
  title: "レシピ5",
  description: "テストテスト",
  latestVersionNumber: 1,
  createdAt: new Date("2026-11-01T10:00:00+09:00"),
  updatedAt: new Date("2026-11-02T10:00:00+09:00")
};

const mockRecipeVersion = {
  id: 5,
  recipeId: 5,
  versionNumber: 1,
  ingredients: "じゃがいも\n玉ねぎ\n卵\nオリーブオイル",
  steps: "じゃがいもの皮を剥く\n玉ねぎを1cm間隔で切る\n卵を溶く",
  changeMemo: null,
  rating: null,
  resultMemo: null,
  createdAt: new Date("2026-11-01T10:00:00+09:00"),
};

describe("404 になる場合", () => {
  test("存在しないidの場合、404ページが表示される", async () => {
    vi.mocked(prisma.recipe.findUnique).mockResolvedValue(null);
    const result = RecipesDetail({ params: Promise.resolve({ id: "999" }), searchParams: Promise.resolve({}) });
    await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  test("数値でないidの場合、404ページが表示される", async () => {
    const result = RecipesDetail({ params: Promise.resolve({ id: "abc" }), searchParams: Promise.resolve({}) });
    await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(prisma.recipe.findUnique).not.toHaveBeenCalled();
  });

  test("idが0の場合、404ページが表示される", async () => {
    const result = RecipesDetail({ params: Promise.resolve({ id: "0" }), searchParams: Promise.resolve({}) });
    await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(prisma.recipe.findUnique).not.toHaveBeenCalled();
  });

  test("idが小数の場合、404ページが表示される", async () => {
    const result = RecipesDetail({ params: Promise.resolve({ id: "1.5" }), searchParams: Promise.resolve({}) });
    await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(prisma.recipe.findUnique).not.toHaveBeenCalled();
  });

  test("idがDBに入る範囲の整数を超えている場合、404ページが表示される", async () => {
    const result = RecipesDetail({ params: Promise.resolve({ id: "99999999999" }), searchParams: Promise.resolve({}) });
    await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    expect(prisma.recipe.findUnique).not.toHaveBeenCalled();
  });
});

describe("レシピが見つかる場合", () => {
  test("存在するidの場合、そのレシピが表示される", async () => {
    vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);
    vi.mocked(prisma.recipeVersion.findUnique).mockResolvedValue(mockRecipeVersion);
    const result = await RecipesDetail({ params: Promise.resolve({ id: "5" }), searchParams: Promise.resolve({}) });
    render(result);
    expect(prisma.recipe.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
    });
    expect(screen.getByRole("heading", { name: "レシピ5" })).toBeInTheDocument();
  });

  test("最新のバージョン番号でバージョンを取得する", async () => {
    vi.mocked(prisma.recipe.findUnique).mockResolvedValue({
      ...mockRecipe,
      latestVersionNumber: 2
    });

    vi.mocked(prisma.recipeVersion.findUnique).mockResolvedValue({
      ...mockRecipeVersion,
      versionNumber: 2
    });
    const result = await RecipesDetail({ params: Promise.resolve({ id: "5" }), searchParams: Promise.resolve({}) });
    render(result);
    expect(screen.getByText("オリーブオイル")).toBeInTheDocument();
    expect(prisma.recipeVersion.findUnique).toHaveBeenCalledWith({
      where: {
        recipeId_versionNumber: { recipeId: 5, versionNumber: 2 },
      }
    });
  });

  test("レシピはあるが、最新バージョンが見つからない場合、404ページが表示される", async () => {
    vi.mocked(prisma.recipe.findUnique).mockResolvedValue(mockRecipe);
    vi.mocked(prisma.recipeVersion.findUnique).mockResolvedValue(null);
    const result = RecipesDetail({ params: Promise.resolve({ id: "5" }), searchParams: Promise.resolve({}) });
    await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
