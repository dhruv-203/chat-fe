import HamburgerButton from "./humburgerButton";

function NavBar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`w-full p-3 items-center bg-slate-800 relative top-0 left-0 z-50 md:hidden flex justify-end`}
    >
      <HamburgerButton isOpen={isOpen} onToggle={onToggle} />
    </div>
  );
}

export default NavBar;
