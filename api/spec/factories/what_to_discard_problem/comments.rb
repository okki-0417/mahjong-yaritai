# frozen_string_literal: true

FactoryBot.define do
  factory :comment do
    association :user
    association :commentable, factory: :what_to_discard_problem
    parent_comment_id { nil }
    content { "test content" }
  end
end
