"use client";

import { useSearchParams } from "next/navigation";

export default function Messages() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  return (
    <>
      {error && (
        <p className="p-4 rounded-md border bg-red-200 border-red-300 text-gray-800 text-center text-sm">
          {error}
        </p>
      )}
      {message && (
        <p className="p-4 rounded-md border bg-green-200 border-green-300 text-gray-800 text-center text-sm">
          {message}
        </p>
      )}
    </>
  );
}
