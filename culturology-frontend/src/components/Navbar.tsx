import { NavLink } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <NavLink to="/" className="text-2xl font-bold text-primary-600">
          Culturology
        </NavLink>

        <div className="flex items-center space-x-4">
          <NavLink to="/cultures" className="hover:underline">
            Cultures
          </NavLink>
          <NavLink to="/map" className="hover:underline">
            Map
          </NavLink>

          {isLoaded ? (
            isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton>
                <button className="rounded border px-3 py-1 text-sm">Sign In</button>
              </SignInButton>
            )
          ) : (
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
