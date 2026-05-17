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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, UserRoundPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ChatRoomInviteButton = () => {

    const pathname = usePathname()
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const inviteLink = `${window.location.origin}${pathname}`;
    const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };


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
                <FieldGroup>
                    <Field>
                        <Label>Room Link</Label>
                        <Input
                            value={pathname}
                            readOnly
                        />
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <Button onClick={copyToClipboard}>
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChatRoomInviteButton;
