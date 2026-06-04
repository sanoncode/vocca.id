"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { LeaveButtonProps } from "@/constants/types/props";
import { broadcastUser } from "@/services/supabase/client/chat-room-realtime";
import { leaveRoom } from "@/services/supabase/client/chat-room-services";
import { Loader2, SquareArrowRightExit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ChatLeaveRoomButton = ({ roomId, userId, userName }: LeaveButtonProps) => {

    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [leaveLoading, setLeaveLoading] = useState(false)

    const handleLeave = async () => {
        setLeaveLoading(true)
        const result = await leaveRoom(roomId, userId)
        if (result) {
            broadcastUser(roomId, userName,'LEAVE')
            setLeaveLoading(false)
            setOpen(false)
            router.push('/room')
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    className="hover:border-black dark:hover:border-white"
                    variant="destructive"
                    size="sm"
                >
                    <SquareArrowRightExit size={16} />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>↖️ Leave Room</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave this room?
                        You will no longer receive messages from this room unless someone invites you again.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleLeave}
                    >
                        {leaveLoading ? <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Leaving...
                        </> : 'Leave Room'}

                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChatLeaveRoomButton;
