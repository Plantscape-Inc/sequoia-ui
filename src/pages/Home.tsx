import type { GoogleUserInfo } from "../types/auth.type";

interface HomeProps {
  user: GoogleUserInfo | null;
}

export default function Home({ user }: HomeProps) {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        <h1 className="relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200">
          Welcome {user?.name}
        </h1>
        <h3 className="relative text-center leading-[125%] font-bold text-gray-900 dark:text-gray-200">
          Click the upper left menu to access available pages
        </h3>
      </div>
    </div>
  );
}
