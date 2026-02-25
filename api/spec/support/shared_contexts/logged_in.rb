# frozen_string_literal: true

shared_context "logged_in" do
  before do
    if defined?(current_user) && current_user
      email = current_user.email
      auth_request = create(:auth_request, email:)
      token = auth_request.token
      encrypted_email = EncryptionService.encrypt(email)

      post auth_verify_url, params: { auth_verify: { encrypted_email:, token: } }

      access_token = JSON.parse(response.body)["access_token"]
      @headers = { "Authorization" => "Bearer #{access_token}" }
    end
  end
end
