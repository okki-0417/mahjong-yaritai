# frozen_string_literal: true

require "rails_helper"

RSpec.describe "WhatToDiscardProblems", type: :request do
  include LoginHelper

  describe "GET /what_to_discard_problems" do
    subject do
      get what_to_discard_problems_url,
      headers: {
        "Authorization" => "Bearer #{access_token}",
      },
      params: params
    end
    before { create_list(:what_to_discard_problem, 3) }

    let(:params) { {} }

    context "ログインしていない場合" do
      let(:access_token) { nil }

      it "問題一覧を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["problems"].size).to eq(3)
        expect(json["problems"].first["is_liked_by_me"]).to be false
        expect(json["problems"].first["my_vote_tile_id"]).to be_nil

        assert_schema_conform(200)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      it "問題一覧を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["problems"].size).to eq(3)

        assert_schema_conform(200)
      end

      context "いいねしている問題がある場合" do
        let(:problem) { WhatToDiscardProblem.first }

        before do
          create(:like, user: current_user, likable: problem)
        end

        it "is_liked_by_meがtrueになること" do
          subject
          json = response.parsed_body
          liked_problem = json["problems"].find { |p| p["id"] == problem.id }
          expect(liked_problem["is_liked_by_me"]).to be true

          assert_schema_conform(200)
        end
      end

      context "投票している問題がある場合" do
        let(:problem) { WhatToDiscardProblem.first }
        let(:tile) { Tile.first }

        before do
          create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: problem, tile:)
        end

        it "my_vote_tile_idが設定されること" do
          subject
          json = response.parsed_body
          voted_problem = json["problems"].find { |p| p["id"] == problem.id }
          expect(voted_problem["my_vote_tile_id"]).to eq(tile.id)

          assert_schema_conform(200)
        end
      end
    end

    context "ページネーションが有効な場合" do
      let(:access_token) { nil }
      let(:params) { { first: 2 } }

      it "指定した件数を返すこと" do
        subject
        json = response.parsed_body
        expect(json["problems"].size).to eq(2)
        expect(json["page_info"]["has_next_page"]).to be true

        assert_schema_conform(200)
      end

      context "afterパラメータを指定した場合" do
        let(:params) { { first: 2, after: WhatToDiscardProblem.order(created_at: :desc).second.id } }

        it "カーソル以降の問題を返すこと" do
          subject
          json = response.parsed_body
          expect(json["problems"].size).to eq(1)
          expect(json["page_info"]["has_next_page"]).to be false
          expect(json["page_info"]["has_previous_page"]).to be true

          assert_schema_conform(200)
        end
      end
    end
  end
end
