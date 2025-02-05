"use client";
import { logoutUser } from "@/utils/logoutUser";
import { TbLogout2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { useAppContext } from "../AppContext";
import CircleDiv from "./circleDiv";
import ContactCard from "./contactCard";
import UsernameDiv from "./usernameDiv";
interface SideBarProps {
  isOpen: boolean;
  className: string;
  receiver: {
    id: number;
    name: string;
    profilePicture: string;
  } | null;
  handleSelectReceiver: (user: {
    id: number;
    name: string;
    profilePicture: string;
  }) => void;
}
function SideBar({
  isOpen,
  className,
  receiver,
  handleSelectReceiver,
}: SideBarProps) {
  // Todo: Fetch the current user and the currently active users here to chat with them on the sidebar
  const {
    user: currentUser,
    updateUser,
    connectedUsers,
    allUsers,
  } = useAppContext();
  // console.log(connectedUsers);

  const handleLogout = async () => {
    const data = await logoutUser();
    if (data.statusCode === 200) {
      updateUser(null);
      toast.success("Logged out successfully!");
    } else {
      toast.error("Error logging out!");
    }
  };

  return (
    <div
      className={`w-full h-full bg-slate-800  ${
        isOpen ? "flex" : "hidden"
      }   bg-gray-800 text-white transform transition-transform duration-200 ease-in-out  ${
        isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-0"
      } ${className}`}
    >
      <div className="topBar flex p-5 font-semibold text-2xl  bg-gray-800 text-white">
        Registered Users
      </div>
      <div className="userList no-scrollbar flex-1 flex flex-col gap-3 p-3 overflow-y-scroll">
        {allUsers &&
          allUsers.map((val, ind) => {
            if (val.id === currentUser?.id) return null;
            return (
              <ContactCard
                className=""
                user={val}
                key={ind}
                receiver={receiver}
                isActive={connectedUsers.some((con) => con.id === val.id)}
                handleSelectReceiver={handleSelectReceiver}
              />
            );
          })}
      </div>
      <div className="bottom-bar relative bottom-0 left-0 p-3 flex justify-start gap-4 w-full align-center bg-gray-600 text-white">
        <div className="flex justify-start gap-4 flex-1 align-center">
          <CircleDiv
            className=""
            height="h-12"
            width="w-12"
            imgSrc={currentUser?.profilePicture}
          />
          <UsernameDiv className="p-2" isActive={true}>
            {currentUser?.name}
          </UsernameDiv>
        </div>
        <TbLogout2 className="h-8 w-8 self-center " onClick={handleLogout} />
      </div>
    </div>
  );
}

export default SideBar;
