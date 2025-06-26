"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import Link from "next/link";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";

interface SignUpCardProps {
  workspaceId?: string;
  inviteCode?: string;
}

export const SignUpCard = ({ workspaceId, inviteCode }: SignUpCardProps) => {
  const redirectUrl =
    workspaceId && inviteCode
      ? `/workspaces/${workspaceId}/join/${inviteCode}`
      : undefined;

  const { mutate, isPending } = useRegister({ redirectTo: redirectUrl });

  const hasInvite = !!(workspaceId && inviteCode);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({
      json: values,
    });
  };
  return (
    <Card className="w-full h-full md:w-[487px]">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle>
          {hasInvite ? "Join Workspace" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {hasInvite ? (
            "Complete your registration to join the workspace"
          ) : (
            <>
              By signing up, you agree to our{" "}
              <Link href="/terms-of-service" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <div className="px-7">
        <CardContent className="p-7">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isPending}
                size="lg"
                className="w-full mt-7"
                type="submit"
              >
                {isPending
                  ? "Creating account..."
                  : hasInvite
                  ? "Create Account & Join"
                  : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </div>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <div className="px-7">
        <CardContent className="p-7 flex flex-col gap-y-4">
          <Button
            disabled={isPending}
            size="lg"
            className="w-full"
            variant="outline"
          >
            <FcGoogle className="mr-2" />
            Sign up with Google
          </Button>
          <Button
            disabled={isPending}
            size="lg"
            className="w-full"
            variant="outline"
          >
            <FaGithub className="mr-2" />
            Sign up with GitHub
          </Button>
        </CardContent>
      </div>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>Already have an account? </p>
        <Link href="/sign-in">
          <span className="text-blue-400 font-semibold">&nbsp;Sign in</span>
        </Link>
      </CardContent>
    </Card>
  );
};
