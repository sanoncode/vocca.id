import NewRoomButton from "@/components/new-room-button"

const Page =  () => {
  return (
    
    <div className="flex flex-col items-center h-full justify-center">
      <div className="text-center max-w-xl flex flex-col items-center">
            <h2 className="text-5xl font-extrabold text-gray-950 mb-4 leading-tight">
              Welcome, IRSAN ! ✨
            </h2>
            <p className="text-2xl font-bold text-gray-950 mb-12">
              Select a room or create new one. 🏠
            </p>

            <NewRoomButton title={'Create New Room'}/>
         
          </div>
    </div>
   
  )
}
export default Page