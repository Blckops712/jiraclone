import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="hidden lg:block fixed left-0 top-0 lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px]">
          <div className="mx-auto w-full max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
          {/* TODO: Footer */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
