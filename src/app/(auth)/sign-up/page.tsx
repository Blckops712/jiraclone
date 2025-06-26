import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";

interface SignUpPageProps {
  searchParams: {
    redirect?: string;
    workspaceId?: string;
    inviteCode?: string;
  };
}

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const user = await getCurrent();

  if (user) {
    redirect(searchParams.redirect || "/");
  }

  return (
    <SignUpCard
      workspaceId={searchParams.workspaceId}
      inviteCode={searchParams.inviteCode}
    />
  );
};

export default SignUpPage;
