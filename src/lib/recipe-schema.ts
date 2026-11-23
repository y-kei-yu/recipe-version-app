import { z } from "zod";
import normalizeText from "./normalize";

export const recipeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "レシピ名を入力してください" })
    .max(100, { error: "レシピ名は100文字以内で入力してください" }),
  description: z
    .string()
    .trim()
    .max(500, { error: "説明は500文字以内で入力してください" })
    .transform((value) => (value === "" ? undefined : value)),
  ingredients: z
    .string()
    .overwrite(normalizeText)
    .min(1, { error: "材料を入力してください" })
    .max(2000, { error: "材料は2000文字以内で入力してください" }),
  steps: z
    .string()
    .overwrite(normalizeText)
    .min(1, { error: "手順を入力してください" })
    .max(5000, { error: "手順は5000文字以内で入力してください" }),
});
