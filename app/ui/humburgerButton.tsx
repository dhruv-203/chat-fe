import { GrClose } from "react-icons/gr";
import { IoMenu } from "react-icons/io5";
interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}
const HamburgerButton = ({ isOpen, onToggle }: HamburgerButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className=" p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 "
    >
      {isOpen ? (
        <GrClose size={24} className="text-white" />
      ) : (
        <IoMenu size={24} className="text-white" />
      )}
    </button>
  );
};

export default HamburgerButton;
