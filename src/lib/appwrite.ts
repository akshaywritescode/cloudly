// lib/appwrite.ts

import { Account, Client, Databases } from "appwrite";

// Load envs at build time — safe for both server and browser if NEXT_PUBLIC is used
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
const DEVKEY = process.env.NEXT_PUBLIC_APPWRITE_DEVKEY as string;

if (!ENDPOINT || !PROJECT_ID || !DEVKEY) {
  throw new Error(
    "Environment variables NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and NEXT_PUBLIC_APPWRITE_DEVKEY must be defined"
  );
}

export function getClient() {
  return new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setDevKey(DEVKEY);
}

export function getAccount() {
  return new Account(getClient());
}

export function getDatabase() {
  return new Databases(getClient());
}
