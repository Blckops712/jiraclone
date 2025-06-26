import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>;

export const useJoinWorkspace = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ param, json });

            if (!response.ok) {
                throw new Error("Failed to join workspace");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            toast.success("Successfully joined workspace");
            router.push(`/workspaces/${data.$id}`);
        },
        onError: () => {
            toast.error("Failed to join workspace");
        }
    });

    return mutation;
}; 