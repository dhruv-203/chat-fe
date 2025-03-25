"use client";
import fetchUser from "@/utils/fetchUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import ChatWindow from "../ui/chatWindow";
import NavBar from "../ui/NavBar";
import SideBar from "../ui/sideBar";
import Spinner from "../ui/spinner";

const Homepage = () => {
  const router = useRouter();
  const { user, updateUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [receiver, setReceiver] = useState<{
    id: string;
    name: string;
    profilePicture: string;
  } | null>(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetchUser();
        if (res.statusCode === 200) {
          updateUser(res.data);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    }

    if (!user) {
      checkUser();
    } else {
      setIsLoading(false);
    }
  }, [user, updateUser, router]);

  if (isLoading) {
    return <Spinner />;
  }

  const onToggle = () => setIsOpen(!isOpen);
  const handleSelectReceiver = (user: {
    id: string;
    name: string;
    profilePicture: string;
  }) => {
    setReceiver(user);
    onToggle();
  };
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar isOpen={isOpen} onToggle={onToggle} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Fixed position on mobile, regular position on desktop */}
        <div
          className={`
            fixed md:relative
            inset-y-0 left-0
            transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 transition-transform duration-200 ease-in-out
            z-60 md:z-auto w-3/4 sm:w-1/2 lg:w-1/4 md:w-1/3 md:block
            ${isOpen ? "block" : "hidden"}
          `}
        >
          <SideBar
            className="md:flex flex-col"
            isOpen={isOpen}
            receiver={receiver}
            handleSelectReceiver={handleSelectReceiver}
          />
        </div>

        {/* Main chat area - Takes remaining width */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow className="h-full" receiver={receiver} />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isOpen && (
          <div
            className=" inset-0 bg-black bg-opacity-50 z-60 md:hidden"
            onClick={onToggle}
          />
        )}
      </div>
    </div>
  );
};

export default Homepage;
