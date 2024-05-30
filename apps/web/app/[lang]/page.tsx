export default function Page({
  params: { lang },
}: {
  params: { lang: string };
}): JSX.Element {
  return (
    <main className="p-4">
      <p>{lang}</p>
      <p className="text-5xl font-light">Radio Canada Light</p>
      <p className="text-5xl font-normal">Radio Canada Normal</p>
      <p className="text-5xl font-medium">Radio Canada Medium</p>
      <p className="text-5xl font-semibold">Radio Canada Semibold</p>
      <p className="text-5xl font-bold">Radio Canada Bold</p>
      <p className="text-5xl font-light italic">Radio Canada Light Italic</p>
      <p className="text-5xl font-normal italic">Radio Canada Normal Italic</p>
      <p className="text-5xl font-medium italic">Radio Canada Medium Italic</p>
      <p className="text-5xl font-semibold italic">
        Radio Canada Semibold Italic
      </p>
      <p className="text-5xl font-bold italic">Radio Canada Bold Italic</p>
      <p className="text-5xl font-light font-condensed">
        Radio Canada Light Condensed
      </p>
      <p className="text-5xl font-normal font-condensed">
        Radio Canada Normal Condensed
      </p>
      <p className="text-5xl font-medium font-condensed">
        Radio Canada Medium Condensed
      </p>
      <p className="text-5xl font-semibold font-condensed">
        Radio Canada Semibold Condensed
      </p>
      <p className="text-5xl font-bold font-condensed">
        Radio Canada Bold Condensed
      </p>
      <p className="text-5xl font-light italic font-condensed">
        Radio Canada Light Italic Condensed
      </p>
      <p className="text-5xl font-normal italic font-condensed">
        Radio Canada Normal Italic Condensed
      </p>
      <p className="text-5xl font-medium italic font-condensed">
        Radio Canada Medium Italic Condensed
      </p>
      <p className="text-5xl font-semibold italic font-condensed">
        Radio Canada Semibold Italic Condensed
      </p>
      <p className="text-5xl font-bold italic font-condensed">
        Radio Canada Bold Italic Condensed
      </p>
    </main>
  );
}
