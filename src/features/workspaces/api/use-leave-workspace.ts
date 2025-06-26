import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["members"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["members"]["$delete"]>;

export const useLeaveWorkspace = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[":workspaceId"]["members"]["$delete"]({
                param,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error("error" in errorData ? errorData.error : "Failed to leave workspace");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("You have left the workspace");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.removeQueries({ queryKey: ["workspace", data.$id] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to leave workspace");
        },
    });

    return mutation;
}; 