require "rails_helper"

RSpec.describe "Auth::Requests", type: :request do
  describe "POST /auth/request" do
    subject { post auth_request_url, params: { auth_request: { email: } } }
    let(:email) { valid_email }

    let(:valid_email) { "test@example.com" }
    let(:invalid_email) { "invalid_email" }

    context "すでにログインしている場合" do
      before { allow_any_instance_of(Auth::RequestsController).to receive(:logged_in?).and_return(true) }

      it "403を返すこと" do
        subject
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "ゲストユーザーの場合" do
      context "無効なメールアドレスの場合" do
        let(:email) { invalid_email }

        it "422を返すこと" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "有効なメールアドレスの場合" do
        it "認証リクエストを作成し、メールを送信し、暗号化されたメールアドレスを返すこと" do
          expect { subject }.to change(AuthRequest, :count).by(1)
            .and change { ActionMailer::Base.deliveries.count }.by(1)

          expect(response).to have_http_status(:created)
          json_response = JSON.parse(response.body)
          expect(json_response).to have_key("encrypted_email")
        end
      end
    end
  end
end
