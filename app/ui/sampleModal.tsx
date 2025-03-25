"use client";
import { useAppContext } from "@/app/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const IncomingCallModal = () => {
  const { incomingCall, setIncomingCall } = useAppContext();
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // Show modal when incoming call is set
    if (incomingCall) {
      setIsVisible(true);
      setTimeRemaining(30);
      // Timer to auto-reject after 30 seconds
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleReject();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval on unmount or when call changes
      return () => clearInterval(timer);
    }
  }, [incomingCall]);

  const handleAccept = () => {
    if (incomingCall) {
      incomingCall.answer("ACCEPTED");
      setIncomingCall(null);
      setIsVisible(false);
      router.push(`/pages/VideoCall/${incomingCall.channelName}`);
    }
  };

  const handleReject = () => {
    if (incomingCall) {
      incomingCall.answer("REJECTED");
      setIncomingCall(null);
      setIsVisible(false);
    }
  };

  if (!isVisible || !incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
        <div className="mb-4">
          {incomingCall.senderProfilePicture ? (
            <img
              src={incomingCall.senderProfilePicture}
              alt={incomingCall.senderName || "Caller"}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-600 text-3xl">
                {incomingCall.senderName ? incomingCall.senderName[0] : "?"}
              </span>
            </div>
          )}
          <h2 className="text-xl font-bold mb-2">
            {incomingCall.senderName || "Incoming Call"}
          </h2>
          <p className="text-gray-600 mb-4">
            Calling via {incomingCall.channelName}
          </p>
          <div className="text-lg font-semibold text-gray-700 mb-4">
            Time Remaining: {timeRemaining} seconds
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
