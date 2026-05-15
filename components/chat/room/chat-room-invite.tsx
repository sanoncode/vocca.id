"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const CreateInviteButton = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [lang, setLang] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setRoomName("");
    setLang("");
    setError("");
  };

  const validateForm = () => {
    if (!roomName.trim()) {
      return "Room name wajib diisi.";
    }

    if (roomName.trim().length < 3) {
      return "Room name minimal 3 karakter.";
    }

    if (!lang) {
      return "Pilih bahasa terlebih dahulu.";
    }

    return null;
  };

  const handleSubmit = async () => {
    // Prevent double submit
    if (loading) return;

    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const supabase = await createClient();

      const { data: room, error: roomError } = await supabase.rpc(
        "create_room_with_member",
        {
          room_name: roomName.trim(),
          room_lang: lang,
        },
      );

      if (roomError) {
        console.log(roomError, "room error");
      }
      // 3. Reset form
      resetForm();

      // 4. Close dialog
      setOpen(false);

      // 5. Refresh sidebar data
      router.refresh();

      // 6. Optional: redirect to new room
      router.push(`/chat/${room.id}`);
    } catch (err) {
      console.error("Create room error:", err);
      setError("Gagal membuat room.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = roomName.trim().length >= 3 && !!lang;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        // Reset form when dialog is closed
        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="hover:border-black dark:hover:border-white"
          variant="outline"
          size="sm"
        >
          <Plus size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            Create a new room and choose your language.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <Label>Room Name</Label>
            <Input
              placeholder="Chat with friends from Korea"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={loading}
              maxLength={50}
            />
          </Field>

          <Field>
            <Label>Your Language</Label>
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={handleSubmit} disabled={!isFormValid || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Room"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInviteButton;
