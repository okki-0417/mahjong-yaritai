import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Session = z
  .object({ is_logged_in: z.boolean(), user_id: z.number().int().nullable() })
  .passthrough();
const createLineCallback_Body = z.object({ code: z.string(), state: z.string() }).passthrough();

export const schemas = {
  Session,
  createLineCallback_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/auth/google/callback",
    alias: "createGoogleCallback",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ code: z.string() }).passthrough(),
      },
    ],
    response: z.object({ session: Session }).passthrough(),
    errors: [
      {
        status: 400,
        description: `bad request`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `unprocessable entity - auth request validation fails`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/line/callback",
    alias: "createLineCallback",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: createLineCallback_Body,
      },
    ],
    response: z.object({ session: Session }).passthrough(),
    errors: [
      {
        status: 400,
        description: `bad request - missing code`,
        schema: z.void(),
      },
      {
        status: 422,
        description: `unprocessable entity - auth request validation fails`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/auth/line/login_url",
    alias: "getLineLoginUrl",
    requestFormat: "json",
    response: z.object({ login_url: z.string() }).passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
