import { components } from "@/src/types/api";

export type User = components["schemas"]["User"];
export type FollowStats = components["schemas"]["FollowStats"];
export type ApiErrors = components["schemas"]["Errors"];
export type ApiError = components["schemas"]["Error"];
export type WhatToDiscardProblem =
  components["schemas"]["WhatToDiscardProblem"];
export type PageInfo = components["schemas"]["PageInfo"];
export type WhatToDiscardProblemList =
  components["schemas"]["WhatToDiscardProblemList"];
export type FollowableUser = User & { is_followed_by_me: boolean };
export type Like = components["schemas"]["Like"];
export type Vote = components["schemas"]["Vote"];
export type Comment = components["schemas"]["Comment"];
export type ParentComment = Comment & { child_comments: Comment[] };
