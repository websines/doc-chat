import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen w-full flex flex-row justify-center items-center">
      <div className="flex flex-col space-y-4 items-center justify-center">
        <h1 className="text-white text-4xl font-semibold">Log In to GPT TIM</h1>
        <SignIn />
      </div>
    </div>
  );
}
