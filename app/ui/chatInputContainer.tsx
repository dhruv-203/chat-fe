"use client";
import { sendMessage } from "@/utils/sendMessage";
import { MessageType } from "@/utils/types";
import { useState } from "react";
import { toast } from "react-toastify";

function ChatInputContainer({
  className,
  receiver,
  updateChatData,
  receiverID,
}: {
  className: string;
  receiverID: number;
  receiver: {
    id: number;
    name: string;
    profilePicture: string;
  };
  updateChatData: (message: MessageType) => void;
}) {
  const [message, setMessage] = useState("");
  const handleSendMessage = async () => {
    if (message && receiverID === receiver.id) {
      const resData = await sendMessage(message, receiver.id);
      if (resData.data.success) {
        updateChatData(resData.data.data);
        setMessage("");
      } else {
        console.log(resData);
        toast.error("Something went wrong check console");
      }
    } else {
      toast.error("Message can't be empty");
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
      className={`w-full flex gap-3 p-3 ${className}`}
    >
      <input
        type="text"
        name="message"
        className="basis-3/4 rounded-lg bg-gray-800 px-4 py-2 text-white outline-none"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className=" basis-1/4 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 font-semibold"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInputContainer;
