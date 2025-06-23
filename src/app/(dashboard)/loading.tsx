import { Loader2 } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
};

export default DashboardLoading;
