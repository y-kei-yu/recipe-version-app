export default function RecipeCreate() {
  return (
    <>
      <h1>レシピ作成</h1>
      <form>
        <div>
          <label htmlFor="title">レシピ名</label>
          <input id="title" name="title" />
        </div>
        <div>
          <label htmlFor="description">説明</label>
          <textarea id="description" name="description" />
        </div>
        <div>
          <label htmlFor="ingredients">材料</label>
          <textarea id="ingredients" name="ingredients" />
        </div>
        <div>
          <label htmlFor="steps">手順</label>
          <textarea id="steps" name="steps" />
        </div>

        <button>作成する</button>
      </form>

    </>
  );
}
