import { Layout } from "@/components/layout";

type AppLayoutBody = {
  children: React.ReactNode;
};

function AppLayoutComponent({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

AppLayoutComponent.displayName = "AppLayout";

function Body({ children }: AppLayoutBody) {
  return <>{children}</>;
}

Body.displayName = "AppLayout.Body";

export const AppLayout = Object.assign(AppLayoutComponent, {
  Header: Layout.Header,
  Body,
  Content: Layout.Content,
  BottomNavigation: Layout.BottomNavigation,
  Footer: Layout.Footer,
});
