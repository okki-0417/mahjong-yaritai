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
        @access_token, @refresh_token = login(user)
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
