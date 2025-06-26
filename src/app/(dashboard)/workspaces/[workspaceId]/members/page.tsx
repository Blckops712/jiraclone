import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { MembersList } from "@/features/members/components/members-list";

interface MembersPageProps {
  params: {
    workspaceId: string;
  };
}

const MembersPage = async ({ params }: MembersPageProps) => {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full space-y-4">
      <MembersList workspaceId={params.workspaceId} />
    </div>
  );
};

export default MembersPage;
