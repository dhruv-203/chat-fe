export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
  gender: "MALE" | "FEMALE";
}

export interface MessageType {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
}
