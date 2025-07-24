import { getAccount } from "./appwrite";

export const getCurrentUser = async () => {
  try {
    const account = getAccount();
    return await account.get();
  } catch (error) {
    return null;
  }
};
