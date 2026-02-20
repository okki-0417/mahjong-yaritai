# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [ Types::NodeType, null: true ], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ ID ], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    field :current_session, resolver: Resolvers::Sessions::ShowSession

    field :user, resolver: Resolvers::Users::ShowUser
    field :followings, resolver: Resolvers::Me::Followings::ListFollowings
    field :followers, resolver: Resolvers::Me::Followers::ListFollowers
    field :mutual_followers, resolver: Resolvers::Me::MutualFollowers
    field :voted_what_to_discard_problems, resolver: Resolvers::Me::WhatToDiscardProblems::VotedWhatToDiscardProblems

    field :what_to_discard_problems, resolver: Resolvers::WhatToDiscardProblems::ListWhatToDiscardProblems
    field :what_to_discard_problem, resolver: Resolvers::WhatToDiscardProblems::ShowWhatToDiscardProblem
    field :what_to_discard_problem_vote_results, resolver: Resolvers::WhatToDiscardProblems::VoteResults::ListWhatToDiscardProblemVoteResults
    field :what_to_discard_problem_comments, resolver: Resolvers::WhatToDiscardProblems::Comments::ListWhatToDiscardProblemComments
    field :what_to_discard_problem_comment_replies, resolver: Resolvers::WhatToDiscardProblems::Comments::ListWhatToDiscardProblemCommentReplies

    field :liked_what_to_discard_problem_ids, resolver: Resolvers::WhatToDiscardProblems::LikedWhatToDiscardProblemIds
    field :voted_tile_ids, resolver: Resolvers::WhatToDiscardProblems::VotedTileIds

    field :participated_mahjong_sessions, resolver: Resolvers::Me::ParticipatedMahjongSessions
    field :participated_mahjong_session, resolver: Resolvers::Me::ParticipatedMahjongSession
  end
end
