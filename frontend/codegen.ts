import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3001/graphql",
  documents: ["src/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "./src/generated/": {
      preset: "client",
      plugins: [],
      config: {
        scalars: {
          Upload: "File",
        },
      },
    },
  },
};

export default config;
