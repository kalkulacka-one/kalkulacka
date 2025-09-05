import { Button } from "@repo/design-system/client";
import { useRouter } from "next/navigation";

export function QuestionPage({
  current,
  navigationNextPath,
  navigationPreviousPath,
  navigationReviewPath,
}: {
  current: number;
  navigationNextPath: (current: number) => Promise<string>;
  navigationPreviousPath: (current: number) => Promise<string>;
  navigationReviewPath: () => Promise<string>;
}) {
  const router = useRouter();

  const handleNavigationNextClick = async () => {
    const path = await navigationNextPath(current);
    router.push(path);
  };

  const handleNavigationPreviousClick = async () => {
    const path = await navigationPreviousPath(current);
    router.push(path);
  };

  const handleNavigationReviewClick = async () => {
    const path = await navigationReviewPath();
    router.push(path);
  };

  return (
    <div>
      <h2>Otázka</h2>
      <p>current:{current}</p>
      <Button onClick={handleNavigationNextClick}>Další otázka</Button>
      <Button onClick={handleNavigationPreviousClick}>Předchozí otázka</Button>
      <Button onClick={handleNavigationReviewClick}>Rekapitulace</Button>
    </div>
  );
}
