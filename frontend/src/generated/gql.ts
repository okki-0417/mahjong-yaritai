/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "query CurrentSession {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.CurrentSessionDocument;
  "mutation LogoutUser {\n  logout(input: {}) {\n    success\n  }\n}": typeof types.LogoutUserDocument;
  "mutation RequestAuth($input: RequestAuthInput!) {\n  requestAuth(input: $input) {\n    success\n  }\n}": typeof types.RequestAuthDocument;
  "mutation VerifyAuth($input: VerifyAuthInput!) {\n  verifyAuth(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.VerifyAuthDocument;
  "mutation CreateFollow($userId: ID!) {\n  createFollow(input: {userId: $userId}) {\n    follow {\n      id\n      followerId\n      followeeId\n    }\n  }\n}": typeof types.CreateFollowDocument;
  "mutation DeleteFollow($userId: ID!) {\n  deleteFollow(input: {userId: $userId}) {\n    id\n  }\n}": typeof types.DeleteFollowDocument;
  "query Following($first: Int, $after: String) {\n  followings(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.FollowingDocument;
  "query Followers($first: Int, $after: String) {\n  followers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.FollowersDocument;
  "query MutualFollowers($first: Int, $after: String) {\n  mutualFollowers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        avatarUrl\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n    }\n  }\n}": typeof types.MutualFollowersDocument;
  "mutation CreateMahjongSession($input: CreateMahjongSessionInput!) {\n  createMahjongSession(input: $input) {\n    mahjongSession {\n      id\n      name\n      mahjongScoringSetting {\n        id\n        rate\n        chipAmount\n      }\n      mahjongParticipants {\n        id\n        name\n        userId\n      }\n      mahjongGames {\n        id\n        mahjongResults {\n          id\n          ranking\n          resultPoints\n        }\n      }\n    }\n  }\n}": typeof types.CreateMahjongSessionDocument;
  "query ParticipatedMahjongSession($id: ID!) {\n  participatedMahjongSession(id: $id) {\n    id\n    name\n    creatorUser {\n      id\n      name\n      avatarUrl\n    }\n    mahjongScoringSetting {\n      id\n      rate\n      chipAmount\n      umaRuleLabel\n      okaRuleLabel\n    }\n    mahjongParticipants {\n      id\n      userId\n      name\n      averageRanking\n      totalPoints\n      totalProfits\n      user {\n        id\n        name\n        avatarUrl\n      }\n    }\n    mahjongGames {\n      id\n      mahjongResults {\n        id\n        ranking\n        score\n        resultPoints\n        mahjongParticipantId\n      }\n    }\n    createdAt\n    updatedAt\n  }\n}": typeof types.ParticipatedMahjongSessionDocument;
  "query ParticipatedMahjongSessions($after: String, $first: Int) {\n  participatedMahjongSessions(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        name\n        totalGameFee\n        myTotalPoints\n        myAverageRanking\n        myTotalProfits\n        creatorUser {\n          id\n          name\n        }\n        mahjongScoringSetting {\n          id\n          rate\n          chipAmount\n          umaRuleLabel\n          okaRuleLabel\n        }\n        participantUsers {\n          id\n          name\n        }\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.ParticipatedMahjongSessionsDocument;
  "query VotedWhatToDiscardProblems($after: String, $first: Int) {\n  votedWhatToDiscardProblems(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.VotedWhatToDiscardProblemsDocument;
  "mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.CreateUserDocument;
  "query CurrentUserProfile {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.CurrentUserProfileDocument;
  "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.UpdateUserDocument;
  "mutation UpdateUserProfile($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.UpdateUserProfileDocument;
  "query UserProfile($userId: ID!) {\n  user(id: $userId) {\n    id\n    name\n    email\n    profileText\n    avatarUrl\n    isFollowing\n    followingCount\n    followersCount\n    createdAt\n    updatedAt\n  }\n}": typeof types.UserProfileDocument;
  "mutation WithdrawUser {\n  withdrawUser(input: {}) {\n    success\n  }\n}": typeof types.WithdrawUserDocument;
  "query WithdrawalSummary {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.WithdrawalSummaryDocument;
  "query CommentReplies($parentCommentId: ID!, $problemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemCommentReplies(\n    parentCommentId: $parentCommentId\n    problemId: $problemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.CommentRepliesDocument;
  "mutation CreateComment($whatToDiscardProblemId: ID!, $content: String!, $parentCommentId: ID) {\n  createWhatToDiscardProblemComment(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId, content: $content, parentCommentId: $parentCommentId}\n  ) {\n    comment {\n      id\n      content\n      userId\n      parentCommentId\n      repliesCount\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}": typeof types.CreateCommentDocument;
  "mutation DeleteComment($commentId: ID!) {\n  deleteWhatToDiscardProblemComment(input: {commentId: $commentId}) {\n    id\n  }\n}": typeof types.DeleteCommentDocument;
  "query ParentComments($whatToDiscardProblemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemComments(\n    whatToDiscardProblemId: $whatToDiscardProblemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.ParentCommentsDocument;
  "mutation CreateWhatToDiscardProblem($input: CreateWhatToDiscardProblemInput!) {\n  createWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}": typeof types.CreateWhatToDiscardProblemDocument;
  "mutation DeleteWhatToDiscardProblem($input: DeleteWhatToDiscardProblemInput!) {\n  deleteWhatToDiscardProblem(input: $input) {\n    id\n  }\n}": typeof types.DeleteWhatToDiscardProblemDocument;
  "query LikedWhatToDiscardProblemIds($whatToDiscardProblemIds: [ID!]!) {\n  likedWhatToDiscardProblemIds(whatToDiscardProblemIds: $whatToDiscardProblemIds)\n}": typeof types.LikedWhatToDiscardProblemIdsDocument;
  "mutation CreateWhatToDiscardProblemLike($problemId: ID!) {\n  createWhatToDiscardProblemLike(input: {problemId: $problemId}) {\n    like {\n      id\n      userId\n      likableId\n      likableType\n      createdAt\n    }\n  }\n}": typeof types.CreateWhatToDiscardProblemLikeDocument;
  "mutation DeleteWhatToDiscardProblemLike($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemLike(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}": typeof types.DeleteWhatToDiscardProblemLikeDocument;
  "mutation UpdateWhatToDiscardProblem($input: UpdateWhatToDiscardProblemInput!) {\n  updateWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}": typeof types.UpdateWhatToDiscardProblemDocument;
  "query votedTileIds($whatToDiscardProblemIds: [ID!]!) {\n  votedTileIds(whatToDiscardProblemIds: $whatToDiscardProblemIds) {\n    tileId\n    whatToDiscardProblemId\n  }\n}": typeof types.VotedTileIdsDocument;
  "mutation CreateWhatToDiscardProblemVote($problemId: ID!, $tileId: ID!) {\n  createWhatToDiscardProblemVote(input: {problemId: $problemId, tileId: $tileId}) {\n    vote {\n      id\n      tileId\n      whatToDiscardProblemId\n      userId\n      createdAt\n      updatedAt\n      tile {\n        id\n        suit\n        name\n        ordinalNumberInSuit\n      }\n    }\n  }\n}": typeof types.CreateWhatToDiscardProblemVoteDocument;
  "mutation DeleteWhatToDiscardProblemVote($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemVote(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}": typeof types.DeleteWhatToDiscardProblemVoteDocument;
  "query WhatToDiscardProblemVoteResult($whatToDiscardProblemId: ID!) {\n  whatToDiscardProblemVoteResults(whatToDiscardProblemId: $whatToDiscardProblemId) {\n    tileId\n    count\n    percentage\n  }\n}": typeof types.WhatToDiscardProblemVoteResultDocument;
  "query WhatToDiscardProblem($id: ID!) {\n  whatToDiscardProblem(id: $id) {\n    id\n    round\n    turn\n    wind\n    points\n    description\n    votesCount\n    commentsCount\n    likesCount\n    doraId\n    hand1Id\n    hand2Id\n    hand3Id\n    hand4Id\n    hand5Id\n    hand6Id\n    hand7Id\n    hand8Id\n    hand9Id\n    hand10Id\n    hand11Id\n    hand12Id\n    hand13Id\n    tsumoId\n    createdAt\n    updatedAt\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.WhatToDiscardProblemDocument;
  "query WhatToDiscardProblems($first: Int, $after: String) {\n  whatToDiscardProblems(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}": typeof types.WhatToDiscardProblemsDocument;
};
const documents: Documents = {
  "query CurrentSession {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.CurrentSessionDocument,
  "mutation LogoutUser {\n  logout(input: {}) {\n    success\n  }\n}": types.LogoutUserDocument,
  "mutation RequestAuth($input: RequestAuthInput!) {\n  requestAuth(input: $input) {\n    success\n  }\n}":
    types.RequestAuthDocument,
  "mutation VerifyAuth($input: VerifyAuthInput!) {\n  verifyAuth(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.VerifyAuthDocument,
  "mutation CreateFollow($userId: ID!) {\n  createFollow(input: {userId: $userId}) {\n    follow {\n      id\n      followerId\n      followeeId\n    }\n  }\n}":
    types.CreateFollowDocument,
  "mutation DeleteFollow($userId: ID!) {\n  deleteFollow(input: {userId: $userId}) {\n    id\n  }\n}":
    types.DeleteFollowDocument,
  "query Following($first: Int, $after: String) {\n  followings(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}":
    types.FollowingDocument,
  "query Followers($first: Int, $after: String) {\n  followers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}":
    types.FollowersDocument,
  "query MutualFollowers($first: Int, $after: String) {\n  mutualFollowers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        avatarUrl\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n    }\n  }\n}":
    types.MutualFollowersDocument,
  "mutation CreateMahjongSession($input: CreateMahjongSessionInput!) {\n  createMahjongSession(input: $input) {\n    mahjongSession {\n      id\n      name\n      mahjongScoringSetting {\n        id\n        rate\n        chipAmount\n      }\n      mahjongParticipants {\n        id\n        name\n        userId\n      }\n      mahjongGames {\n        id\n        mahjongResults {\n          id\n          ranking\n          resultPoints\n        }\n      }\n    }\n  }\n}":
    types.CreateMahjongSessionDocument,
  "query ParticipatedMahjongSession($id: ID!) {\n  participatedMahjongSession(id: $id) {\n    id\n    name\n    creatorUser {\n      id\n      name\n      avatarUrl\n    }\n    mahjongScoringSetting {\n      id\n      rate\n      chipAmount\n      umaRuleLabel\n      okaRuleLabel\n    }\n    mahjongParticipants {\n      id\n      userId\n      name\n      averageRanking\n      totalPoints\n      totalProfits\n      user {\n        id\n        name\n        avatarUrl\n      }\n    }\n    mahjongGames {\n      id\n      mahjongResults {\n        id\n        ranking\n        score\n        resultPoints\n        mahjongParticipantId\n      }\n    }\n    createdAt\n    updatedAt\n  }\n}":
    types.ParticipatedMahjongSessionDocument,
  "query ParticipatedMahjongSessions($after: String, $first: Int) {\n  participatedMahjongSessions(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        name\n        totalGameFee\n        myTotalPoints\n        myAverageRanking\n        myTotalProfits\n        creatorUser {\n          id\n          name\n        }\n        mahjongScoringSetting {\n          id\n          rate\n          chipAmount\n          umaRuleLabel\n          okaRuleLabel\n        }\n        participantUsers {\n          id\n          name\n        }\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}":
    types.ParticipatedMahjongSessionsDocument,
  "query VotedWhatToDiscardProblems($after: String, $first: Int) {\n  votedWhatToDiscardProblems(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}":
    types.VotedWhatToDiscardProblemsDocument,
  "mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.CreateUserDocument,
  "query CurrentUserProfile {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.CurrentUserProfileDocument,
  "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.UpdateUserDocument,
  "mutation UpdateUserProfile($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.UpdateUserProfileDocument,
  "query UserProfile($userId: ID!) {\n  user(id: $userId) {\n    id\n    name\n    email\n    profileText\n    avatarUrl\n    isFollowing\n    followingCount\n    followersCount\n    createdAt\n    updatedAt\n  }\n}":
    types.UserProfileDocument,
  "mutation WithdrawUser {\n  withdrawUser(input: {}) {\n    success\n  }\n}":
    types.WithdrawUserDocument,
  "query WithdrawalSummary {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.WithdrawalSummaryDocument,
  "query CommentReplies($parentCommentId: ID!, $problemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemCommentReplies(\n    parentCommentId: $parentCommentId\n    problemId: $problemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}":
    types.CommentRepliesDocument,
  "mutation CreateComment($whatToDiscardProblemId: ID!, $content: String!, $parentCommentId: ID) {\n  createWhatToDiscardProblemComment(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId, content: $content, parentCommentId: $parentCommentId}\n  ) {\n    comment {\n      id\n      content\n      userId\n      parentCommentId\n      repliesCount\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}":
    types.CreateCommentDocument,
  "mutation DeleteComment($commentId: ID!) {\n  deleteWhatToDiscardProblemComment(input: {commentId: $commentId}) {\n    id\n  }\n}":
    types.DeleteCommentDocument,
  "query ParentComments($whatToDiscardProblemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemComments(\n    whatToDiscardProblemId: $whatToDiscardProblemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}":
    types.ParentCommentsDocument,
  "mutation CreateWhatToDiscardProblem($input: CreateWhatToDiscardProblemInput!) {\n  createWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}":
    types.CreateWhatToDiscardProblemDocument,
  "mutation DeleteWhatToDiscardProblem($input: DeleteWhatToDiscardProblemInput!) {\n  deleteWhatToDiscardProblem(input: $input) {\n    id\n  }\n}":
    types.DeleteWhatToDiscardProblemDocument,
  "query LikedWhatToDiscardProblemIds($whatToDiscardProblemIds: [ID!]!) {\n  likedWhatToDiscardProblemIds(whatToDiscardProblemIds: $whatToDiscardProblemIds)\n}":
    types.LikedWhatToDiscardProblemIdsDocument,
  "mutation CreateWhatToDiscardProblemLike($problemId: ID!) {\n  createWhatToDiscardProblemLike(input: {problemId: $problemId}) {\n    like {\n      id\n      userId\n      likableId\n      likableType\n      createdAt\n    }\n  }\n}":
    types.CreateWhatToDiscardProblemLikeDocument,
  "mutation DeleteWhatToDiscardProblemLike($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemLike(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}":
    types.DeleteWhatToDiscardProblemLikeDocument,
  "mutation UpdateWhatToDiscardProblem($input: UpdateWhatToDiscardProblemInput!) {\n  updateWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}":
    types.UpdateWhatToDiscardProblemDocument,
  "query votedTileIds($whatToDiscardProblemIds: [ID!]!) {\n  votedTileIds(whatToDiscardProblemIds: $whatToDiscardProblemIds) {\n    tileId\n    whatToDiscardProblemId\n  }\n}":
    types.VotedTileIdsDocument,
  "mutation CreateWhatToDiscardProblemVote($problemId: ID!, $tileId: ID!) {\n  createWhatToDiscardProblemVote(input: {problemId: $problemId, tileId: $tileId}) {\n    vote {\n      id\n      tileId\n      whatToDiscardProblemId\n      userId\n      createdAt\n      updatedAt\n      tile {\n        id\n        suit\n        name\n        ordinalNumberInSuit\n      }\n    }\n  }\n}":
    types.CreateWhatToDiscardProblemVoteDocument,
  "mutation DeleteWhatToDiscardProblemVote($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemVote(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}":
    types.DeleteWhatToDiscardProblemVoteDocument,
  "query WhatToDiscardProblemVoteResult($whatToDiscardProblemId: ID!) {\n  whatToDiscardProblemVoteResults(whatToDiscardProblemId: $whatToDiscardProblemId) {\n    tileId\n    count\n    percentage\n  }\n}":
    types.WhatToDiscardProblemVoteResultDocument,
  "query WhatToDiscardProblem($id: ID!) {\n  whatToDiscardProblem(id: $id) {\n    id\n    round\n    turn\n    wind\n    points\n    description\n    votesCount\n    commentsCount\n    likesCount\n    doraId\n    hand1Id\n    hand2Id\n    hand3Id\n    hand4Id\n    hand5Id\n    hand6Id\n    hand7Id\n    hand8Id\n    hand9Id\n    hand10Id\n    hand11Id\n    hand12Id\n    hand13Id\n    tsumoId\n    createdAt\n    updatedAt\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}":
    types.WhatToDiscardProblemDocument,
  "query WhatToDiscardProblems($first: Int, $after: String) {\n  whatToDiscardProblems(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}":
    types.WhatToDiscardProblemsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query CurrentSession {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["query CurrentSession {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation LogoutUser {\n  logout(input: {}) {\n    success\n  }\n}",
): (typeof documents)["mutation LogoutUser {\n  logout(input: {}) {\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation RequestAuth($input: RequestAuthInput!) {\n  requestAuth(input: $input) {\n    success\n  }\n}",
): (typeof documents)["mutation RequestAuth($input: RequestAuthInput!) {\n  requestAuth(input: $input) {\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation VerifyAuth($input: VerifyAuthInput!) {\n  verifyAuth(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["mutation VerifyAuth($input: VerifyAuthInput!) {\n  verifyAuth(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateFollow($userId: ID!) {\n  createFollow(input: {userId: $userId}) {\n    follow {\n      id\n      followerId\n      followeeId\n    }\n  }\n}",
): (typeof documents)["mutation CreateFollow($userId: ID!) {\n  createFollow(input: {userId: $userId}) {\n    follow {\n      id\n      followerId\n      followeeId\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation DeleteFollow($userId: ID!) {\n  deleteFollow(input: {userId: $userId}) {\n    id\n  }\n}",
): (typeof documents)["mutation DeleteFollow($userId: ID!) {\n  deleteFollow(input: {userId: $userId}) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query Following($first: Int, $after: String) {\n  followings(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query Following($first: Int, $after: String) {\n  followings(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query Followers($first: Int, $after: String) {\n  followers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query Followers($first: Int, $after: String) {\n  followers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query MutualFollowers($first: Int, $after: String) {\n  mutualFollowers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        avatarUrl\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query MutualFollowers($first: Int, $after: String) {\n  mutualFollowers(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        name\n        avatarUrl\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateMahjongSession($input: CreateMahjongSessionInput!) {\n  createMahjongSession(input: $input) {\n    mahjongSession {\n      id\n      name\n      mahjongScoringSetting {\n        id\n        rate\n        chipAmount\n      }\n      mahjongParticipants {\n        id\n        name\n        userId\n      }\n      mahjongGames {\n        id\n        mahjongResults {\n          id\n          ranking\n          resultPoints\n        }\n      }\n    }\n  }\n}",
): (typeof documents)["mutation CreateMahjongSession($input: CreateMahjongSessionInput!) {\n  createMahjongSession(input: $input) {\n    mahjongSession {\n      id\n      name\n      mahjongScoringSetting {\n        id\n        rate\n        chipAmount\n      }\n      mahjongParticipants {\n        id\n        name\n        userId\n      }\n      mahjongGames {\n        id\n        mahjongResults {\n          id\n          ranking\n          resultPoints\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query ParticipatedMahjongSession($id: ID!) {\n  participatedMahjongSession(id: $id) {\n    id\n    name\n    creatorUser {\n      id\n      name\n      avatarUrl\n    }\n    mahjongScoringSetting {\n      id\n      rate\n      chipAmount\n      umaRuleLabel\n      okaRuleLabel\n    }\n    mahjongParticipants {\n      id\n      userId\n      name\n      averageRanking\n      totalPoints\n      totalProfits\n      user {\n        id\n        name\n        avatarUrl\n      }\n    }\n    mahjongGames {\n      id\n      mahjongResults {\n        id\n        ranking\n        score\n        resultPoints\n        mahjongParticipantId\n      }\n    }\n    createdAt\n    updatedAt\n  }\n}",
): (typeof documents)["query ParticipatedMahjongSession($id: ID!) {\n  participatedMahjongSession(id: $id) {\n    id\n    name\n    creatorUser {\n      id\n      name\n      avatarUrl\n    }\n    mahjongScoringSetting {\n      id\n      rate\n      chipAmount\n      umaRuleLabel\n      okaRuleLabel\n    }\n    mahjongParticipants {\n      id\n      userId\n      name\n      averageRanking\n      totalPoints\n      totalProfits\n      user {\n        id\n        name\n        avatarUrl\n      }\n    }\n    mahjongGames {\n      id\n      mahjongResults {\n        id\n        ranking\n        score\n        resultPoints\n        mahjongParticipantId\n      }\n    }\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query ParticipatedMahjongSessions($after: String, $first: Int) {\n  participatedMahjongSessions(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        name\n        totalGameFee\n        myTotalPoints\n        myAverageRanking\n        myTotalProfits\n        creatorUser {\n          id\n          name\n        }\n        mahjongScoringSetting {\n          id\n          rate\n          chipAmount\n          umaRuleLabel\n          okaRuleLabel\n        }\n        participantUsers {\n          id\n          name\n        }\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query ParticipatedMahjongSessions($after: String, $first: Int) {\n  participatedMahjongSessions(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        name\n        totalGameFee\n        myTotalPoints\n        myAverageRanking\n        myTotalProfits\n        creatorUser {\n          id\n          name\n        }\n        mahjongScoringSetting {\n          id\n          rate\n          chipAmount\n          umaRuleLabel\n          okaRuleLabel\n        }\n        participantUsers {\n          id\n          name\n        }\n        createdAt\n        updatedAt\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query VotedWhatToDiscardProblems($after: String, $first: Int) {\n  votedWhatToDiscardProblems(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query VotedWhatToDiscardProblems($after: String, $first: Int) {\n  votedWhatToDiscardProblems(after: $after, first: $first) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["mutation CreateUser($input: CreateUserInput!) {\n  createUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query CurrentUserProfile {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["query CurrentUserProfile {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["mutation UpdateUser($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation UpdateUserProfile($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["mutation UpdateUserProfile($input: UpdateUserInput!) {\n  updateUser(input: $input) {\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query UserProfile($userId: ID!) {\n  user(id: $userId) {\n    id\n    name\n    email\n    profileText\n    avatarUrl\n    isFollowing\n    followingCount\n    followersCount\n    createdAt\n    updatedAt\n  }\n}",
): (typeof documents)["query UserProfile($userId: ID!) {\n  user(id: $userId) {\n    id\n    name\n    email\n    profileText\n    avatarUrl\n    isFollowing\n    followingCount\n    followersCount\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation WithdrawUser {\n  withdrawUser(input: {}) {\n    success\n  }\n}",
): (typeof documents)["mutation WithdrawUser {\n  withdrawUser(input: {}) {\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query WithdrawalSummary {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["query WithdrawalSummary {\n  currentSession {\n    isLoggedIn\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query CommentReplies($parentCommentId: ID!, $problemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemCommentReplies(\n    parentCommentId: $parentCommentId\n    problemId: $problemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query CommentReplies($parentCommentId: ID!, $problemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemCommentReplies(\n    parentCommentId: $parentCommentId\n    problemId: $problemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateComment($whatToDiscardProblemId: ID!, $content: String!, $parentCommentId: ID) {\n  createWhatToDiscardProblemComment(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId, content: $content, parentCommentId: $parentCommentId}\n  ) {\n    comment {\n      id\n      content\n      userId\n      parentCommentId\n      repliesCount\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}",
): (typeof documents)["mutation CreateComment($whatToDiscardProblemId: ID!, $content: String!, $parentCommentId: ID) {\n  createWhatToDiscardProblemComment(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId, content: $content, parentCommentId: $parentCommentId}\n  ) {\n    comment {\n      id\n      content\n      userId\n      parentCommentId\n      repliesCount\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation DeleteComment($commentId: ID!) {\n  deleteWhatToDiscardProblemComment(input: {commentId: $commentId}) {\n    id\n  }\n}",
): (typeof documents)["mutation DeleteComment($commentId: ID!) {\n  deleteWhatToDiscardProblemComment(input: {commentId: $commentId}) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query ParentComments($whatToDiscardProblemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemComments(\n    whatToDiscardProblemId: $whatToDiscardProblemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query ParentComments($whatToDiscardProblemId: ID!, $first: Int, $after: String) {\n  whatToDiscardProblemComments(\n    whatToDiscardProblemId: $whatToDiscardProblemId\n    first: $first\n    after: $after\n  ) {\n    edges {\n      node {\n        id\n        content\n        userId\n        parentCommentId\n        repliesCount\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n          email\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateWhatToDiscardProblem($input: CreateWhatToDiscardProblemInput!) {\n  createWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}",
): (typeof documents)["mutation CreateWhatToDiscardProblem($input: CreateWhatToDiscardProblemInput!) {\n  createWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation DeleteWhatToDiscardProblem($input: DeleteWhatToDiscardProblemInput!) {\n  deleteWhatToDiscardProblem(input: $input) {\n    id\n  }\n}",
): (typeof documents)["mutation DeleteWhatToDiscardProblem($input: DeleteWhatToDiscardProblemInput!) {\n  deleteWhatToDiscardProblem(input: $input) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query LikedWhatToDiscardProblemIds($whatToDiscardProblemIds: [ID!]!) {\n  likedWhatToDiscardProblemIds(whatToDiscardProblemIds: $whatToDiscardProblemIds)\n}",
): (typeof documents)["query LikedWhatToDiscardProblemIds($whatToDiscardProblemIds: [ID!]!) {\n  likedWhatToDiscardProblemIds(whatToDiscardProblemIds: $whatToDiscardProblemIds)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateWhatToDiscardProblemLike($problemId: ID!) {\n  createWhatToDiscardProblemLike(input: {problemId: $problemId}) {\n    like {\n      id\n      userId\n      likableId\n      likableType\n      createdAt\n    }\n  }\n}",
): (typeof documents)["mutation CreateWhatToDiscardProblemLike($problemId: ID!) {\n  createWhatToDiscardProblemLike(input: {problemId: $problemId}) {\n    like {\n      id\n      userId\n      likableId\n      likableType\n      createdAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation DeleteWhatToDiscardProblemLike($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemLike(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}",
): (typeof documents)["mutation DeleteWhatToDiscardProblemLike($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemLike(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation UpdateWhatToDiscardProblem($input: UpdateWhatToDiscardProblemInput!) {\n  updateWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}",
): (typeof documents)["mutation UpdateWhatToDiscardProblem($input: UpdateWhatToDiscardProblemInput!) {\n  updateWhatToDiscardProblem(input: $input) {\n    whatToDiscardProblem {\n      id\n      round\n      turn\n      wind\n      points\n      description\n      votesCount\n      commentsCount\n      likesCount\n      doraId\n      hand1Id\n      hand2Id\n      hand3Id\n      hand4Id\n      hand5Id\n      hand6Id\n      hand7Id\n      hand8Id\n      hand9Id\n      hand10Id\n      hand11Id\n      hand12Id\n      hand13Id\n      tsumoId\n      isLikedByMe\n      myVoteTileId\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n        profileText\n        avatarUrl\n        isFollowing\n        followingCount\n        followersCount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query votedTileIds($whatToDiscardProblemIds: [ID!]!) {\n  votedTileIds(whatToDiscardProblemIds: $whatToDiscardProblemIds) {\n    tileId\n    whatToDiscardProblemId\n  }\n}",
): (typeof documents)["query votedTileIds($whatToDiscardProblemIds: [ID!]!) {\n  votedTileIds(whatToDiscardProblemIds: $whatToDiscardProblemIds) {\n    tileId\n    whatToDiscardProblemId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateWhatToDiscardProblemVote($problemId: ID!, $tileId: ID!) {\n  createWhatToDiscardProblemVote(input: {problemId: $problemId, tileId: $tileId}) {\n    vote {\n      id\n      tileId\n      whatToDiscardProblemId\n      userId\n      createdAt\n      updatedAt\n      tile {\n        id\n        suit\n        name\n        ordinalNumberInSuit\n      }\n    }\n  }\n}",
): (typeof documents)["mutation CreateWhatToDiscardProblemVote($problemId: ID!, $tileId: ID!) {\n  createWhatToDiscardProblemVote(input: {problemId: $problemId, tileId: $tileId}) {\n    vote {\n      id\n      tileId\n      whatToDiscardProblemId\n      userId\n      createdAt\n      updatedAt\n      tile {\n        id\n        suit\n        name\n        ordinalNumberInSuit\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation DeleteWhatToDiscardProblemVote($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemVote(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}",
): (typeof documents)["mutation DeleteWhatToDiscardProblemVote($whatToDiscardProblemId: ID!) {\n  deleteWhatToDiscardProblemVote(\n    input: {whatToDiscardProblemId: $whatToDiscardProblemId}\n  ) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query WhatToDiscardProblemVoteResult($whatToDiscardProblemId: ID!) {\n  whatToDiscardProblemVoteResults(whatToDiscardProblemId: $whatToDiscardProblemId) {\n    tileId\n    count\n    percentage\n  }\n}",
): (typeof documents)["query WhatToDiscardProblemVoteResult($whatToDiscardProblemId: ID!) {\n  whatToDiscardProblemVoteResults(whatToDiscardProblemId: $whatToDiscardProblemId) {\n    tileId\n    count\n    percentage\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query WhatToDiscardProblem($id: ID!) {\n  whatToDiscardProblem(id: $id) {\n    id\n    round\n    turn\n    wind\n    points\n    description\n    votesCount\n    commentsCount\n    likesCount\n    doraId\n    hand1Id\n    hand2Id\n    hand3Id\n    hand4Id\n    hand5Id\n    hand6Id\n    hand7Id\n    hand8Id\n    hand9Id\n    hand10Id\n    hand11Id\n    hand12Id\n    hand13Id\n    tsumoId\n    createdAt\n    updatedAt\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}",
): (typeof documents)["query WhatToDiscardProblem($id: ID!) {\n  whatToDiscardProblem(id: $id) {\n    id\n    round\n    turn\n    wind\n    points\n    description\n    votesCount\n    commentsCount\n    likesCount\n    doraId\n    hand1Id\n    hand2Id\n    hand3Id\n    hand4Id\n    hand5Id\n    hand6Id\n    hand7Id\n    hand8Id\n    hand9Id\n    hand10Id\n    hand11Id\n    hand12Id\n    hand13Id\n    tsumoId\n    createdAt\n    updatedAt\n    user {\n      id\n      name\n      email\n      profileText\n      avatarUrl\n      isFollowing\n      followingCount\n      followersCount\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query WhatToDiscardProblems($first: Int, $after: String) {\n  whatToDiscardProblems(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
): (typeof documents)["query WhatToDiscardProblems($first: Int, $after: String) {\n  whatToDiscardProblems(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        round\n        turn\n        wind\n        points\n        description\n        votesCount\n        commentsCount\n        likesCount\n        doraId\n        hand1Id\n        hand2Id\n        hand3Id\n        hand4Id\n        hand5Id\n        hand6Id\n        hand7Id\n        hand8Id\n        hand9Id\n        hand10Id\n        hand11Id\n        hand12Id\n        hand13Id\n        tsumoId\n        createdAt\n        updatedAt\n        isLikedByMe\n        myVoteTileId\n        user {\n          id\n          name\n          profileText\n          avatarUrl\n          isFollowing\n          followingCount\n          followersCount\n          createdAt\n          updatedAt\n        }\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
