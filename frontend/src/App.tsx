import  { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
} from "@clerk/clerk-react";

export default function App() {
 
  useEffect(() => {
    document.body.style.margin = "0";
    return () => {
      document.body.style.margin = "";
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <SignedIn>
        <header
          style={{
            width: "100%",
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#1e293b",
            }}
          >
            Welcome to Nfactorial-MVP
          </h1>
          <UserButton />
        </header>

        <main style={{ padding: "1.5rem" }}>
         
        </main>
      </SignedIn>

      <SignedOut>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",  
            width: "100vw",   
          }}
        >
          <SignIn routing="path" path="/" />
        </div>
      </SignedOut>
    </div>
  );
}
