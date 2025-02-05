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
// Define interface for the Provider props
interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<{
  user: User | null;
  updateUser: (user: User | null) => void;
  socket: Socket | null;
  connectedUsers: { profilePicture: string; name: string; id: number }[];
  allUsers: User[];
}>({
  user: null,
  updateUser: () => {},
  socket: null,
  connectedUsers: [],
  allUsers: [],
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
  useEffect(() => {
    const sock = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      withCredentials: true,
    });
    setSocket(sock);
    sock.on("userConnected", (data: User[]) => {
      console.log("Connected Users", data);
      if (data && data.length > 0) {
        setConnectedUsers([...data]);
      } else {
        setConnectedUsers([]);
      }
    });
    sock.on("new user registered", async () => {
      console.log("new user registered");
      await getAllUsers();
    });
    return () => {
      sock.close();
      setSocket(null);
    };
  }, [user]);

  useEffect(() => {
    getAllUsers();
  }, []);

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
      value={{ user, updateUser, socket, connectedUsers, allUsers }}
    >
      {children}
    </AppContext.Provider>
  );
};
