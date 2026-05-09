import React from 'react'
import SideButtons from './side-buttons'

const MenuSidebar = () => {
  return (
    <aside className="w-[72px] border-r  flex flex-col justify-between items-center py-4">
      <SideButtons />
    </aside>
  )
}

export default MenuSidebar
