import { Account, Client } from "appwrite";

export function getAccount() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const devKey = process.env.NEXT_PUBLIC_APPWRITE_DEVKEY;

  if (!endpoint || !projectId || !devKey) {
    throw new Error(
      "Environment variables NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and NEXT_PUBLIC_APPWRITE_DEVKEY must be defined"
    );
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setDevKey(devKey);

  return new Account(client);
}
