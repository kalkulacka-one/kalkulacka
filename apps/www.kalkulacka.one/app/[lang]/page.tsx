import type { Metadata } from "next";
import Link from "next/link";
import getIntl from "../server/getIntl";

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const intl = await getIntl(lang);

  const intlTitle = intl.formatMessage({
    id: "home.page.metadata.title",
  });

  const intlDescription = intl.formatMessage({
    id: "home.page.metadata.description",
  });
  return {
    title: intlTitle ?? "Kalkulacka.1",
    description: intlDescription ?? "Ta pravá volební kalkulačka pro miliony voličů ve 4 zemích",
  };
}

export default async function Page({ params }: { params: Params }) {
  const { lang } = await params;
  const intl = await getIntl(lang);
  return (
    <section className="max-w-2xl grid gap-8">
      <section className="grid gap-2">
        <h2 className="text-2xl font-medium">
          {intl.formatMessage(
            {
              id: "home.page.title",
            },
            { span: (chunks) => <span className="font-bold">{chunks}</span> },
          )}
        </h2>
        <p>
          {intl.formatMessage(
            {
              id: "home.page.intro.p1",
            },
            {
              kohoVolitLink: (chunks) => (
                <a href="https://kohovolit.eu" className="underline hover:no-underline">
                  {chunks}
                </a>
              ),
              kalkulackaLink: (chunks) => (
                <a href="https://www.volebnikalkulacka.cz" className="underline hover:no-underline">
                  {chunks}
                </a>
              ),
            },
          )}
        </p>
        <p>
          {intl.formatMessage(
            {
              id: "home.page.intro.p2",
            },
            {
              ceskoDigitalLink: (chunks) => (
                <a href="https://cesko.digital" className="underline hover:no-underline">
                  {chunks}
                </a>
              ),
            },
          )}
        </p>
        <ul className="list-none pl-4">
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.czechia",
              },
              {
                link: (chunks) => (
                  <a href="https://www.volebnikalkulacka.cz" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
              },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.slovakia",
              },
              {
                link: (chunks) => (
                  <a href="https://www.volebnakalkulacka.sk" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
              },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.hungary",
              },
              {
                link: (chunks) => (
                  <a href="https://www.voksmonitor.hu" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
              },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.austria",
              },
              {
                link: (chunks) => (
                  <a href="https://www.wahlrechner.at" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
              },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.romania",
              },
              {
                link: (chunks) => (
                  <a href="https://www.testvot.eu" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
              },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.kosovo",
              },
              {
                link: (chunks) => (
                  <a href="https://www.kalkulatorizgjedhor.org" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
              },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.albania",
              },
              {
                link: (chunks) => (
                  <a href="https://www.kalkulatorizgjedhor.org" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
                span: (chunks) => <span className="inline-flex items-center ml-2 px-2 py-0.25 rounded-full text-sm font-medium bg-gray-200">{chunks}</span>,
              },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                id: "home.page.projects.northMacedonia",
              },
              {
                link: (chunks) => (
                  <a href="https://www.kalkulatorizgjedhor.org" className="font-bold underline hover:no-underline">
                    {chunks}
                  </a>
                ),
                span: (chunks) => <span className="inline-flex items-center ml-2 px-2 py-0.25 rounded-full text-sm font-medium bg-gray-200">{chunks}</span>,
              },
            )}
          </li>
        </ul>
        <p>
          {intl.formatMessage(
            {
              id: "home.page.p3",
            },
            {
              strong: (chunks) => <strong>{chunks}</strong>,
            },
          )}
        </p>
      </section>
      <section className="grid gap-2">
        <h2 className="text-2xl font-medium">
          {intl.formatMessage({
            id: "home.page.cta.title",
          })}
        </h2>
        <p>
          {intl.formatMessage(
            {
              id: "home.page.cta.p1",
            },
            {
              supportLink: (chunks) => (
                <Link href="/cs/podporte-kalkulacku" className="font-bold underline hover:no-underline">
                  {chunks}
                </Link>
              ),
              volunteerLink: (chunks) => (
                <Link href="/cs/zapojte-se" className="font-bold underline hover:no-underline">
                  {chunks}
                </Link>
              ),
            },
          )}
        </p>
      </section>
    </section>
  );
}
