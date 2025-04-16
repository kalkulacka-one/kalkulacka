import { LogoText } from '@repo/design-system/components';
import { Logo } from '@repo/design-system/svg';

export function LogoWrapper() {
  return (
    <div className="ko:flex ko:items-center" style={{ gridArea: 'logo' }}>
      <Logo className="ko:h-5 ko:w-[5.953rem]" />
      <div className="ko:ml-[0.563rem] ko:hidden ko:sm:block">
        <LogoText>Volební kalkulačka</LogoText>
      </div>
    </div>
  );
}
