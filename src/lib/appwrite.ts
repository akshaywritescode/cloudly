import { Account, Client, Databases } from "appwrite";

export function getClient() {
  if (
    !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_DEVKEY
  ) {
    throw new Error(
      "Environment variables NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and NEXT_PUBLIC_APPWRITE_DEVKEY must be defined"
    );
  }

  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setDevKey(process.env.NEXT_PUBLIC_APPWRITE_DEVKEY);
}

export function getAccount() {
  return new Account(getClient());
}

export function getDatabase() {
  return new Databases(getClient());
}
