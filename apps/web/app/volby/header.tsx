type HeaderProps = {
  district?: string;
};

export default function Header({ district }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between bg-red-400 p-4">
      <span>Volební kalkulačka</span>
      {district && <span>{district}</span>}
    </header>
  );
}
