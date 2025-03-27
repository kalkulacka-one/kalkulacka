import { Logo } from '@repo/design-system/svg';

export function Header() {
  return (
    <header className="ko:max-w-[100vw] ko:left-0 ko:sticky" style={{ gridArea: 'header' }}>
      <div
        className="ko:grid ko:grid-cols-[auto_auto_1fr] ko:gap-2 ko:xs:gap-4 ko:sm:gap-8 ko:w-full ko:items-center ko:p-2 ko:xs:p-4 ko:sm:p-8 ko:bg-transparent"
        style={{ gridTemplateAreas: `"logo title right"` }}
      >
        <div className="ko:flex ko:items-center" style={{ gridArea: 'logo' }}>
          <Logo className="ko:h-5 ko:w-[5.953rem]" />
          <div className="ko:ml-[0.563rem] ko:hidden ko:font-sans ko:text-[0.812rem] ko:font-bold ko:uppercase ko:sm:block">Volební kalkulačka</div>
        </div>
        <div style={{ gridArea: 'title' }}>{/* add title content later and refactor */}</div>
        <div className="ko:flex ko:items-start ko:justify-end" style={{ gridArea: 'right' }}>
          {/* right content later and refactor */}
        </div>
      </div>
    </header>
  );
}
