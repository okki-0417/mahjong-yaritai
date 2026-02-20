import { apolloClient } from "./client";

/**
 * GraphQLクエリのキャッシュを削除
 * @param queryName 削除するクエリ名
 * @example
 * clearQueryCache("whatToDiscardProblemVoteResults");
 */
export const clearQueryCache = (queryName: string) => {
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: queryName,
  });
  apolloClient.cache.gc();
};
