import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export function Header() {
  return (
    <div className="mx-auto hidden h-24 w-full max-w-7xl items-center justify-between gap-x-6 p-6 sm:flex lg:px-8 border-b">
      <div className="flex items-center">
        <span className="text-5xl font-bold">task</span>
        <span className="text-5xl font-bold text-blue-800">flow</span>
      </div>
      <div className="flex items-center space-x-4">
        <SignedOut>
          <div className="flex space-x-4">
            <SignInButton mode="modal">
              <button className="text-lg font-medium">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-lg font-medium bg-blue-800 text-white px-4 py-2 rounded-md">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center">
            <OrganizationSwitcher
              appearance={{
                elements: {
                  organizationSwitcherTrigger: "py-2 px-4",
                  userPreviewAvatarBox: "h-10 w-10",
                },
              }}
            />
            <div className="font-thin text-lg text-muted-foreground px-4">/</div>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-10 w-10",
                  userButtonTrigger: "p-1",
                },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
