import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetWorkspaceJoinProps {
    workspaceId: string;
    inviteCode: string;
}

export const useGetWorkspaceJoin = ({ workspaceId, inviteCode }: UseGetWorkspaceJoinProps) => {
    const query = useQuery({
        queryKey: ["workspace-join", workspaceId, inviteCode],
        queryFn: async () => {
            const response = await client.api.workspaces[":workspaceId"]["join"][":inviteCode"].$get({
                param: { workspaceId, inviteCode }
            });

            if (!response.ok) {
                throw new Error("Failed to get workspace for join");
            }

            const { data } = await response.json();

            return data;
        },
    });

    return query;
}; 