import Logo from './Logo';
import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import AuthButtons from './AuthButtons';

export default function Navbar() {
  return (
    <nav>
      <div className="w-full px-6 bg-[#0e0f14]">
        <div className="flex items-center h-16">
          <Logo />
          <NavLinks />
          <SearchBar />
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
