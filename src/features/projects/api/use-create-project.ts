import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects.$post>;
type RequestType = InferRequestType<typeof client.api.projects.$post>;

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form }) => {
            const response = await client.api.projects["$post"]({ form });
            return await response.json();
        },
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["projects", data.workspaceId] });
            toast.success("Project created successfully");
        },
        onError: () => {
            toast.error("Failed to create project");
        }
    });

    return mutation;
};