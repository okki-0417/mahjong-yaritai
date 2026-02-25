# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Me::Followings", type: :request do
  include LoginHelper

  describe "POST /me/followings" do
    subject do
      post me_followings_url,
        params: { target_user_id: target_user.id },
        headers: { "Authorization" => "Bearer #{access_token}" },
        as: :json
    end

    let(:target_user) { create(:user) }

    context "ログインしていない場合" do
      let(:access_token) { "invalid_token" }

      it "401を返すこと" do
        subject
        expect(response).to have_http_status(:unauthorized)

        assert_schema_conform(401)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      context "まだフォローしていない場合" do
        it "フォローを作成して201を返すこと" do
          expect { subject }.to change(Follow, :count).by(1)
          expect(response).to have_http_status(:created)

          assert_schema_conform(201)
        end

        it "フォロー関係が正しく作成されること" do
          subject
          expect(current_user.reload.following?(target_user)).to be true
        end
      end

      context "既にフォローしている場合" do
        before { current_user.follow(target_user) }

        it "422を返すこと" do
          expect { subject }.not_to change(Follow, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          json = JSON.parse(response.body)
          expect(json["errors"]).to include("既にフォローしています")

          assert_schema_conform(422)
        end
      end

      context "自分自身をフォローしようとした場合" do
        let(:target_user) { current_user }

        it "422を返すこと" do
          expect { subject }.not_to change(Follow, :count)
          expect(response).to have_http_status(:unprocessable_entity)

          assert_schema_conform(422)
        end
      end

      context "存在しないユーザーをフォローしようとした場合" do
        subject do
          post me_followings_url,
            params: { target_user_id: 0 },
            headers: { "Authorization" => "Bearer #{access_token}" },
            as: :json
        end

        it "404を返すこと" do
          subject
          expect(response).to have_http_status(:not_found)

          assert_schema_conform(404)
        end
      end
    end
  end

  describe "DELETE /me/followings/:id" do
    subject do
      delete me_following_url(target_user.id),
        headers: { "Authorization" => "Bearer #{access_token}" }
    end

    let(:target_user) { create(:user) }

    context "ログインしていない場合" do
      let(:access_token) { "invalid_token" }

      it "401を返すこと" do
        subject
        expect(response).to have_http_status(:unauthorized)

        assert_schema_conform(401)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      context "フォローしている場合" do
        before { current_user.follow(target_user) }

        it "フォローを解除して204を返すこと" do
          expect { subject }.to change(Follow, :count).by(-1)
          expect(response).to have_http_status(:no_content)

          assert_schema_conform(204)
        end

        it "フォロー関係が解除されること" do
          subject
          expect(current_user.reload.following?(target_user)).to be false
        end
      end

      context "フォローしていない場合" do
        it "404を返すこと" do
          subject
          expect(response).to have_http_status(:not_found)

          json = JSON.parse(response.body)
          expect(json["errors"]).to include("フォローしていません")

          assert_schema_conform(404)
        end
      end

      context "存在しないユーザーを指定した場合" do
        subject do
          delete me_following_url(0),
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
