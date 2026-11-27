"use server";

import prisma from "@/lib/prisma";
import { recipeSchema } from "@/lib/recipe-schema";

export async function createRecipe(formData: FormData) {
  const result = recipeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    ingredients: formData.get("ingredients"),
    steps: formData.get("steps"),
  });
  if (!result.success) {
    return;
  }

  await prisma.$transaction(async (tx) => {
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
  });

}
