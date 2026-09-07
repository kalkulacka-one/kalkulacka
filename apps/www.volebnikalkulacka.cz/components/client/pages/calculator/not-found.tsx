import { useRouter } from "next/navigation";

import { NotFoundPage as AppNotFoundPage } from "@/calculator";

export function NotFoundPage() {
  const router = useRouter();

  const handleOnBackHomeClick = () => {
    router.push("/");
  };
  return <AppNotFoundPage onBackHomeClick={handleOnBackHomeClick} />;
}
