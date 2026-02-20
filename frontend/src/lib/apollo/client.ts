import { ApolloClient, InMemoryCache } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

// ファイルアップロード対応のカスタムfetch関数
const customFetch = (uri: string | Request | URL, options?: any) => {
  if (!(options.body instanceof FormData)) return fetch(uri, options);

  // multipart/form-dataの場合はContent-Typeを削除（ブラウザが自動設定）
  const headers = new Headers(options.headers);
  headers.delete("content-type");

  return fetch(uri, { ...options, headers });
};

const httpLink = new UploadHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  credentials: "include",
  fetch: customFetch,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  },
});
