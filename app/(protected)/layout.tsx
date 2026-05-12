import Sidebar from "@/components/chat/sidebar/side-bar";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Left Mini Sidebar */}
        {/* <MenuSidebar /> */}

        {/* Chat Sidebar */}
        <Suspense>
          <Sidebar />
        </Suspense>
        {/* Main Content */}
        <section className="flex-1 relative">{children}</section>
      </div>
    </main>
  );
}
