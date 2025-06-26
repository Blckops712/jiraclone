import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.register.$post>;
type RequestType = InferRequestType<typeof client.api.auth.register.$post>;

interface UseRegisterProps {
    redirectTo?: string;
}

export const useRegister = ({ redirectTo }: UseRegisterProps = {}) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.register["$post"]({ json });


            return await response.json();
        },
        onSuccess: () => {
            toast.success("Registered successfully");
            queryClient.invalidateQueries({ queryKey: ["current"] });

            if (redirectTo) {
                router.push(redirectTo);
            } else {
                router.refresh();
            }
        },
        onError: () => {
            toast.error("Failed to register");
        }
    });

    return mutation;
};