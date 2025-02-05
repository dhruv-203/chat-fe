"use client";
import { fetchChatData } from "@/utils/fetchChatData";
import { MessageType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
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
  receiver: { id: number; name: string; profilePicture: string } | null;
}) => {
  const { connectedUsers, user, socket } = useAppContext();
  //   {
  //     id: 1,
  //     senderId: 1,
  //     receiverId: 2,
  //     message: "Hello, how are you?",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 2,
  //     senderId: 2,
  //     receiverId: 1,
  //     message: "I am fine, thank you!",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 3,
  //     senderId: 1,
  //     receiverId: 2,
  //     message: "What are you doing?",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 4,
  //     senderId: 2,
  //     receiverId: 1,
  //     message: "I am working on a project, what about you?",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 5,
  //     senderId: 1,
  //     receiverId: 2,
  //     message: "I am doing well, thanks!",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 6,
  //     senderId: 2,
  //     receiverId: 1,
  //     message: "What you will eat today?",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 7,
  //     senderId: 1,
  //     receiverId: 2,
  //     message: "I will eat pizza, thanks!",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 8,
  //     senderId: 1,
  //     receiverId: 2,
  //     message: "What about you?",
  //     date: "2023-03-01 10:00:00",
  //   },
  //   {
  //     id: 9,
  //     senderId: 2,
  //     receiverId: 1,
  //     message: "I will eat sushi, thanks!",
  //     date: "2023-03-01 10:00:00",
  //   },
  // ];
  const [chatData, setChatData] = useState<MessageType[]>([]);
  const updateChatData = (message: MessageType) => {
    setChatData((prev) => [...prev, message]);
    console.log(chatData);
  };
  const chatDisplayRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  };

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
          console.log(res);
          toast.error("Error fetching chats");
        }
      }
    };
    temp();
  }, [receiver, user]);
  useEffect(() => {
    if (socket) {
      socket.on("SendMessage", (message: MessageType) => {
        console.log("Message: ", message);
        setChatData((prev) => [...prev, message]);
      });
    }
    return () => {
      socket?.off("SendMessage", (message: MessageType) => {
        console.log("Message: ", message);
        setChatData((prev) => [...prev, message]);
      });
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
            <UsernameDiv
              className=""
              isActive={connectedUsers.some((con) => con.id === receiver.id)}
            >
              {receiver.name}
            </UsernameDiv>
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
