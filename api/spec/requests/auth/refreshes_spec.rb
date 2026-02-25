require "rails_helper"

RSpec.describe "Auth::Refreshes", type: :request do
  describe "POST /auth/refresh" do
    subject { post auth_refresh_path, params: params }

    let(:params) do
      {
        refresh_token: refresh_token,
      }
    end

    let(:refresh_token) { valid_refresh_token }
    let(:valid_refresh_token) do
      refresh_token_payload = {
        user_id: user.id,
        jti: user.jti,
        exp: (Time.now + 30.days).to_i,
      }

      JWT.encode(refresh_token_payload, Rails.application.secret_key_base)
    end
    let(:user) { create(:user) }

    context "リフレッシュトークンが与えられていない場合" do
      let(:refresh_token) { nil }

      it "403が返ること" do
        subject
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "リフレッシュトークンが与えられている場合" do
      context "JWTのデコードに失敗する場合" do
        let(:refresh_token) { "invalid_token" }

        it "403が返ること" do
          subject
          expect(response).to have_http_status(:unauthorized)
        end
      end

      context "リフレッシュトークンの有効期限が切れている場合" do
        let(:refresh_token) do
          refresh_token_payload = {
            user_id: user.id,
            jti: user.jti,
            exp: (Time.now - 1.hour).to_i,
          }

          JWT.encode(refresh_token_payload, Rails.application.secret_key_base)
        end

        it "403が返ること" do
          subject
          expect(response).to have_http_status(:unauthorized)
        end
      end

      context "期限内のリフレッシュトークンのデコードに成功する場合" do
        context "ユーザーが存在しない場合" do
          let(:refresh_token) do
            refresh_token_payload = {
              user_id: 0,
              jti: "some_jti",
              exp: (Time.now + 30.days).to_i,
            }

            JWT.encode(refresh_token_payload, Rails.application.secret_key_base)
          end

          it "403が返ること" do
            subject
            expect(response).to have_http_status(:unauthorized)
          end
        end

        context "ユーザーが存在する場合" do
          context "ユーザーのjtiとリフレッシュトークンのjtiが異なる場合" do
            let(:refresh_token) do
              refresh_token_payload = {
                user_id: create(:user).id,
                jti: "some_jti",
                exp: (Time.now + 30.days).to_i,
              }

              JWT.encode(refresh_token_payload, Rails.application.secret_key_base)
            end

            it "403が返ること" do
              subject
              expect(response).to have_http_status(:unauthorized)
            end
          end

          context "ユーザーのjtiとリフレッシュトークンのjtiが同じ場合" do
            it "新しいアクセストークンが返ること" do
              subject
              expect(response).to have_http_status(:created)
              json = JSON.parse(response.body)
              expect(json["access_token"]).not_to be_nil
            end
          end
        end
      end
    end
  end
end
