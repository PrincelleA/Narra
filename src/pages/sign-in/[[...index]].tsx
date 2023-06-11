import { SignIn } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="gradient"></div>

      <SignIn />
      <SignUp />
    </div>
  );
}
