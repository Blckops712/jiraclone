import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";


import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces.$post>;
type RequestType = InferRequestType<typeof client.api.workspaces.$post>;

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form }) => {
            const response = await client.api.workspaces["$post"]({ form });
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            toast.success("Workspace created successfully");
        },
        onError: (error) => {
            if (error.message.includes("image") || error.message.includes("file")) {
                toast.error("Image upload failed. Please try a smaller image.");
            } else {
                toast.error("Failed to create workspace");
            }
        }
    });

    return mutation;
};