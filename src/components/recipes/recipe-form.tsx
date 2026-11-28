"use client";

import { createRecipe } from "@/app/recipes/actions";
import { RecipeFormState } from "@/lib/types";
import { useActionState } from "react";

const initialState: RecipeFormState = {
  errors: {},
  values: {
    title: "",
    description: "",
    ingredients: "",
    steps: ""
  }
};

export default function RecipeForm() {
  const [state, formAction, isPending] = useActionState(createRecipe, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">レシピ名</label>
        <input id="title" defaultValue={state.values.title} name="title" />
        {state.errors.title && (
          <ul>
            {/* Zod は、1つの項目のエラーをいつも配列で返すからmapにする*/}
            {state.errors.title.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label htmlFor="description">説明</label>
        <textarea id="description" defaultValue={state.values.description} name="description" />
        {state.errors.description && (
          <ul>
            {state.errors.description.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label htmlFor="ingredients">材料</label>
        <textarea id="ingredients" defaultValue={state.values.ingredients} name="ingredients" />
        {state.errors.ingredients && (
          <ul>
            {state.errors.ingredients.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label htmlFor="steps">手順</label>
        <textarea id="steps" defaultValue={state.values.steps} name="steps" />
        {state.errors.steps && (
          <ul>
            {state.errors.steps.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" disabled={isPending}>作成する</button>
    </form>
  );
}
