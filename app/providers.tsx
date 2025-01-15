"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
}

export const AuthContext = createContext<AuthContextType>({ session: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      router.refresh();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}
