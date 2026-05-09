import React from 'react'

interface LayoutSideBarProps {
    children: React.ReactNode
    title: string,
    buttonTitle: string,
}


const LayoutSideBar = ({children,title,buttonTitle}: LayoutSideBarProps) => {
  return (
      <aside className="w-[360px] border-r flex flex-col">
      
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{title}</h1>

          <button className="px-4 py-2 rounded-xl border hover:bg-white/5 transition">
            {buttonTitle}
          </button>
        </div>

        <input
          placeholder="Search..."
          className="mt-6 w-full rounded-xl bg-white/5 border px-4 py-3 outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
       {children}
      </div>
    </aside>
  )
}

export default LayoutSideBar
