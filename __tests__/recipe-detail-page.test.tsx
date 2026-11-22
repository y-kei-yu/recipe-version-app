import RecipesDetail from "@/app/recipes/[id]/page";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

test("存在しないidの場合、404ページが表示される", async () => {
  const result = RecipesDetail({ params: Promise.resolve({ id: "999" }), searchParams: Promise.resolve({}) });
  await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
});

test("数値でないidの場合、404ページが表示される", async () => {
  const result = RecipesDetail({ params: Promise.resolve({ id: "abc" }), searchParams: Promise.resolve({}) });
  await expect(result).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
});

test("存在するidの場合、そのレシピが表示される", async () => {
  const result = await RecipesDetail({ params: Promise.resolve({ id: "1" }), searchParams: Promise.resolve({}) });
  render(result);
  expect(screen.getByRole("heading", { name: "レシピ1" })).toBeInTheDocument();
});

test("最新バージョンが表示される", async () => {
  const result = await RecipesDetail({ params: Promise.resolve({ id: "2" }), searchParams: Promise.resolve({}) });
  render(result);
  expect(screen.getByText("バター")).toBeInTheDocument();
  expect(screen.queryByText("油")).not.toBeInTheDocument();
});
