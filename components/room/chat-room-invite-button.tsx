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
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChatRoomInviteButtonProps } from "@/constants/types/props";
import { sendInvitations } from "@/services/supabase/client/chat-room-services";
import { UserCheck, UserRoundPlus, XIcon } from "lucide-react";
import {  useState } from "react";

const ChatRoomInviteButton = ({userId, roomId}: ChatRoomInviteButtonProps) => {

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
    const [inviteLoading, setInviteLoading] = useState(false)

    const addEmail = () => {
        const value = email.trim().toLowerCase();

        if (!value) return;

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        if (!isValid) return;

        if (emails.includes(value)) return;

        setEmails((prev) => [...prev, value]);
        setEmail("");
    };

    const removeEmail = (emailToRemove: string) => {
        setEmails((prev) =>
            prev.filter((item) => item !== emailToRemove)
        );
    };

    const handleInvite = async() => {
        if(!roomId && !userId) return

        setInviteLoading(true)

        const invitations = {
            userId: userId,
            roomId: roomId,
            emails: emails
        }
        const data = await sendInvitations(invitations)
        if(data){
            setInviteLoading(false)
            setInvitedEmails(emails)
            setEmails([])
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
                    variant="outline"
                    size="sm"
                >
                    <UserRoundPlus size={16} />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>↗️ Invite your Friends !</DialogTitle>
                    <DialogDescription>
                        Invite others to join the room !
                    </DialogDescription>
                </DialogHeader>
                {emails.length > 0 && (
                      <FieldGroup>
                        <div className="min-h-10 px-2 py-2 flex flex-wrap gap-2">
                        {emails.map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-sm"
                            >
                                <span>{item}</span>

                                <button
                                    type="button"
                                    onClick={() => removeEmail(item)}
                                    className="text-zinc-500 hover:text-red-500"
                                >
                                    <XIcon className="h-6 w-6"/>
                                </button>
                            </div>
                        ))}
                        </div>

                </FieldGroup>
                )}

                {invitedEmails.length > 0 && (
                    <FieldGroup>
                        <div className="min-h-10 px-2 py-2 flex flex-wrap gap-2">
                        {invitedEmails.map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-sm"
                            >
                                <span>{item}</span>

                               <UserCheck className="w-6 h-6" />
                            </div>
                        ))}
                        </div>

                </FieldGroup>
                )}
              
                <FieldGroup>
                     <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || (e.key === ' ' || e.key === 'Spacebar')) {
                                    e.preventDefault();
                                    addEmail();
                                }
                            }}
                            placeholder={
                                emails.length === 0
                                    ? "Enter email address"
                                    : ""
                            }
                            className="flex-1 min-w-[200px] bg-transparent outline-none"
                        />
                   
                </FieldGroup>

                <DialogFooter>
                    <Button
                        disabled={emails.length === 0 && !inviteLoading}
                        onClick={handleInvite}
                    > { inviteLoading ? (
                                'Sending...'
                            ) : (  
                                 `Send Invite (${emails.length}) `
                            )
                        }
                        
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChatRoomInviteButton;
