import { SideBarSectionProps } from "@/constants/types/props";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react'

const SideBarSection = ({
  title,
  defaultOpen = true,
  children,
  length,
  icon
}: SideBarSectionProps) => {
    const [open, setOpen] = useState(defaultOpen);

  return (
     <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <button className="w-full flex items-center justify-between py-3 text-sm font-medium">
          <div className="flex items-center gap-3">
            <div className="">{icon}</div>
            <span>{title}</span>
            <span>({length})</span>
          </div>
          {open ? (
            <ChevronDown className="w-4 h-4 " />
          ) : (
            <ChevronRight className="w-4 h-4 " />
          )}
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="space-y-2">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default SideBarSection