"use client";
import { Role, RtcTokenBuilder } from "@/utils/RTCTokenBuilder";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiVideo, BiVideoOff } from "react-icons/bi";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { IoCallSharp } from "react-icons/io5";
import { useAppContext } from "../AppContext";

export const VideoCalling = ({ channelName }: { channelName: string }) => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <Basics channelName={channelName} />
    </AgoraRTCProvider>
  );
};

const Basics = ({ channelName }: { channelName: string }) => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID as string;
  const [micOn, setMic] = useState(true);
  const appCertificate = process.env.NEXT_PUBLIC_AGORA_CERTI as string;
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAppContext();
  const router = useRouter();
  useEffect(() => {
    const temp = async () => {
      if (user) {
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const token = RtcTokenBuilder.buildTokenWithUid(
          appId,
          appCertificate,
          channelName,
          0,
          Role.PUBLISHER,
          currentTimestamp + 3600
        );
        if (token) {
          console.log("hello", token);
          setToken(token);
          setCalling(true);
        }
      }
    };
    temp();
  }, [user]);
  useJoin(
    {
      appid: appId,
      channel: channelName,
      token: token ? token : null,
    },
    calling
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 p-4">
        {isConnected && (
          <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local User Video */}
            <div className="relative rounded-lg overflow-hidden bg-gray-800 shadow-lg">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                playAudio={false}
                videoTrack={localCameraTrack}
                className="w-full h-fit object-cover"
              >
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white">
                  You
                </div>
              </LocalUser>
            </div>

            {/* Remote Users */}
            {remoteUsers.map((user) => (
              <div
                key={user.uid}
                className="relative rounded-lg overflow-hidden bg-gray-800 shadow-lg"
              >
                <RemoteUser
                  user={user}
                  className="w-full h-[300px] object-cover"
                >
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white">
                    User {user.uid}
                  </div>
                </RemoteUser>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      {isConnected && (
        <div className="bg-gray-800 p-6">
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={() => setMic((prev) => !prev)}
              className={`p-4 rounded-full ${
                micOn
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-red-600 hover:bg-red-700"
              } transition-colors`}
            >
              {micOn ? (
                <BsMicFill className="w-6 h-6 text-white" />
              ) : (
                <BsMicMuteFill className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={() => setCamera((prev) => !prev)}
              className={`p-4 rounded-full ${
                cameraOn
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-red-600 hover:bg-red-700"
              } transition-colors`}
            >
              {cameraOn ? (
                <BiVideo className="w-6 h-6 text-white" />
              ) : (
                <BiVideoOff className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={() => {
                setCalling((prev) => !prev);
                router.back();
              }}
              className={`p-4 rounded-full ${
                calling
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              } transition-colors`}
            >
              <IoCallSharp className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCalling;
