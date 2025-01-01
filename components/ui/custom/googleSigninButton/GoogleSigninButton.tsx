"use client";

import { signIn } from "next-auth/react";

export default function GoogleSigninButton({ providers }: { providers: any }) {
  return (
    <>
      {providers &&
        Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </>
  );
}
