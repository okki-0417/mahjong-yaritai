# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "auth/line/callbacks", type: :request do
  path "/auth/line/callback" do
    post("create callback") do
      tags "Auth::Line::Callback"
      operationId "createLineCallback"
      produces "application/json"
      consumes "application/json"
      parameter name: :request_params, in: :body, schema: {
        type: :object,
        required: %w[code state],
        properties: {
          code: { type: :string, description: "Authorization code from LINE" },
          state: { type: :string, description: "State parameter for CSRF protection" },
        },
      }

      before do
        allow_any_instance_of(ApplicationController).to receive(:session).and_return({ line_login_state: "valid_state" })
      end

      response(400, "bad request - invalid state") do
        let(:request_params) { { code: "valid_code", state: nil } }
        run_test!
      end

      response(400, "bad request - missing code") do
        let(:request_params) { { code: nil, state: "valid_state" } }
        run_test!
      end

      response(422, "unprocessable entity - token exchange failed") do
        let(:request_params) { { code: "invalid_code", state: "valid_state" } }

        before do
          ENV["LINE_CHANNEL_ID"] = "test_channel_id"
          ENV["LINE_CHANNEL_SECRET"] = "test_channel_secret"
          ENV["LINE_REDIRECT_URI"] = "http://localhost:3000/auth/line/callback"

          allow_any_instance_of(Auth::Line::CallbacksController).to receive(:exchange_code_for_token).and_return(
            { error: "invalid_grant", error_description: "Invalid authorization code" }
          )
        end

        after do
          ENV.delete("LINE_CHANNEL_ID")
          ENV.delete("LINE_CHANNEL_SECRET")
          ENV.delete("LINE_REDIRECT_URI")
        end

        run_test!
      end

      response(422, "unprocessable entity - id token verification fails") do
        let(:request_params) { { code: "valid_code", state: "valid_state" } }

        before do
          ENV["LINE_CHANNEL_ID"] = "test_channel_id"
          ENV["LINE_CHANNEL_SECRET"] = "test_channel_secret"
          ENV["LINE_REDIRECT_URI"] = "http://localhost:3000/auth/line/callback"

          allow_any_instance_of(Auth::Line::CallbacksController).to receive(:exchange_code_for_token).and_return(
            { access_token: "test_access_token", id_token: "test_id_token", refresh_token: "test_refresh_token" }
          )

          allow_any_instance_of(Auth::Line::CallbacksController).to receive(:verify_id_token).and_return(
            { error: "Invalid ID token" }
          )
        end

        after do
          ENV.delete("LINE_CHANNEL_ID")
          ENV.delete("LINE_CHANNEL_SECRET")
          ENV.delete("LINE_REDIRECT_URI")
        end

        run_test!
      end

      response(422, "unprocessable entity - auth request validation fails") do
        let(:request_params) { { code: "valid_code", state: "valid_state" } }

        before do
          ENV["LINE_CHANNEL_ID"] = "test_channel_id"
          ENV["LINE_CHANNEL_SECRET"] = "test_channel_secret"
          ENV["LINE_REDIRECT_URI"] = "http://localhost:3000/auth/line/callback"

          allow_any_instance_of(AuthRequest).to receive(:save).and_return(false)
        end

        after do
          ENV.delete("LINE_CHANNEL_ID")
          ENV.delete("LINE_CHANNEL_SECRET")
          ENV.delete("LINE_REDIRECT_URI")
        end

        run_test!
      end

      response(200, "successful - existing user") do
        let(:request_params) { { code: "valid_code", state: "valid_state" } }
        let(:existing_user) { create(:user, email: "test@example.com") }

        schema type: :object,
          required: %w[session],
          properties: {
            session: {
              "$ref" => "#/components/schemas/Session",
            },
          }

        before do
          ENV["LINE_CHANNEL_ID"] = "test_channel_id"
          ENV["LINE_CHANNEL_SECRET"] = "test_channel_secret"
          ENV["LINE_REDIRECT_URI"] = "http://localhost:3000/auth/line/callback"

          allow_any_instance_of(Auth::Line::CallbacksController).to receive(:exchange_code_for_token).and_return(
            { access_token: "test_access_token", id_token: "test_id_token", refresh_token: "test_refresh_token" }
          )

          allow_any_instance_of(Auth::Line::CallbacksController).to receive(:verify_id_token).and_return(
            { email: "test@example.com" }
          )

          existing_user
        end

        after do
          ENV.delete("LINE_CHANNEL_ID")
          ENV.delete("LINE_CHANNEL_SECRET")
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

      response(204, "successful - new user creates auth request") do
        let(:request_params) { { code: "valid_code", state: "valid_state" } }

        before do
          ENV["LINE_CHANNEL_ID"] = "test_channel_id"
          ENV["LINE_CHANNEL_SECRET"] = "test_channel_secret"
          ENV["LINE_REDIRECT_URI"] = "http://localhost:3000/auth/line/callback"

          allow_any_instance_of(Auth::Line::CallbacksController).to receive(:exchange_code_for_token).and_return(
            { access_token: "test_access_token", id_token: "test_id_token", refresh_token: "test_refresh_token" }
          )

          allow_any_instance_of(Auth::Line::CallbacksController).to receive(:verify_id_token).and_return(
            { email: "newuser@example.com" }
          )
        end

        after do
          ENV.delete("LINE_CHANNEL_ID")
          ENV.delete("LINE_CHANNEL_SECRET")
          ENV.delete("LINE_REDIRECT_URI")
        end

        run_test!
      end
    end
  end
end
