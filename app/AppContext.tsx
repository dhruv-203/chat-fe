"use client";
import { User } from "@/utils/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import io, { Socket } from "socket.io-client";
import IncomingCallModal from "./ui/sampleModal";
// Define interface for the Provider props
interface AppProviderProps {
  children: ReactNode;
}

interface IncomingCallDetails {
  senderId: string;
  channelName: string;
  senderName?: string;
  senderProfilePicture?: string;
  answer: (response: "ACCEPTED" | "REJECTED") => void;
}

const AppContext = createContext<{
  user: User | null;
  updateUser: (user: User | null) => void;
  socket: Socket | null;
  connectedUsers: { profilePicture: string; name: string; id: string }[];
  allUsers: User[];
  incomingCall: IncomingCallDetails | null;
  setIncomingCall: (incomingCall: IncomingCallDetails | null) => void;
}>({
  user: null,
  updateUser: () => {},
  socket: null,
  connectedUsers: [],
  allUsers: [],
  incomingCall: null,
  setIncomingCall: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [incomingCall, setIncomingCall] = useState<IncomingCallDetails | null>(
    null
  );
  useEffect(() => {
    const sock = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      withCredentials: true,
    });
    setSocket(sock);
    sock.on("userConnected", (data: User[]) => {
      if (data && data.length > 0) {
        setConnectedUsers([...data]);
      } else {
        setConnectedUsers([]);
      }
    });
    sock.on("new user registered", async () => {
      await getAllUsers();
    });

    sock.on("incomingCall", (callDetails: IncomingCallDetails, callback) => {
      // Set the incoming call details to trigger modal
      setIncomingCall({
        ...callDetails,
        answer: (response: "ACCEPTED" | "REJECTED") => callback(response),
      });
    });

    return () => {
      sock.close();
      setSocket(null);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      getAllUsers();
    }
  }, [user]);

  const updateUser = (user: User | null) => {
    setUser(user);
  };

  async function getAllUsers() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/getAllUsers`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    if (resData.statusCode === 200) {
      setAllUsers(resData.data);
    } else {
      console.log("Error in fetching all users");
      toast.error("Error in fetching all users");
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        socket,
        connectedUsers,
        allUsers,
        incomingCall,
        setIncomingCall: (callDetails: IncomingCallDetails | null) => {
          setIncomingCall(incomingCall);
        },
      }}
    >
      {children}
      <IncomingCallModal />
    </AppContext.Provider>
  );
};
