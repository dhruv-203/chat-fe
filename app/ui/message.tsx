"use client";

import { MessageType } from "@/utils/types";
import { useAppContext } from "../AppContext";

export interface MessageProps {
  message: MessageType;
}
function Message({ message }: MessageProps) {
  const { user } = useAppContext();
  console.log(message.createdAt);
  return (
    <div
      key={message.id}
      className={`flex ${
        user?.id === message.senderId ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[220px] bg-white rounded-xl px-4 py-2 shadow">
        <div className="text-black">{message.message}</div>
        <div className="text-right text-xs text-gray-400 mt-1">
          {new Date(message.createdAt).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

export default Message;
