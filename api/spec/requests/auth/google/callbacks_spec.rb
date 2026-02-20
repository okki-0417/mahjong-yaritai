# frozen_string_literal: true

require "swagger_helper"
require "net/http"

RSpec.describe "auth/google/callbacks", type: :request do
  path "/auth/google/callback" do
    post("create callback") do
      tags "Auth::Google::Callback"
      operationId "createGoogleCallback"
      produces "application/json"
      consumes "application/json"
      parameter name: :request_params, in: :body, schema: {
        type: :object,
        required: [ "code" ],
        properties: {
          code: { type: :string, description: "Authorization code from Google" },
        },
      }

      response(400, "bad request") do
        let(:request_params) { { code: nil } }

        run_test!
      end

      response(422, "unprocessable entity - token exchange failed") do
        let(:request_params) { { code: "invalid_code" } }

        before do
          ENV["GOOGLE_CLIENT_ID"] = "test_client_id"
          ENV["GOOGLE_CLIENT_SECRET"] = "test_client_secret"
          ENV["GOOGLE_REDIRECT_URI"] = "http://localhost:3000/auth/google/callback"

          # Mock token exchange failure
          allow_any_instance_of(Net::HTTP).to receive(:request).and_return(
            double(code: "400", body: '{"error": "invalid_grant"}')
          )
        end

        after do
          ENV.delete("GOOGLE_CLIENT_ID")
          ENV.delete("GOOGLE_CLIENT_SECRET")
          ENV.delete("GOOGLE_REDIRECT_URI")
        end

        run_test!
      end

      response(200, "successful - existing user") do
        let(:request_params) { { code: "valid_code" } }

        let(:existing_user) { create(:user, email: "test@example.com") }

        schema type: :object,
          required: [ "session" ],
          properties: {
            session: {
              "$ref" => "#/components/schemas/Session",
            },
          }

        before do
          ENV["GOOGLE_CLIENT_ID"] = "test_client_id"
          ENV["GOOGLE_CLIENT_SECRET"] = "test_client_secret"
          ENV["GOOGLE_REDIRECT_URI"] = "http://localhost:3000/auth/google/callback"

          # Mock successful token exchange
          token_response = double(
            code: "200",
            body: '{"access_token": "test_access_token", "id_token": "test_id_token"}'
          )

          # Mock successful user info fetch
          user_info_response = double(
            code: "200",
            body: '{"email": "test@example.com", "name": "Test User", "picture": "https://example.com/picture.jpg"}'
          )

          allow_any_instance_of(Net::HTTP).to receive(:request).with(instance_of(Net::HTTP::Post)).and_return(token_response)
          allow_any_instance_of(Net::HTTP).to receive(:request).with(instance_of(Net::HTTP::Get)).and_return(user_info_response)

          existing_user
        end

        after do
          ENV.delete("GOOGLE_CLIENT_ID")
          ENV.delete("GOOGLE_CLIENT_SECRET")
          ENV.delete("GOOGLE_REDIRECT_URI")
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

      response(204, "successful - new user creates auth request") do
        let(:request_params) { { code: "valid_code" } }

        before do
          ENV["GOOGLE_CLIENT_ID"] = "test_client_id"
          ENV["GOOGLE_CLIENT_SECRET"] = "test_client_secret"
          ENV["GOOGLE_REDIRECT_URI"] = "http://localhost:3000/auth/google/callback"

          # Mock successful token exchange
          token_response = double(
            code: "200",
            body: '{"access_token": "test_access_token", "id_token": "test_id_token"}'
          )

          # Mock successful user info fetch
          user_info_response = double(
            code: "200",
            body: '{"email": "newuser@example.com", "name": "New User", "picture": "https://example.com/picture.jpg"}'
          )

          allow_any_instance_of(Net::HTTP).to receive(:request).with(instance_of(Net::HTTP::Post)).and_return(token_response)
          allow_any_instance_of(Net::HTTP).to receive(:request).with(instance_of(Net::HTTP::Get)).and_return(user_info_response)
        end

        after do
          ENV.delete("GOOGLE_CLIENT_ID")
          ENV.delete("GOOGLE_CLIENT_SECRET")
          ENV.delete("GOOGLE_REDIRECT_URI")
        end

        run_test!
      end

      response(422, "unprocessable entity - auth request validation fails") do
        let(:request_params) { { code: "valid_code" } }

        before do
          ENV["GOOGLE_CLIENT_ID"] = "test_client_id"
          ENV["GOOGLE_CLIENT_SECRET"] = "test_client_secret"
          ENV["GOOGLE_REDIRECT_URI"] = "http://localhost:3000/auth/google/callback"

          # Mock successful token exchange
          token_response = double(
            code: "200",
            body: '{"access_token": "test_access_token", "id_token": "test_id_token"}'
          )

          # Mock successful user info fetch with invalid email
          user_info_response = double(
            code: "200",
            body: '{"email": "", "name": "Invalid User", "picture": "https://example.com/picture.jpg"}'
          )

          allow_any_instance_of(Net::HTTP).to receive(:request).with(instance_of(Net::HTTP::Post)).and_return(token_response)
          allow_any_instance_of(Net::HTTP).to receive(:request).with(instance_of(Net::HTTP::Get)).and_return(user_info_response)
        end

        after do
          ENV.delete("GOOGLE_CLIENT_ID")
          ENV.delete("GOOGLE_CLIENT_SECRET")
          ENV.delete("GOOGLE_REDIRECT_URI")
        end

        run_test!
      end
    end
  end
end
