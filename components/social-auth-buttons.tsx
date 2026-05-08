import React from "react";
import SocialAuthButton from "./social-auth-button";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type provider = "google" | "github";

type providerTypes = {
  name: provider;
  label: string;
  icon: string;
  size: number;
};

const providers: providerTypes[] = [
  {
    name: "google",
    label: "Continue with Google",
    icon: "/google.svg",
    size: 30,
  },
];

const SocialAuthButtons = () => {
  const handleOAuthLogin = async (provider: provider) => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };
  return (
    <div>
      {providers.map((provider: providerTypes) => (
        <SocialAuthButton key={provider.name} action={() => handleOAuthLogin(provider.name)}>
          <Image
            src={provider.icon}
            height={provider.size}
            width={provider.size}
            alt={provider.name}
          />
          {provider.label}
        </SocialAuthButton>
      ))}
    </div>
  );
};

export default SocialAuthButtons;
