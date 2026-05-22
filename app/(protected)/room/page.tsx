import NewRoomButton from "@/components/new-room-button"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react"

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const currentUserName = data.claims.user_metadata?.name

  return (<h2 className="text-5xl font-extrabold mb-4">
    Welcome, {currentUserName}✨
  </h2>)
}


const Page = () => {

  return (

    <div className="flex flex-col items-center h-full justify-center">
      <div className="text-center max-w-xl flex flex-col items-center">
        <Suspense>
          <UserDetails />
        </Suspense>
        <p className="text-2xl mb-8">
          Select a room or create new one. 🏠
        </p>

        <NewRoomButton title={'Create New Room'} />

      </div>
    </div>

  )
}
export default Page