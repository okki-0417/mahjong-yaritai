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
        expect(json["problems"].first["my_like_id"]).to be_nil
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
        let!(:like) { create(:like, user: current_user, likable: problem) }

        it "my_like_idにいいねのIDが設定されること" do
          subject
          json = response.parsed_body
          liked_problem = json["problems"].find { |p| p["id"] == problem.id }
          expect(liked_problem["my_like_id"]).to eq(like.id)

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

  describe "GET /what_to_discard_problems/:id" do
    subject do
      get what_to_discard_problem_url(problem_id),
        headers: { "Authorization" => "Bearer #{access_token}" }
    end

    let!(:problem) { create(:what_to_discard_problem) }
    let(:problem_id) { problem.id }

    context "ログインしていない場合" do
      let(:access_token) { nil }

      it "問題を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["id"]).to eq(problem.id)
        expect(json["my_like_id"]).to be_nil
        expect(json["my_vote_tile_id"]).to be_nil

        assert_schema_conform(200)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      it "問題を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        json = response.parsed_body
        expect(json["id"]).to eq(problem.id)

        assert_schema_conform(200)
      end

      context "いいねしている場合" do
        let!(:like) { create(:like, user: current_user, likable: problem) }

        it "my_like_idにいいねのIDが設定されること" do
          subject
          json = response.parsed_body
          expect(json["my_like_id"]).to eq(like.id)

          assert_schema_conform(200)
        end
      end

      context "投票している場合" do
        let(:tile) { Tile.first }

        before { create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: problem, tile:) }

        it "my_vote_tile_idが設定されること" do
          subject
          json = response.parsed_body
          expect(json["my_vote_tile_id"]).to eq(tile.id)

          assert_schema_conform(200)
        end
      end
    end

    context "存在しない問題の場合" do
      let(:access_token) { nil }
      let(:problem_id) { 999999 }

      it "404を返すこと" do
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /what_to_discard_problems" do
    subject do
      post what_to_discard_problems_url,
        params: params.to_json,
        headers: {
          "Authorization" => "Bearer #{access_token}",
          "Content-Type" => "application/json",
        }
    end

    let!(:tiles) { create_list(:tile, 15) }
    let(:params) do
      {
        round: "東一",
        turn: 2,
        wind: "東",
        points: 25000,
        description: "テスト問題です",
        dora_id: tiles[0].id,
        hand1_id: tiles[1].id,
        hand2_id: tiles[2].id,
        hand3_id: tiles[3].id,
        hand4_id: tiles[4].id,
        hand5_id: tiles[5].id,
        hand6_id: tiles[6].id,
        hand7_id: tiles[7].id,
        hand8_id: tiles[8].id,
        hand9_id: tiles[9].id,
        hand10_id: tiles[10].id,
        hand11_id: tiles[11].id,
        hand12_id: tiles[12].id,
        hand13_id: tiles[13].id,
        tsumo_id: tiles[14].id,
      }
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

      it "問題を作成して201を返すこと" do
        expect { subject }.to change(WhatToDiscardProblem, :count).by(1)
        expect(response).to have_http_status(:created)

        json = response.parsed_body
        expect(json["round"]).to eq("東一")
        expect(json["turn"]).to eq(2)
        expect(json["wind"]).to eq("東")
        expect(json["points"]).to eq(25000)
        expect(json["description"]).to eq("テスト問題です")
        expect(json["user"]["id"]).to eq(current_user.id)

        assert_schema_conform(201)
      end

      context "バリデーションエラーの場合" do
        let(:params) do
          {
            dora_id: tiles[0].id,
            hand1_id: tiles[0].id,
            hand2_id: tiles[0].id,
            hand3_id: tiles[0].id,
            hand4_id: tiles[0].id,
            hand5_id: tiles[0].id,
            hand6_id: tiles[1].id,
            hand7_id: tiles[2].id,
            hand8_id: tiles[3].id,
            hand9_id: tiles[4].id,
            hand10_id: tiles[5].id,
            hand11_id: tiles[6].id,
            hand12_id: tiles[7].id,
            hand13_id: tiles[8].id,
            tsumo_id: tiles[9].id,
          }
        end

        it "422を返すこと" do
          expect { subject }.not_to change(WhatToDiscardProblem, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          assert_schema_conform(422)
        end
      end
    end
  end

  describe "PUT /what_to_discard_problems/:id" do
    subject do
      put what_to_discard_problem_url(problem_id),
        params: params.to_json,
        headers: {
          "Authorization" => "Bearer #{access_token}",
          "Content-Type" => "application/json",
        }
    end

    let!(:problem) { create(:what_to_discard_problem) }
    let(:problem_id) { problem.id }
    let(:base_params) do
      {
        dora_id: problem.dora_id,
        hand1_id: problem.hand1_id,
        hand2_id: problem.hand2_id,
        hand3_id: problem.hand3_id,
        hand4_id: problem.hand4_id,
        hand5_id: problem.hand5_id,
        hand6_id: problem.hand6_id,
        hand7_id: problem.hand7_id,
        hand8_id: problem.hand8_id,
        hand9_id: problem.hand9_id,
        hand10_id: problem.hand10_id,
        hand11_id: problem.hand11_id,
        hand12_id: problem.hand12_id,
        hand13_id: problem.hand13_id,
        tsumo_id: problem.tsumo_id,
      }
    end
    let(:params) { base_params.merge(description: "更新された説明文") }

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

      context "自分の問題を更新する場合" do
        let!(:problem) { create(:what_to_discard_problem, user: current_user) }

        it "問題を更新して200を返すこと" do
          subject
          expect(response).to have_http_status(:ok)

          json = response.parsed_body
          expect(json["description"]).to eq("更新された説明文")

          assert_schema_conform(200)
        end

        context "複数のフィールドを更新する場合" do
          let(:params) { base_params.merge(round: "南二", turn: 5, wind: "南", points: 30000) }

          it "問題を更新すること" do
            subject
            expect(response).to have_http_status(:ok)

            json = response.parsed_body
            expect(json["round"]).to eq("南二")
            expect(json["turn"]).to eq(5)
            expect(json["wind"]).to eq("南")
            expect(json["points"]).to eq(30000)

            assert_schema_conform(200)
          end
        end
      end

      context "他のユーザーの問題を更新しようとした場合" do
        let!(:other_user) { create(:user) }
        let!(:problem) { create(:what_to_discard_problem, user: other_user) }

        it "404を返すこと" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe "DELETE /what_to_discard_problems/:id" do
    subject do
      delete what_to_discard_problem_url(problem_id),
        headers: { "Authorization" => "Bearer #{access_token}" }
    end

    let!(:problem) { create(:what_to_discard_problem) }
    let(:problem_id) { problem.id }

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

      context "自分の問題を削除する場合" do
        let!(:problem) { create(:what_to_discard_problem, user: current_user) }

        it "問題を削除して204を返すこと" do
          expect { subject }.to change(WhatToDiscardProblem, :count).by(-1)
          expect(response).to have_http_status(:no_content)
        end
      end
    end
  end
end
