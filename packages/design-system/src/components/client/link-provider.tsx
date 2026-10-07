import { type ComponentPropsWithRef, type ComponentType, createContext, type ReactNode, useContext } from "react";

export type LinkComponent = ComponentType<ComponentPropsWithRef<"a"> & { href: string }>;

function Anchor(props: ComponentPropsWithRef<"a">) {
  return <a {...props} />;
}

const LinkContext = createContext<LinkComponent>(Anchor);

// Lets the app render links with its router's link (e.g. Next's `Link`) without the design system depending on it.
export function LinkProvider({ component, children }: { component: LinkComponent; children: ReactNode }) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>;
}

export function useLinkComponent(): LinkComponent {
  return useContext(LinkContext);
}
