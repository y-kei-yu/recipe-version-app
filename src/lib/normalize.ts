// 差分に関係ない違いを消すため、保存前に材料・手順に使う
export default function normalizeText(text: string): string {
  // windowsの場合
  const crlfReplaced: string = text.replaceAll("\r\n", "\n");

  // 古いMac OS（Mac OS 9以前）
  const crReplaced: string = crlfReplaced.replaceAll("\r", "\n");

  // 行ごとに分けて、前後の空白を消す
  const lines = crReplaced.split("\n");
  const trimmedLines = lines.map((line) => line.trim());

  // 空の行を取り除く
  const nonEmptyLines = trimmedLines.filter(
    (trimmedLine) => trimmedLine !== "",
  );

  // 保存のために1つの文字列に戻す
  const normalizedText = nonEmptyLines.join("\n");

  return normalizedText;
}
