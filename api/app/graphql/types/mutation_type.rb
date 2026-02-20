# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :request_auth, mutation: Mutations::Auth::RequestAuth
    field :verify_auth, mutation: Mutations::Auth::VerifyAuth
    field :logout, mutation: Mutations::Auth::Logout

    field :create_user, mutation: Mutations::Users::CreateUser
    field :update_user, mutation: Mutations::Users::UpdateUser
    field :withdraw_user, mutation: Mutations::Users::WithdrawUser

    field :create_follow, mutation: Mutations::Follows::CreateFollow
    field :delete_follow, mutation: Mutations::Follows::DeleteFollow

    field :create_what_to_discard_problem, mutation: Mutations::WhatToDiscardProblems::CreateWhatToDiscardProblem
    field :update_what_to_discard_problem, mutation: Mutations::WhatToDiscardProblems::UpdateWhatToDiscardProblem
    field :delete_what_to_discard_problem, mutation: Mutations::WhatToDiscardProblems::DeleteWhatToDiscardProblem

    field :create_what_to_discard_problem_comment, mutation: Mutations::WhatToDiscardProblems::Comments::CreateWhatToDiscardProblemComment
    field :delete_what_to_discard_problem_comment, mutation: Mutations::WhatToDiscardProblems::Comments::DeleteWhatToDiscardProblemComment

    field :create_what_to_discard_problem_vote, mutation: Mutations::WhatToDiscardProblems::Votes::CreateWhatToDiscardProblemVote
    field :delete_what_to_discard_problem_vote, mutation: Mutations::WhatToDiscardProblems::Votes::DeleteWhatToDiscardProblemVote

    field :create_what_to_discard_problem_like, mutation: Mutations::WhatToDiscardProblems::Likes::CreateWhatToDiscardProblemLike
    field :delete_what_to_discard_problem_like, mutation: Mutations::WhatToDiscardProblems::Likes::DeleteWhatToDiscardProblemLike

    field :create_mahjong_session, mutation: Mutations::MahjongSessions::CreateMahjongSession
  end
end
