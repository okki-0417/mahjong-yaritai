# frozen_string_literal: true

require "rails_helper"

RSpec.describe "WhatToDiscardProblems::Votes", type: :request do
  include LoginHelper

  let!(:problem) { create(:what_to_discard_problem) }
  let!(:tile) { Tile.first || create(:tile) }

  describe "POST /what_to_discard_problems/:what_to_discard_problem_id/votes" do
    subject do
      post what_to_discard_problem_votes_url(problem),
        params: { tile_id: tile.id },
        headers: { "Authorization" => "Bearer #{access_token}" },
        as: :json
    end

    context "ログインしていない場合" do
      let(:access_token) { nil }

      it "401を返すこと" do
        subject
        expect(response).to have_http_status(:unauthorized)

        assert_schema_conform(401)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      it "投票を作成して201を返すこと" do
        expect { subject }.to change(WhatToDiscardProblem::Vote, :count).by(1)
        expect(response).to have_http_status(:created)

        json = response.parsed_body
        expect(json["user_id"]).to eq(current_user.id)
        expect(json["what_to_discard_problem_id"]).to eq(problem.id)
        expect(json["tile_id"]).to eq(tile.id)

        assert_schema_conform(201)
      end

      context "既に投票済みの場合" do
        let!(:existing_vote) { create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: problem, tile: tile) }
        let(:new_tile) { Tile.second || create(:tile) }

        subject do
          post what_to_discard_problem_votes_url(problem),
            params: { tile_id: new_tile.id },
            headers: { "Authorization" => "Bearer #{access_token}" },
            as: :json
        end

        it "既存の投票を上書きして201を返すこと" do
          expect { subject }.not_to change(WhatToDiscardProblem::Vote, :count)
          expect(response).to have_http_status(:created)

          json = response.parsed_body
          expect(json["tile_id"]).to eq(new_tile.id)

          assert_schema_conform(201)
        end
      end

    end
  end

  describe "DELETE /what_to_discard_problems/:what_to_discard_problem_id/votes/:id" do
    let(:current_user) { create(:user) }
    let!(:vote) { create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: problem) }

    subject do
      delete what_to_discard_problem_vote_url(problem, vote),
        headers: { "Authorization" => "Bearer #{access_token}" }
    end

    context "ログインしていない場合" do
      let(:access_token) { nil }

      it "401を返すこと" do
        subject
        expect(response).to have_http_status(:unauthorized)

        assert_schema_conform(401)
      end
    end

    context "ログインしている場合" do
      let(:access_token) { get_access_token(current_user) }

      it "投票を削除して204を返すこと" do
        expect { subject }.to change(WhatToDiscardProblem::Vote, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
