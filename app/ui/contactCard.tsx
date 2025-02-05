import { User } from "@/utils/types";
import CircleDiv from "./circleDiv";
import UsernameDiv from "./usernameDiv";

function ContactCard({
  className,
  user,
  isActive,
  receiver,
  handleSelectReceiver,
}: {
  className: string;
  user: User;
  isActive?: boolean;
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
}) {
  return (
    <div
      className={`p-4 cursor-pointer ${
        receiver?.id === user.id
          ? "bg-gray-800 border-2 border-gray-600"
          : "bg-gray-600"
      } rounded-lg flex gap-4 justify-start items-center ${className}`}
      onClick={() => {
        handleSelectReceiver({
          id: user.id,
          name: user.name,
          profilePicture: user.profilePicture,
        });
      }}
    >
      <CircleDiv
        className=""
        height="h-12"
        width="w-12"
        imgSrc={user.profilePicture}
      />
      <UsernameDiv className="p-2" isActive={isActive}>
        {user.name}
      </UsernameDiv>
    </div>
  );
}

export default ContactCard;
