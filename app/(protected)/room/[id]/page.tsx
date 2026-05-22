import ChatRoom from "@/components/room/chat-room";

type props = {
  params:{
    id: string
  }
}

async function Page({ params }: props) { 
  const { id } = await params;

  return <ChatRoom roomId={id} />

}
export default Page









