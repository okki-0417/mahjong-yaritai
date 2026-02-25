module LoginHelper
  def get_access_token(user)
    email = user.email
    auth_request = create(:auth_request, email:)
    token = auth_request.token
    encrypted_email = EncryptionService.encrypt(email)

    post auth_verify_url, params: { auth_verify: { encrypted_email:, token: } }

    JSON.parse(response.body)["access_token"]
  end
end
