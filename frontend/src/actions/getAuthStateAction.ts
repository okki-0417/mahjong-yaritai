"use server";

import { cookies } from "next/headers";

export const getAuthStateAction = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  return !!accessToken;
};
