import MenuSidebar from "@/components/chat/menu/menu-sidebar";
import SideBar from "@/components/chat/sidebar/side-bar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  
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