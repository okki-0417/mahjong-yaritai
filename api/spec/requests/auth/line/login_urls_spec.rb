# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Auth::Line::LoginUrls", type: :request do
  describe "POST /auth/line/login_url" do
    subject { post auth_line_login_url_url }

    before do
      ENV["LINE_CHANNEL_ID"] = "test_channel_id"
      ENV["LINE_REDIRECT_URI"] = "http://localhost:3000/auth/line/callback"
    end

    after do
      ENV.delete("LINE_CHANNEL_ID")
      ENV.delete("LINE_REDIRECT_URI")
    end

    it "201を返すこと" do
      subject
      expect(response).to have_http_status(:created)
      assert_schema_conform(201)
    end

    it "login_urlを返すこと" do
      subject
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("login_url")
    end

    it "line_login_idを返すこと" do
      subject
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("line_login_id")
    end

    it "LINE OAuth認証URLを返すこと" do
      subject
      json_response = JSON.parse(response.body)
      expect(json_response["login_url"]).to start_with("https://access.line.me/oauth2/v2.1/authorize?")
    end

    it "必要なパラメータを含むこと" do
      subject
      json_response = JSON.parse(response.body)
      login_url = json_response["login_url"]

      expect(login_url).to include("client_id=test_channel_id")
      expect(login_url).to include("redirect_uri=")
      expect(login_url).to include("response_type=code")
      expect(login_url).to include("scope=openid+email")
      expect(login_url).to include("state=")
    end

    it "LineLoginレコードを作成すること" do
      expect { subject }.to change(LineLogin, :count).by(1)
    end

    it "暗号化されたline_login_idを返すこと" do
      subject
      json_response = JSON.parse(response.body)
      encrypted_id = json_response["line_login_id"]

      decrypted_id = EncryptionService.decrypt(encrypted_id)
      expect(LineLogin.find_by(id: decrypted_id)).to be_present
    end
  end
end
