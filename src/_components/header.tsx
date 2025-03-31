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
    <div className="mx-auto hidden h-28 w-full max-w-7xl items-center justify-between gap-x-6 p-6 sm:flex lg:px-8 border-b-4 border-black bg-teal-300">
      <div className="flex items-center">
        <span className="text-5xl font-black tracking-tight text-cyan-950">task</span>
        <span className="text-5xl font-black tracking-tight text-cyan-700 rotate-2 relative top-1">
          flow
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <SignedOut>
          <div className="flex space-x-6">
            <SignInButton mode="modal">
              <button className="text-lg font-bold bg-white px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-lg font-bold bg-blue-500 text-white px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center bg-white p-1 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <OrganizationSwitcher
              appearance={{
                elements: {
                  organizationSwitcherTrigger: "py-2 px-4 font-bold",
                  userPreviewAvatarBox: "h-10 w-10 border-2 border-black",
                  organizationPreviewNameBox: "font-bold",
                  organizationSwitcherPopoverCard:
                    "bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
                  organizationPreviewButton: "hover:bg-yellow-200",
                },
              }}
            />
            <div className="font-bold text-2xl text-black px-4">/</div>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-12 w-12 border-2 border-black",
                  userButtonTrigger: "p-1",
                  userPreviewMainIdentifier: "font-bold",
                  userButtonPopoverCard:
                    "bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
                },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
