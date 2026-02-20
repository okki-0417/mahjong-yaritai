"use server";

import { CreateMahjongSessionDocument, CreateMahjongSessionInput } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";

export type CreateMahjongSessionActionResponse = {
  success: boolean;
  errors: string[];
};

type Props = CreateMahjongSessionInput;

type ReturnType = Promise<CreateMahjongSessionActionResponse>;

export default async function createMahjongSessionAction(input: Props): ReturnType {
  const client = getClient();

  try {
    const { data } = await client.mutate({
      mutation: CreateMahjongSessionDocument,
      variables: { input },
    });

    if (!data?.createMahjongSession?.mahjongSession) {
      return {
        success: false,
        errors: ["保存に失敗しました"],
      };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "保存に失敗しました"],
    };
  }
}
