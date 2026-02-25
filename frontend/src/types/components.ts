import { components } from "@/src/types/api";

export type User = components["schemas"]["User"];
export type FollowStats = components["schemas"]["FollowStats"];
export type ApiError = components["schemas"]["Errors"];
export type WhatToDiscardProblem =
  components["schemas"]["WhatToDiscardProblem"];
export type PageInfo = components["schemas"]["PageInfo"];
export type WhatToDiscardProblemList =
  components["schemas"]["WhatToDiscardProblemList"];
export type FollowableUser = User & { is_followed_by_me: boolean };
