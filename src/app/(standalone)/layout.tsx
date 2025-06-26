import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@/features/auth/components/user-button";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="min-h-screen">
      <div className="max-w-screen-xl mx-auto p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo.svg" alt="Logo" width={130} height={32} />
            </Link>
          </div>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
