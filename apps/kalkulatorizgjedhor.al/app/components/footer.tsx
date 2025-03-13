import { Footer as BaseFooter } from "@repo/design-system/ui";
import { FaktojeLogo } from "../svg/faktoje-logo";

const footerText = {
  default: "Krijuar në bashkëpunim me organizatat jofitimprurëse.", // Albanian
  en: "Created in collaboration with non-profit organizations.",
  cs: "Vytvořeno spoluprací neziskových organizací."
};

const additionalOrganizations = [{
  logo: FaktojeLogo,
  href: "https://faktoje.al",
  width: "96px",
  height: "20px"
}];

export function Footer({ lang = 'default' }: { lang?: string }) {
  return (
    <BaseFooter 
      text={footerText[lang as keyof typeof footerText]}
      additionalOrgs={additionalOrganizations}
    />
  );
} 