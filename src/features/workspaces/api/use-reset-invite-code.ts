import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$patch"]>;

export const useResetInviteCode = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$patch"]({ param });

            if (!response.ok) {
                throw new Error("Failed to reset invite code");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
            toast.success("Invite code reset successfully");
        },
        onError: () => {
            toast.error("Failed to reset invite code");
        }
    });

    return mutation;
}; 