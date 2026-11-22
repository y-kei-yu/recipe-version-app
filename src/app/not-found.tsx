import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>ページが見つかりません</h1>
      <p>お探しのレシピは存在しないか、削除された可能性があります。</p>
      <Link href="/recipes">一覧へ</Link>
    </div>
  );
}
