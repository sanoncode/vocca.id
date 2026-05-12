"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Plus } from "lucide-react";


const CreateButtonSideBar = () => {


  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="hover:border-black dark:hover:border-white" variant={'outline'} size={"sm"}>
            <Plus
              size={ICON_SIZE}
            /> 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem className="flex gap-2" value={'chat'}>
            <MessageSquare size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>New Chat</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value={'group'}>
            <MessageSquare size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>New Group</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateButtonSideBar ;
