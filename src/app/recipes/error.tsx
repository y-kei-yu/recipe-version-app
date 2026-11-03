"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry
}: {
  error: Error & { digest?: string; };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>予期せぬエラーが発生しました！</h2>
      <button onClick={() => retry()}>
        もう一度試す
      </button>
    </div>
  );
}
