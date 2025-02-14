"use client";
import { useRouter } from "next/navigation";

export default function OtazkaButton({ index }: any) {
  const router = useRouter();
  function handleClick() {
    router.push(`/cs/otazky/${index}`);
  }
  return (
    <button className="block bg-blue-600 p-4 text-white" onClick={handleClick}>
      Go to question
    </button>
  );
}
