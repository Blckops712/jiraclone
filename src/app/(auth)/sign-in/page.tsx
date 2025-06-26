import { getCurrent } from "@/features/auth/queries";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

interface SignInPageProps {
  searchParams: {
    redirect?: string;
    workspaceId?: string;
    inviteCode?: string;
  };
}

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const user = await getCurrent();

  if (user) {
    redirect(searchParams.redirect || "/");
  }

  return <SignInCard />;
};

export default SignInPage;
