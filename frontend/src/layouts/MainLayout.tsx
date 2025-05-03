import { Outlet, Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

export default function MainLayout() {
  return (
    <>
      <header className="w-full flex items-center justify-between px-6 py-3 border-b">
        <Link to="/" className="text-2xl font-bold text-slate-800">
          Culturology
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/peoples" className="hover:underline">
            Peoples
          </Link>
          <Link to="/map" className="hover:underline">
            Map
            </Link>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded bg-slate-800 text-white text-sm">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </nav>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}
