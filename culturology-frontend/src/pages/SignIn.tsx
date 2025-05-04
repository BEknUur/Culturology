import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex justify-center py-16">
      <SignIn routing="path" path="/signin" signUpUrl="/signup" />
    </div>
  );
}