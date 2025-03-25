// "use client";
import VideoCalling from "@/app/ui/videoCall";
async function Page({ params }: { params: Promise<{ channelName: string }> }) {
  const { channelName } = await params;
  // const { user } = useAppContext();
  //generate a function to create a 5 character alphanumeric string
  
  return (
    <div className="h-screen w-screen">
      <VideoCalling channelName={channelName} />
    </div>
  );
}

export default Page;
