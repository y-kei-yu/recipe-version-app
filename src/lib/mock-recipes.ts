import { Recipe } from "./types";

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "レシピ1",
    description: "レシピ1の説明",
    latestVersionNumber: 1,
    updatedAt: new Date("2026-10-01T10:00:00"),
  },
  {
    id: 2,
    title: "レシピ2",
    description: null,
    latestVersionNumber: 2,
    updatedAt: new Date("2026-10-02T10:00:00"),
  },
];
