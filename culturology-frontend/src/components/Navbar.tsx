import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <NavLink to="/" className="text-xl font-bold text-primary-500">
        Culturology
      </NavLink>
      <nav className="flex items-center gap-4 text-sm font-medium">
        <NavLink to="/cultures" className={({ isActive }) => (isActive ? "text-primary-600" : "")}>Cultures</NavLink>
        <NavLink to="/map" className={({ isActive }) => (isActive ? "text-primary-600" : "")}>Map</NavLink>
        <SignedOut>
          <NavLink to="/signin" className="rounded border px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">Sign In</NavLink>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </div>
  </header>
);
export default Navbar;