import { SignUp } from "@clerk/nextjs";

export const SignUpPage = () => {
  return (
    <main className="grid min-h-screen items-center justify-center lg:grid-cols-2">
      <section>
        <SignUp />
      </section>
    </main>
  );
};
