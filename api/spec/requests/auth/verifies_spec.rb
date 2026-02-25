require "rails_helper"

RSpec.describe "Auth::Verifies", type: :request do
  describe "POST /auth/verify" do
    subject { post auth_verify_url, params: params }

    let(:params) do
      {
        auth_verify: {
          token:,
          encrypted_email:,
        },
      }
    end

    let(:token) { valid_token }
    let(:encrypted_email) { valid_encrypted_email }

    let(:valid_token) { "valid_token" }
    let(:valid_encrypted_email) { EncryptionService.encrypt(valid_email) }
    let(:valid_email) { "user@example.com" }

    before do
      auth_request = create(:auth_request, email: valid_email)
      auth_request.update(token: valid_token)
    end

    context "すでにログインしている場合" do
      before { allow_any_instance_of(Auth::VerifiesController).to receive(:logged_in?).and_return(true) }

      it "403を返すこと" do
        subject
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "ゲストユーザーの場合" do
      context "暗号化されたメールアドレスが与えられていない場合" do
        let(:encrypted_email) { nil }

        it "422を返すこと" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "暗号化されたメールアドレスが与えられた場合" do
        context "無効な暗号化がされたメールアドレスの場合" do
          let(:encrypted_email) { "xxxxxxxxxxxxxxxxxxxx" }

          it "422を返すこと" do
            subject
            expect(response).to have_http_status(:unprocessable_entity)
          end
        end

        context "有効な暗号化がされたメールアドレスの場合" do
          context "リクエストが見つからない場合" do
            let(:token) { "invalid_token" }

            it "422を返すこと" do
              subject
              expect(response).to have_http_status(:unprocessable_entity)
            end
          end
        end

        context "リクエストが見つかる場合" do
          context "ユーザーが存在する場合" do
            let!(:user) { create(:user, email: valid_email) }

            it "ログインして201を返すこと" do
              subject
              expect(response).to have_http_status(:created)

              json = JSON.parse(response.body, symbolize_names: true)
              expect(json[:user_name]).to eq user.name
              expect(json[:access_token]).to be_present
              expect(json[:refresh_token]).to be_present
              expect(json[:encrypted_auth_request_id]).to be_nil
            end
          end

          context "ユーザーが存在しない場合" do
            it "ログインせずに200を返すこと" do
              subject
              expect(response).to have_http_status(:ok)

              json = JSON.parse(response.body, symbolize_names: true)
              expect(json[:user_name]).to be_nil
              expect(json[:access_token]).to be_nil
              expect(json[:refresh_token]).to be_nil
              expect(json[:encrypted_auth_request_id]).to be_present
            end
          end
        end
      end
    end
  end
end
