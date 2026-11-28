export type Recipe = {
  id: number;
  title: string;
  description: string | null;
  latestVersionNumber: number;
  updatedAt: Date;
};

export type RecipeVersion = {
  id: number;
  recipeId: number;
  versionNumber: number;
  ingredients: string;
  steps: string;
  changeMemo: string | null;
  rating: number | null;
  resultMemo: string | null;
  createdAt: Date;
};

export type RecipeFormState = {
  errors: {
    title?: string[];
    description?: string[];
    ingredients?: string[];
    steps?: string[];
  };
  values: {
    title: string;
    description: string;
    ingredients: string;
    steps: string;
  };
};
