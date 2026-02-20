# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "auth/line/login_urls", type: :request do
  path "/auth/line/login_url" do
    get("show login url") do
      tags "Auth::Line::LoginUrl"
      operationId "getLineLoginUrl"
      produces "application/json"

      response(200, "successful") do
        schema type: :object,
          required: [ "login_url" ],
          properties: {
            login_url: {
              type: :string,
              description: "LINE OAuth authorization URL",
              example: "https://access.line.me/oauth2/v2.1/authorize?client_id=xxx&redirect_uri=xxx&response_type=code&scope=profile+openid+email&state=xxx",
            },
          }

        before do
          ENV["LINE_CHANNEL_ID"] = "test_channel_id"
          ENV["LINE_REDIRECT_URI"] = "http://localhost:3000/auth/line/callback"
        end

        after do
          ENV.delete("LINE_CHANNEL_ID")
          ENV.delete("LINE_REDIRECT_URI")
        end

        after do |example|
          example.metadata[:response][:content] = {
            "application/json" => {
              example: JSON.parse(response.body, symbolize_names: true),
            },
          }
        end

        run_test!
      end
    end
  end
end
