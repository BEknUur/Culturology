import { NavLink } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <NavLink to="/" className="relative flex items-center text-2xl font-bold">
          <div className="mr-3 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-amber-600">
            <div className="h-6 w-6 rounded-full bg-stone-900 p-1">
              <div className="h-full w-full rounded-full bg-amber-400"></div>
            </div>
          </div>
          <span className="font-serif text-amber-100">Culturology</span>
        </NavLink>

        <div className="flex items-center space-x-6">
          {["/cultures", "/map", "/gallery"].map((path, i) => {
            const label = path.slice(1).charAt(0).toUpperCase() + path.slice(2);
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `font-serif text-lg transition-colors ${
                    isActive ? "text-amber-400 underline" : "text-amber-100/80 hover:text-amber-200"
                  }`
                }
              >
                {label}
              </NavLink>
            );
          })}

          {isLoaded ? (
            isSignedIn ? (
              <div className="ml-2 rounded-full border-2 border-amber-500 p-0.5">
                <UserButton />
              </div>
            ) : (
              <SignInButton>
                <button className="rounded-lg border-2 border-amber-600 bg-amber-700/30 px-4 py-1.5 font-serif text-sm font-medium text-amber-100 shadow hover:bg-amber-700/50">
                  Sign In
                </button>
              </SignInButton>
            )
          ) : (
            <div className="h-8 w-8 animate-pulse rounded-full bg-amber-700/50" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
