import { Account, Client } from "appwrite";

if (
  !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_APPWRITE_DEVKEY
) {
  throw new Error(
    "Environment variables NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID must be defined"
  );
}

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setDevKey(process.env.NEXT_PUBLIC_APPWRITE_DEVKEY);

const account = new Account(client);

export { account };
