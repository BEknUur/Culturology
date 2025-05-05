import { NavLink } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();

  const links = [
    { to: "/cultures", label: "Ancient Cultures", symbol: "𓃭" },
    { to: "/map", label: "Silk Road", symbol: "𓃗" },
    { to: "/media", label: "Sacred Texts", symbol: "𓃒" },
    { to: "/about", label: "The Oracle", symbol: "𓃀" },
  ];

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/50 font-['Cormorant']"
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 10, stiffness: 100 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <NavLink to="/" className="relative flex items-center group">
          <motion.div
            className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 border-2 border-amber-700 shadow-lg transition-all group-hover:bg-amber-700"
            whileHover={{ rotate: 10 }}
          >
            <div className="h-6 w-6 rounded-full bg-amber-100 p-1">
              <div className="h-full w-full rounded-full bg-amber-300/80"></div>
            </div>
          </motion.div>
          <motion.span
            className="text-3xl font-bold text-amber-900 group-hover:text-amber-800 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            Sacred Wisdom
          </motion.span>
        </NavLink>

        <div className="flex items-center space-x-8">
          {links.map(({ to, label, symbol }, index) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <NavLink to={to}>
                {({ isActive }) => (
                  <div
                    className={`flex flex-col items-start text-xl transition-all group ${
                      isActive
                        ? "text-amber-800 font-bold"
                        : "text-amber-700 hover:text-amber-900"
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {symbol}
                      </span>
                      {label}
                    </span>
                    {isActive && (
                      <motion.span
                        className="block h-0.5 bg-amber-600 mt-1 w-full"
                        layoutId="navUnderline"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                )}
              </NavLink>
            </motion.div>
          ))}

          {isLoaded ? (
            isSignedIn ? (
              <motion.div
                className="ml-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="rounded-full border-2 border-amber-600/50 p-0.5 transition-all hover:border-amber-700/70 hover:shadow-lg">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-9 w-9",
                        userButtonPopoverCard: "bg-amber-50 border border-amber-200 font-['Cormorant']",
                        userButtonPopoverActionButtonText: "text-amber-800",
                        userButtonPopoverActionButton: "hover:bg-amber-100 text-lg",
                        userButtonPopoverFooter: "bg-amber-100/50",
                        userButtonOuterIdentifier: "font-['Cormorant']"
                      }
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <SignInButton>
                  <button className="flex items-center rounded-lg border-2 border-amber-700 bg-amber-600/10 px-5 py-2 text-lg font-medium text-amber-800 shadow-md hover:bg-amber-600/20 hover:border-amber-800 hover:text-amber-900 transition-all group">
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">𓂀</span>
                    Enter Temple
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">𓂀</span>
                  </button>
                </SignInButton>
              </motion.div>
            )
          ) : (
            <motion.div
              className="h-9 w-9 rounded-full bg-amber-200/80 border border-amber-300"
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.9, 1, 0.9]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
          )}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-800/10 text-4xl"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              fontFamily: "'Noto Sans Symbols', sans-serif"
            }}
            animate={{
              y: [0, Math.random() * 10 - 5],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {['𓃭', '𓃗', '𓃒'][i % 3]}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;
