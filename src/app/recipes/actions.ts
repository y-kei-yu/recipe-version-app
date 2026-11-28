"use server";

import prisma from "@/lib/prisma";
import { recipeSchema } from "@/lib/recipe-schema";
import { RecipeFormState } from "@/lib/types";
import { redirect } from "next/navigation";
import { z } from "zod";

// Server Action
export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData,
) {
  // フォームから値を取り出して、文字列にしてまとめる
  const values = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    ingredients: String(formData.get("ingredients") ?? ""),
    steps: String(formData.get("steps") ?? ""),
  };

  // zodチェック
  const result = recipeSchema.safeParse(values);

  // バリデーションエラーならエラーと入力内容を返す
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors, values };
  }

  // DB登録
  const createdRecipe = await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        latestVersionNumber: 1,
      },
    });

    await tx.recipeVersion.create({
      data: {
        recipeId: recipe.id,
        versionNumber: 1,
        ingredients: result.data.ingredients,
        steps: result.data.steps,
      },
    });

    return recipe;
  });

  redirect(`/recipes/${createdRecipe.id}`);
}
