import normalizeText from "@/lib/normalize";
import { describe, expect, test } from "vitest";

describe("正規化のテスト", () => {
  test("Windows の改行（CRLF）が LF になる", () => {
    expect(normalizeText("玉ねぎ\r\nにんじん")).toBe("玉ねぎ\nにんじん");
  });
  test("古いマック の改行（CR）が LF になる", () => {
    expect(normalizeText("玉ねぎ\rにんじん")).toBe("玉ねぎ\nにんじん");
  });
  test("行の前後の空白が消え、途中の空白は残る", () => {
    expect(normalizeText(" 玉ねぎ 1個 ")).toBe("玉ねぎ 1個");
  });
  test("空行（空白だけの行も）が消える", () => {
    expect(normalizeText("玉ねぎ\n\n \nにんじん")).toBe("玉ねぎ\nにんじん");
  });
});
