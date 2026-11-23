import { recipeSchema } from "@/lib/recipe-schema";
import { describe, expect, test } from "vitest";
import { z } from "zod";

const valid = {
  title: "カレー",
  description: "テスト",
  ingredients: "玉ねぎ",
  steps: "炒める",
};

describe("レシピ名のバリデーションテスト", () => {
  test("レシピ名が未入力の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.title).toEqual([
      "レシピ名を入力してください",
    ]);
  });

  test("レシピ名が空白のみの場合、エラーになる", () => {
    const result = recipeSchema.safeParse({ ...valid, title: " " });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.title).toEqual([
      "レシピ名を入力してください",
    ]);
  });

  test("レシピ名100文字の場合、成功する", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      title: "あ".repeat(100),
    });
    expect(result.success).toBe(true);
  });

  test("レシピ名101文字の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      title: "あ".repeat(101),
    });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.title).toEqual([
      "レシピ名は100文字以内で入力してください",
    ]);
  });
});

describe("説明のバリデーションテスト", () => {
  test("説明が空白のみの場合、値なしになる", () => {
    const result = recipeSchema.safeParse({ ...valid, description: " " });
    expect(result.success).toBe(true);
    expect(result.data?.description).toBeUndefined();
  });

  test("説明500文字の場合、成功する", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      description: "あ".repeat(500),
    });
    expect(result.success).toBe(true);
  });

  test("説明501文字の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      description: "あ".repeat(501),
    });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.description).toEqual([
      "説明は500文字以内で入力してください",
    ]);
  });
});

describe("材料のバリデーションテスト", () => {
  test("材料が未入力の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({ ...valid, ingredients: "" });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.ingredients).toEqual([
      "材料を入力してください",
    ]);
  });

  test("材料が空白や空行の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({ ...valid, ingredients: "\n \n" });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.ingredients).toEqual([
      "材料を入力してください",
    ]);
  });

  test("材料が2000文字の場合、成功する", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      ingredients: "あ".repeat(2000),
    });
    expect(result.success).toBe(true);
  });

  test("材料が2001文字の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      ingredients: "あ".repeat(2001),
    });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.ingredients).toEqual([
      "材料は2000文字以内で入力してください",
    ]);
  });
});

describe("手順のバリデーションテスト", () => {
  test("手順が未入力の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({ ...valid, steps: "" });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.steps).toEqual([
      "手順を入力してください",
    ]);
  });

  test("手順が空白、空行の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({ ...valid, steps: "\n \n" });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.steps).toEqual([
      "手順を入力してください",
    ]);
  });

  test("手順が5000文字の場合、成功する", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      steps: "あ".repeat(5000),
    });
    expect(result.success).toBe(true);
  });

  test("手順が5001文字の場合、エラーになる", () => {
    const result = recipeSchema.safeParse({
      ...valid,
      steps: "あ".repeat(5001),
    });
    expect(result.success).toBe(false);
    expect(z.flattenError(result.error!).fieldErrors.steps).toEqual([
      "手順は5000文字以内で入力してください",
    ]);
  });
});
