import MenuLogo from './menu-logo';
import MenuLinks from './menu-links';
import MenuProfileStub from './menu-profile-stub';

export default function Menu() {
  return (
    <div className="h-full relative">
      <div className="sticky top-0 w-full bg-macMaroon h-screen p-6 flex flex-col">
        <MenuLogo />

        <MenuLinks />

        <MenuProfileStub />
      </div>
    </div>
  );
}
