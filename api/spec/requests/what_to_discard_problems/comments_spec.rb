# frozen_string_literal: true

require "rails_helper"

RSpec.describe "WhatToDiscardProblems::Comments", type: :request do
  include LoginHelper

  let!(:problem) { create(:what_to_discard_problem) }

  describe "GET /what_to_discard_problems/:what_to_discard_problem_id/comments" do
    subject do
      get what_to_discard_problem_comments_url(problem)
    end

    context "コメントがない場合" do
      it "空の配列を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["comments"]).to eq([])

        assert_schema_conform(200)
      end
    end

    context "コメントがある場合" do
      let!(:comment1) { create(:comment, commentable: problem) }
      let!(:comment2) { create(:comment, commentable: problem) }
      let!(:reply) { create(:comment, commentable: problem, parent_comment_id: comment1.id) }

      it "親コメントのみを返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["comments"].length).to eq(2)
        expect(json["comments"].map { |c| c["id"] }).to eq([comment2.id, comment1.id])

        assert_schema_conform(200)
      end

      it "コメントにユーザー情報が含まれること" do
        subject
        json = response.parsed_body
        comment = json["comments"].first

        expect(comment["user"]["id"]).to eq(comment2.user.id)
        expect(comment["user"]["name"]).to eq(comment2.user.name)
      end

      it "replies_countが正しいこと" do
        subject
        json = response.parsed_body
        comment_with_reply = json["comments"].find { |c| c["id"] == comment1.id }
        comment_without_reply = json["comments"].find { |c| c["id"] == comment2.id }

        expect(comment_with_reply["replies_count"]).to eq(1)
        expect(comment_without_reply["replies_count"]).to eq(0)
      end
    end

    context "存在しない問題の場合" do
      subject do
        get what_to_discard_problem_comments_url(999999)
      end

      it "404を返すこと" do
        subject
        expect(response).to have_http_status(:not_found)

        assert_schema_conform(404)
      end
    end
  end

  describe "POST /what_to_discard_problems/:what_to_discard_problem_id/comments" do
    subject do
      post what_to_discard_problem_comments_url(problem),
        params: { comment: comment_params }.to_json,
        headers: { "Authorization" => "Bearer #{access_token}", "Content-Type" => "application/json" }
    end

    let(:comment_params) { { content: "これはテストコメントです" } }

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

      it "コメントを作成して201を返すこと" do
        expect { subject }.to change(Comment, :count).by(1)
        expect(response).to have_http_status(:created)

        json = response.parsed_body
        expect(json["content"]).to eq("これはテストコメントです")
        expect(json["user"]["id"]).to eq(current_user.id)
        expect(json["parent_comment_id"]).to be_nil

        assert_schema_conform(201)
      end

      context "返信コメントの場合" do
        let!(:parent_comment) { create(:comment, commentable: problem) }
        let(:comment_params) { { content: "これは返信コメントです", parent_comment_id: parent_comment.id } }

        it "返信コメントを作成して201を返すこと" do
          expect { subject }.to change(Comment, :count).by(1)
          expect(response).to have_http_status(:created)

          json = response.parsed_body
          expect(json["content"]).to eq("これは返信コメントです")
          expect(json["parent_comment_id"]).to eq(parent_comment.id)

          assert_schema_conform(201)
        end
      end

      context "コンテンツが空の場合" do
        let(:comment_params) { { content: "" } }

        it "422を返すこと" do
          expect { subject }.not_to change(Comment, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          assert_schema_conform(422)
        end
      end

      context "コンテンツが500文字を超える場合" do
        let(:comment_params) { { content: "あ" * 501 } }

        it "422を返すこと" do
          expect { subject }.not_to change(Comment, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          # リクエストが不正なためレスポンススキーマのみ検証
          assert_response_schema_confirm(422)
        end
      end

      context "存在しない問題の場合" do
        subject do
          post what_to_discard_problem_comments_url(999999),
            params: { comment: comment_params }.to_json,
            headers: { "Authorization" => "Bearer #{access_token}", "Content-Type" => "application/json" }
        end

        it "404を返すこと" do
          subject
          expect(response).to have_http_status(:not_found)

          assert_schema_conform(404)
        end
      end

      context "存在しない親コメントの場合" do
        let(:comment_params) { { content: "これは返信コメントです", parent_comment_id: 999999 } }

        it "422を返すこと" do
          expect { subject }.not_to change(Comment, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          assert_schema_conform(422)
        end
      end
    end
  end

  describe "GET /what_to_discard_problems/:what_to_discard_problem_id/comments/:comment_id/replies" do
    let!(:parent_comment) { create(:comment, commentable: problem) }

    subject do
      get what_to_discard_problem_comment_replies_url(problem, parent_comment)
    end

    context "返信がない場合" do
      it "空の配列を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["comments"]).to eq([])

        assert_schema_conform(200)
      end
    end

    context "返信がある場合" do
      let!(:reply1) { create(:comment, commentable: problem, parent_comment_id: parent_comment.id) }
      let!(:reply2) { create(:comment, commentable: problem, parent_comment_id: parent_comment.id) }
      let!(:other_comment) { create(:comment, commentable: problem) }

      it "指定したコメントの返信のみを返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["comments"].length).to eq(2)
        expect(json["comments"].map { |c| c["id"] }).to eq([reply2.id, reply1.id])

        assert_schema_conform(200)
      end

      it "返信にユーザー情報が含まれること" do
        subject
        json = response.parsed_body
        reply = json["comments"].first

        expect(reply["user"]["id"]).to eq(reply2.user.id)
        expect(reply["user"]["name"]).to eq(reply2.user.name)
      end
    end

    context "存在しないコメントの場合" do
      subject do
        get what_to_discard_problem_comment_replies_url(problem, 999999)
      end

      it "404を返すこと" do
        subject
        expect(response).to have_http_status(:not_found)

        assert_schema_conform(404)
      end
    end
  end
end
