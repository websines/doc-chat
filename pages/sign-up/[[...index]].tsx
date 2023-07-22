import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen w-full flex flex-row justify-center items-center">
      <div className="flex flex-col space-y-4 items-center justify-center">
        <h1 className="text-white text-4xl font-semibold">
          Sign Up to GPT TIM
        </h1>
        <SignUp />
      </div>
    </div>
  );
}
