import '@repo/design-system/styles';
import '@repo/design-system/themes/theme-default';
import type { Metadata } from 'next';
import English from '../i18n/en.json';
import Albanian from '../i18n/sq.json';
import ServerIntlProvider from './serverIntlProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kalkulatori zgjedhor',
  description: 'Kalkulatori zgjedhor është një projekt i organizatës jofitimprurëse KohoVolit.eu, në bashkëpunim me Faktoje, dhe është një ndihmës i paanshëm në vendimin tuaj se kë të votoni.',
};

const locale = 'sq';

const messages = {
  en: English,
  sq: Albanian,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerIntlProvider defaultLocale={locale} locale={locale} messages={messages[locale]}>
      <html lang={locale}>
        <head>
          <script defer data-domain="kalkulatorizgjedhor.al" src="/js/script.tagged-events.outbound-links.js" />
        </head>
        <body>
          <main className="relative grid h-screen p-4">{children}</main>
        </body>
      </html>
    </ServerIntlProvider>
  );
}
