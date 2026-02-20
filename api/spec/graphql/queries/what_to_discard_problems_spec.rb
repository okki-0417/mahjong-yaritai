# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Queries::WhatToDiscardProblems", type: :request do
  include GraphqlHelper

  describe "whatToDiscardProblems" do
    subject do
      execute_query(query, variables)
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:variables) { {} }
    let(:query) do
      <<~GQL
        query {
          whatToDiscardProblems {
            edges {
              node {
                id
                round
                turn
                wind
                points
                description
                doraId
                hand1Id
                hand2Id
                hand3Id
                isLikedByMe
                myVoteTileId
                user {
                  id
                  name
                  avatarUrl
                }
                likesCount
                votesCount
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      GQL
    end

    context "問題が存在しない場合" do
      it "空のedgesを返すこと" do
        json = subject

        expect(json[:errors]).to be_nil
        expect(json[:data][:whatToDiscardProblems][:edges]).to eq([])
        expect(json[:data][:whatToDiscardProblems][:pageInfo][:hasNextPage]).to eq(false)
      end
    end

    context "問題が存在する場合" do
      let!(:problems) { create_list(:what_to_discard_problem, 3).sort_by(&:id).reverse }

      it "降順で問題を返すこと" do
        json = subject

        expect(json[:errors]).to be_nil

        edges = json[:data][:whatToDiscardProblems][:edges]
        expect(edges.length).to eq(3)
        expect(edges[0][:node][:id]).to eq(problems[0].id.to_s)
        expect(edges[1][:node][:id]).to eq(problems[1].id.to_s)
        expect(edges[2][:node][:id]).to eq(problems[2].id.to_s)
      end

      it "ユーザー情報が含まれること" do
        json = subject

        user = json[:data][:whatToDiscardProblems][:edges][0][:node][:user]

        expect(user[:id]).to eq(problems[0].user.id.to_s)
        expect(user[:name]).to eq(problems[0].user.name)
      end

      it "牌のIDが含まれること" do
        json = subject

        node = json[:data][:whatToDiscardProblems][:edges][0][:node]

        expect(node[:doraId]).to eq(problems[0].dora_id.to_s)
        expect(node[:hand1Id]).to eq(problems[0].hand1_id.to_s)
        expect(node[:hand2Id]).to eq(problems[0].hand2_id.to_s)
        expect(node[:hand3Id]).to eq(problems[0].hand3_id.to_s)
      end

      it "カウント情報が含まれること" do
        json = subject

        node = json[:data][:whatToDiscardProblems][:edges][0][:node]

        expect(node[:likesCount]).to eq(0)
        expect(node[:votesCount]).to eq(0)
      end
    end
  end
end
