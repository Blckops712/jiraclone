import { UserButton } from "@/features/auth/components/user-button";

export const Navbar = () => {
  return (
    <div>
      <nav className="flex items-center justify-between px-6 pt-4">
        <div className="flex flex-col hidden lg:flex">
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-sm text-gray-500">
            Monitor all your projects and tasks here
          </p>
        </div>
        <UserButton />
      </nav>
    </div>
  );
};
