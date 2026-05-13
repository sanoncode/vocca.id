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
import SelectLangButton from "./select-lang-button";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type NewChatProps = {
  userId?: string;
};

const CreateButtonSideBar = ({ userId }: NewChatProps) => {
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
    if (!userId) {
      return "User tidak ditemukan.";
    }

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

      // 1. Create room
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert({
          name: roomName.trim(),
          created_by: userId,
          default_language: lang,
        })
        .select()
        .single();

      if (roomError) {
        throw roomError;
      }

      // 2. Insert creator as first member
      const { error: memberError } = await supabase
        .from("room_members")
        .insert({
          room_id: room.id,
          user_id: userId,
          language: lang,
        });

      if (memberError) {
        throw memberError;
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

  const isFormValid = roomName.trim().length >= 3 && !!lang && !!userId;

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
            <SelectLangButton
              value={lang}
              onChange={setLang}
            />
          </Field>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
          >
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

export default CreateButtonSideBar;