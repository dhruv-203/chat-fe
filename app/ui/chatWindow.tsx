"use client";
import { fetchChatData } from "@/utils/fetchChatData";
import { MessageType } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoVideocam } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAppContext } from "../AppContext";
import ChatInputContainer from "./chatInputContainer";
import CircleDiv from "./circleDiv";
import Message from "./message";
import UsernameDiv from "./usernameDiv";
const ChatWindow = ({
  className,
  receiver,
}: {
  className: string;
  receiver: { id: string; name: string; profilePicture: string } | null;
}) => {
  const { connectedUsers, user, socket } = useAppContext();
  const [chatData, setChatData] = useState<MessageType[]>([]);
  const updateChatData = (message: MessageType) => {
    setChatData((prev) => [...prev, message]);
  };
  const chatDisplayRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  };
  const recieveMessages = (message: MessageType) => {
    setChatData((prev) => [...prev, message]);
  };
  const isActive = connectedUsers.some((con) => con.id === receiver?.id);
  const router = useRouter();
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  useEffect(() => {
    const temp = async () => {
      if (receiver && user) {
        const res = await fetchChatData(receiver.id, user.id);
        if (res.statusCode === 200) {
          setChatData([...res.data]);
        } else {
          toast.error("Error fetching chats");
        }
      }
    };
    temp();
  }, [receiver, user]);
  useEffect(() => {
    if (socket) {
      socket.on("SendMessage", recieveMessages);
    }
    return () => {
      socket?.off("SendMessage", recieveMessages);
    };
  }, [socket]);
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {receiver && user ? (
        <>
          {/* Top username bar - fixed height */}
          <div className="flex items-center gap-4 px-6 py-3 bg-slate-400 bg-opacity-20 backdrop-blur-lg">
            <CircleDiv
              height="h-12"
              width="w-12"
              imgSrc={receiver?.profilePicture} //Note: change the profile picture to sender currently it is set to the current user
              className=""
            />
            <UsernameDiv className="" isActive={isActive}>
              {receiver.name}
            </UsernameDiv>
            {isActive && (
              <div className="absolute end-10">
                <IoVideocam
                  onClick={async () => {
                    if (user) {
                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/videoCall?receiverId=${receiver.id}`,
                          {
                            credentials: "include",
                          }
                        );
                        const resData = await res.json();
                        if (resData.data.pickedUp) {
                          router.push(
                            `/pages/VideoCall/${resData.data.channelName}`
                          );
                        } else {
                          toast.error("Rejected the call");
                        }
                      } catch (error) {
                        toast.error("error occured");
                        console.log(error);
                      }
                    }
                  }}
                  className="size-7 hover:cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Messages container - flexible height with scroll */}
          <div
            ref={chatDisplayRef}
            className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4"
          >
            {chatData.length > 0 ? (
              chatData.map((val, ind) => {
                if ([val.receiverId, val.senderId].includes(receiver.id)) {
                  return <Message key={ind} message={val} />;
                }
              })
            ) : (
              <div className="text-center h-full flex items-center justify-center p-7 ">
                <span className="bg-gray-800 font-bold text-white text-2xl p-5 ">
                  No messages yet send a message to start conversation
                </span>
              </div>
            )}
          </div>

          {/* Input container - fixed height */}
          <div className="mt-auto">
            <ChatInputContainer
              className=""
              updateChatData={updateChatData}
              receiver={{ ...receiver }}
              receiverID={receiver.id}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-7 bg-gray-800 font-bold text-white text-2xl">
            Select a user to chat with
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
