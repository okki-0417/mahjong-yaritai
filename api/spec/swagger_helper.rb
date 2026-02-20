# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  config.openapi_root = Rails.root.join("swagger").to_s
  config.openapi_format = :yaml

  config.openapi_specs = {
    "v1/swagger.yaml" => {
      openapi: "3.0.1",
      info: {
        title: "API V1",
        version: "v1",
      },
      paths: {},
      servers: [
        {
          url: "http://murai.local:3001",
        },
      ],
      components: {
        schemas: {
          Like: {
            type: :object,
            required: %w[id likable_type likable_id created_at updated_at],
            properties: {
              id: { type: :integer },
              user_id: { type: :integer },
              likable_type: { type: :string },
              likable_id: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          Comment: {
            type: :object,
            required: %w[id user replies_count commentable_type commentable_id content created_at
updated_at],
            properties: {
              id: { type: :integer },
              user: { "$ref" => "#/components/schemas/User" },
              parent_comment_id: { type: :integer, nullable: true },
              replies_count: { type: :integer },
              commentable_type: { type: :string },
              commentable_id: { type: :integer },
              content: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          User: {
            type: :object,
            required: %w[id name is_following created_at updated_at],
            properties: {
              id: { type: :integer },
              name: { type: :string },
              profile_text: { type: :string, nullable: true },
              avatar_url: { type: :string, nullable: true },
              is_following: { type: :boolean },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          WhatToDiscardProblemVote: {
            type: :object,
            required: %w[id user_id what_to_discard_problem_id tile created_at updated_at],
            properties: {
              id: { type: :integer },
              user_id: { type: :integer },
              what_to_discard_problem_id: { type: :integer },
              tile: { "$ref" => "#/components/schemas/Tile" },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          WhatToDiscardProblem: {
            type: :object,
            required: %w[
              id
              user
              round
              turn
              wind
              points
              dora_id
              hand1_id
              hand2_id
              hand3_id
              hand4_id
              hand5_id
              hand6_id
              hand7_id
              hand8_id
              hand9_id
              hand10_id
              hand11_id
              hand12_id
              hand13_id
              tsumo_id
              description
              comments_count
              likes_count
              votes_count
              created_at
              updated_at
            ],
            properties: {
              id: { type: :integer },
              user:  { "$ref" => "#/components/schemas/User" },
              round: { type: :string, nullable: true },
              turn: { type: :integer, nullable: true },
              wind: { type: :string, nullable: true },
              points: { type: :integer, nullable: true },
              dora_id: { type: :integer },
              hand1_id: { type: :integer },
              hand2_id: { type: :integer },
              hand3_id: { type: :integer },
              hand4_id: { type: :integer },
              hand5_id: { type: :integer },
              hand6_id: { type: :integer },
              hand7_id: { type: :integer },
              hand8_id: { type: :integer },
              hand9_id: { type: :integer },
              hand10_id: { type: :integer },
              hand11_id: { type: :integer },
              hand12_id: { type: :integer },
              hand13_id: { type: :integer },
              tsumo_id: { type: :integer },
              description: { type: :string, nullable: true },
              comments_count: { type: :integer },
              likes_count: { type: :integer },
              votes_count: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          WhatToDiscardProblem_NoRel: {
            type: :object,
            required: %w[user_id round turn wind point_east point_south point_west point_north
dora_id hand1_id hand2_id hand3_id hand4_id hand5_id hand6_id hand7_id hand8_id hand9_id hand10_id hand11_id hand12_id hand13_id tsumo_id description comments_count likes_count votes_count created_at updated_at],
            properties: {
              id: { type: :integer },
              user_id:  { type: :integer },
              round: { type: :string },
              turn: { type: :integer },
              wind: { type: :string },
              point_east: { type: :integer },
              point_south: { type: :integer },
              point_west: { type: :integer },
              point_north: { type: :integer },
              dora_id: { type: :integer },
              hand1_id: { type: :integer },
              hand2_id: { type: :integer },
              hand3_id: { type: :integer },
              hand4_id: { type: :integer },
              hand5_id: { type: :integer },
              hand6_id: { type: :integer },
              hand7_id: { type: :integer },
              hand8_id: { type: :integer },
              hand9_id: { type: :integer },
              hand10_id: { type: :integer },
              hand11_id: { type: :integer },
              hand12_id: { type: :integer },
              hand13_id: { type: :integer },
              tsumo_id: { type: :integer },
              comments_count: { type: :integer },
              likes_count: { type: :integer },
              votes_count: { type: :integer },
              is_liked_by_me: { type: :boolean },
              my_vote_tile_id: { type: :integer, nullable: true },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          WhatToDiscardProblemVoteResult: {
            type: :object,
            required: %w[tile_id count],
            properties: {
              tile_id: { type: :integer },
              count: { type: :integer },
            },
          },
          Tile: {
            type: :object,
            required: %w[id suit ordinal_number_in_suit name created_at updated_at],
            properties: {
              id: { type: :integer },
              suit: { type: :string },
              ordinal_number_in_suit: { type: :integer },
              name: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          Errors: {
            type: :array,
            items: {
              type: :object,
              required: %w[message],
              properties: {
                message: { type: :string },
              },
            },
          },
          CursorPagination: {
            type: :object,
            required: %w[has_next limit],
            properties: {
              next: { type: :integer, nullable: true },
              has_next: { type: :boolean },
              limit: { type: :integer },
            },
          },
          Meta: {
            type: :object,
            required: %w[cursor],
            properties: {
              cursor: { "$ref" => "#/components/schemas/CursorPagination" },
            },
          },
          Session: {
            type: :object,
            required: %w[
              is_logged_in
              user_id
            ],
            properties: {
              is_logged_in: { type: :boolean },
              user_id: { type: :integer, nullable: true },
            },
          },
          WithdrawalSummary: {
            type: :object,
            required: %w[what_to_discard_problems_count],
            properties: {
              what_to_discard_problems_count: { type: :integer },
            },
          },
          LearningCategory: {
            type: :object,
            required: %w[id name description created_at updated_at],
            properties: {
              id: { type: :integer },
              name: { type: :string },
              description: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          LearningQuestion: {
            type: :object,
            required: %w[id statement answer category created_at updated_at],
            properties: {
              id: { type: :integer },
              statement: { type: :string },
              answer: { type: :string },
              category: { "$ref" => "#/components/schemas/LearningCategory" },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time },
            },
          },
          Error: {
            type: :object,
            required: %w[error],
            properties: {
              error: { type: :string },
            },
          },
        },
      },
    },
  }
end
