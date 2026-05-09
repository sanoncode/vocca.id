import MenuSidebar from "@/components/chat/menu/menu-sidebar";
import SideBar from "@/components/chat/sidebar/side-bar";

export default function ProtectedLayout({
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
      <div className="h-full flex items-center justify-center">

        {children}
        {/* <div className="opacity-30">
          <Image 
          src={'/blank.svg'}
          width={300}
          height={300}
          alt='blank'
          loading="eager"
          className="dark:invert"
          />
        </div> */}
      </div>

    </section>

  </div>
</main>
  );
}