// lib/appwrite.ts

import { Account, Client, Databases, Storage } from "appwrite";

// Load envs at build time — safe for both server and browser if NEXT_PUBLIC is used
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
const DEVKEY = process.env.NEXT_PUBLIC_APPWRITE_DEVKEY as string;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_CLOUDLY_BUCKET_MAIN as string;

if (!ENDPOINT || !PROJECT_ID || !DEVKEY || !BUCKET_ID) {
  throw new Error(
    "Environment variables NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DEVKEY, and NEXT_PUBLIC_APPWRITE_CLOUDLY_BUCKET_MAIN must be defined"
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

export function getStorage() {
  return new Storage(getClient());
}

export function getBucketId() {
  return BUCKET_ID;
}
