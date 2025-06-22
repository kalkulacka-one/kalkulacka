import { type IntlConfig, IntlProvider as ReactIntlProvider } from "react-intl";

type IntlProvider = {
  children: React.ReactNode;
} & IntlConfig;

export function IntlProvider({ children, ...props }: IntlProvider) {
  return <ReactIntlProvider {...props}>{children}</ReactIntlProvider>;
}
