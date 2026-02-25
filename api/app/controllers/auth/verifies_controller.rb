class Auth::VerifiesController < Auth::BaseController
  before_action :restrict_to_guests

  rescue_from ActiveSupport::MessageEncryptor::InvalidMessage do
    render json: { error: "無効な暗号化がされたメールアドレスです" }, status: :unprocessable_entity
  end

  def create
    encrypted_email = verify_params[:encrypted_email]
    return render json: { error: "認証メールが送信されていません" }, status: :unprocessable_entity unless encrypted_email

    email = EncryptionService.decrypt(encrypted_email)

    if auth_request = AuthRequest.within_expiration.find_by(token: verify_params[:token], email:)
      if user = User.find_by(email:)
        access_token_payload = {
          user_id: user.id,
          exp: (Time.now + 1.hour).to_i,
        }

        user.regenerate_jti!
        refresh_token_payload = {
          user_id: user.id,
          jti: user.jti,
          exp: (Time.now + 30.days).to_i,
        }

        @access_token = JWT.encode(access_token_payload, Rails.application.secret_key_base)
        @refresh_token = JWT.encode(refresh_token_payload, Rails.application.secret_key_base)

        @user_name = user.name

        render :show, status: :created
      else
        @encrypted_auth_request_id = EncryptionService.encrypt(auth_request.id)
        render :show, status: :ok
      end
    else
      render json: { errors: ["リクエストが見つかりませんでした"] }, status: :unprocessable_entity
    end
  end

  private

  def verify_params
    params.require(:auth_verify).permit(:token, :encrypted_email)
  end
end
