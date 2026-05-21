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
import { deleteRoom } from "@/services/supabase/client/chat-room-services";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type deleteButtonProps = {
    roomId: string
}

const DeleteButton = ({roomId}: deleteButtonProps) => {

    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [deleteLoading, setdeleteLoading] = useState(false);

    const handleDelete = async () => {

            setdeleteLoading(true);
            const roomData = await deleteRoom(roomId);

            // Supabase .select() setelah delete mengembalikan array. 
            // Jika isi array-nya ada, berarti sukses terhapus!
            if (roomData && roomData.length > 0) {
                setOpen(false); // 1. TUTUP MODAL SECARA OTOMATIS
            }

            setdeleteLoading(false);
            router.push('/room') 
    
    };


    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (deleteLoading) return; 
                setOpen(value);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    className="hover:border-black dark:hover:border-white"
                    variant="destructive"
                    size="sm"
                >
                    <Trash2 size={16} />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>⚠️ Delete this room !</DialogTitle>
                    <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
                        This action cannot be undone. This will permanently delete the room, all message history, and remove all members.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant={'destructive'} onClick={handleDelete} disabled={deleteLoading}>
                        {deleteLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting... ⏳
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Permanently 
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteButton;
