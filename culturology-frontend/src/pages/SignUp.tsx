import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex justify-center py-16">
      <SignUp routing="path" path="/signup" signInUrl="/signin" />
    </div>
  );
}