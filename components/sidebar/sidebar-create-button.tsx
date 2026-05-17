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
import Link from "next/link";
import SelectLangButton from "../select-lang-button";

const CreateButtonSideBar = () => {
  const [open, setOpen] = useState(false);

  const [newRoomId, setNewRoomId] = useState<string | null>(null);
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

      const { data: room } = await supabase.rpc("create_room_with_member", {
        room_name: roomName.trim(),
        room_lang: lang,
      });

      if (room) {
        setNewRoomId(room);
      }
      // 3. Reset form
    } catch (err) {
      console.error("Create room error:", err);
      setError("Gagal membuat room.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogContent = () => {
    if (newRoomId !== null) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>🎉 Room Created Successfully!</DialogTitle>
            <DialogDescription>
              Your room{" "}
              <span className="font-semibold text-primary">{roomName}</span> is
              ready. You can now jump in and start chatting!
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Close
              </Button>
            </DialogClose>
            <Button onClick={() => {
                resetForm()
                setOpen(false)
            }}>
              <Link href={`/chat/${newRoomId}`}>jump in</Link>
            </Button>
          </DialogFooter>
        </>
      );
    }

    return (
      <>
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
            <SelectLangButton value={lang} onChange={setLang} />
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
      </>
    );
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
          setNewRoomId(null);
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
        {handleDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateButtonSideBar;
