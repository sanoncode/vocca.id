"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Globe, Users } from "lucide-react";
import SelectLangButton from "../select-lang-button";

type JoinRoomOverlayProps = {
  roomTitle: string;
  creatorName: string | null;
  language: string;
  setLanguage: (value: string) => void;
  handleJoin: () => void;
  loading?: boolean;
};

export default function JoinRoomOverlay({
  roomTitle,
  creatorName,
  language,
  setLanguage,
  handleJoin,
  loading ,
}: JoinRoomOverlayProps) {

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Users className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Join {roomTitle}
            </CardTitle>
            <CardDescription className="text-sm">
              You were invited by{" "}
              <span className="font-semibold text-foreground">
                {creatorName}
              </span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Select Your Language
            </label>

           <SelectLangButton value={language} onChange={setLanguage}/>
          </div>

          {/* Join Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!language || loading}
            onClick={() => handleJoin()}
          >
            {loading ? "Joining..." : "Join Room"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}