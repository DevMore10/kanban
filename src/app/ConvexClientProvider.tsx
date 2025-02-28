// "use client";

// import { ConvexProvider, ConvexReactClient } from "convex/react";
// import { ReactNode } from "react";

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   return <ConvexProvider client={convex}>{children}</ConvexProvider>;
// }

"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={"pk_test_cG9zaXRpdmUtZGluZ28tNzAuY2xlcmsuYWNjb3VudHMuZGV2JA"}>
      <ConvexProviderWithClerk
        client={convex}
        useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
