export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  gender: "MALE" | "FEMALE";
}

export interface MessageType {
  id: number;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}
