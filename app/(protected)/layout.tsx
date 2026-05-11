import MenuSidebar from "@/components/chat/menu/menu-sidebar";
import SideBar from "@/components/chat/sidebar/side-bar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login");
  }
  return (
    <main className="h-screen overflow-hidden">
      <div className="flex h-full">

        {/* Left Mini Sidebar */}
        <MenuSidebar />

        {/* Chat Sidebar */}
        <SideBar />

        {/* Main Content */}
        <section className="flex-1 relative">
          {children}
        </section>

      </div>
    </main>
  );
}