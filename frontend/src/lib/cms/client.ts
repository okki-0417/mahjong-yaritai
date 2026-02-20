import { createClient } from "contentful";

const cmsClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "xxx",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "xxx",
});

export default cmsClient;
