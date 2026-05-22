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
            {/* <button className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-3 text-lg hover:bg-blue-700 transition duration-150">
              <Plus className="w-6 h-6" />
              CREATE A NEW ROOM
            </button> */}
          </div>
        {/* <div className="opacity-20">
          <Image 
          src={'/blank.svg'}
          width="300"
          height="300"
          alt='blank'
          loading="eager"
          className="dark:invert"
          />
          </div> */}
    </div>
   
  )
}
export default Page