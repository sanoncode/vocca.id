import Navbar from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen overflow-hidden bg-[#121212] text-white">
  <div className="flex h-full">

    {/* Left Mini Sidebar */}
    <aside className="w-[72px] border-r border-white/10 bg-black flex flex-col justify-between items-center py-4">
      
      <div className="flex flex-col gap-4">
        <button className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20 transition" />
        <button className="h-12 w-12 rounded-xl hover:bg-white/10 transition" />
        <button className="h-12 w-12 rounded-xl hover:bg-white/10 transition" />
      </div>

      <div className="flex flex-col gap-4">
        <button className="h-12 w-12 rounded-xl hover:bg-white/10 transition" />
        <button className="h-12 w-12 rounded-xl hover:bg-white/10 transition" />
      </div>
    </aside>

    {/* Chat Sidebar */}
    <aside className="w-[360px] border-r border-white/10 bg-[#0d0d0d] flex flex-col">
      
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Chats</h1>

          <button className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
            New
          </button>
        </div>

        <input
          placeholder="Search..."
          className="mt-6 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
      
      </div>
    </aside>

    {/* Main Content */}
    <section className="flex-1 relative bg-[#151515]">

      <Navbar />
      <div className="h-full flex items-center justify-center">
        <div className="opacity-30 text-xl">
          Select a chat
        </div>
      </div>

    </section>

  </div>
</main>
  );
}




  // <main className="min-h-screen flex flex-col items-center">
  //     <div className="flex-1 w-full flex flex-col gap-20 items-center">
  //     <Navbar />
  //       <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
  //         {children}
  //       </div>

  //       <Footer />
  //     </div>
  //   </main>