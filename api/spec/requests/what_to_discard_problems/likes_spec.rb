# frozen_string_literal: true

require "rails_helper"

RSpec.describe "WhatToDiscardProblems::Likes", type: :request do
  include LoginHelper

  let!(:problem) { create(:what_to_discard_problem) }

  describe "POST /what_to_discard_problems/:what_to_discard_problem_id/likes" do
    subject do
      post what_to_discard_problem_likes_url(problem),
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
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      it "いいねを作成して201を返すこと" do
        expect { subject }.to change(Like, :count).by(1)
        expect(response).to have_http_status(:created)

        json = response.parsed_body
        expect(json["user_id"]).to eq(current_user.id)
        expect(json["likable_id"]).to eq(problem.id)
        expect(json["likable_type"]).to eq("WhatToDiscardProblem")

        assert_schema_conform(201)
      end

      context "既にいいね済みの場合" do
        before { create(:like, user: current_user, likable: problem) }

        it "422を返すこと" do
          expect { subject }.not_to change(Like, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          assert_schema_conform(422)
        end
      end

      context "存在しない問題の場合" do
        subject do
          post what_to_discard_problem_likes_url(999999),
            headers: { "Authorization" => "Bearer #{access_token}" }
        end

        it "404を返すこと" do
          subject
          expect(response).to have_http_status(:not_found)

          assert_schema_conform(404)
        end
      end
    end
  end

  describe "DELETE /what_to_discard_problems/:what_to_discard_problem_id/likes/:id" do
    let(:current_user) { create(:user) }
    let!(:like) { create(:like, user: current_user, likable: problem) }

    subject do
      delete what_to_discard_problem_like_url(problem, like),
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

      it "いいねを削除して204を返すこと" do
        expect { subject }.to change(Like, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end

      context "存在しない問題の場合" do
        subject do
          delete what_to_discard_problem_like_url(999999, like),
            headers: { "Authorization" => "Bearer #{access_token}" }
        end

        it "404を返すこと" do
          subject
          expect(response).to have_http_status(:not_found)

          assert_schema_conform(404)
        end
      end

      context "存在しないいいねの場合" do
        subject do
          delete what_to_discard_problem_like_url(problem, 999999),
            headers: { "Authorization" => "Bearer #{access_token}" }
        end

        it "404を返すこと" do
          subject
          expect(response).to have_http_status(:not_found)

          assert_schema_conform(404)
        end
      end
    end
  end
end
