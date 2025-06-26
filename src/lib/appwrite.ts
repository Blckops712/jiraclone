import "server-only";

import {
    Account,
    Client,
    Databases,
    Storage,
    Users,
} from "node-appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { cookies } from "next/headers";


export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_KEY!)

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get users() {
            return new Users(client);
        },
        get storage() {
            return new Storage(client);
        },
    };

};

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const session = await cookies().get(AUTH_COOKIE);

    if (!session || !session.value) {
        throw new Error("Not authenticated");
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
    };
};