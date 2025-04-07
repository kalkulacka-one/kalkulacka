'use client';
import { type IntlConfig, IntlProvider } from 'react-intl';

type ServerIntlProviderProps = {
  children: React.ReactNode;
} & IntlConfig;

export default function ServerIntlProvider({ children, ...props }: ServerIntlProviderProps) {
  return <IntlProvider {...props}>{children}</IntlProvider>;
}
