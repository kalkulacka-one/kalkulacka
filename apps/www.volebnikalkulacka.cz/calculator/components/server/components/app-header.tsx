import { AppHeader as ClientAppHeader } from "../../client/app-header";

export function AppHeader(props: React.ComponentProps<typeof ClientAppHeader>) {
  return <ClientAppHeader {...props} />;
}
