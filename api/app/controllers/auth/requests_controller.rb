class Auth::RequestsController < ApplicationController
  before_action :restrict_to_guests, only: %i[create]

  def create
    @auth_request = AuthRequest.new(request_params)

    if @auth_request.save
      AuthorizationMailer.authorization_token(@auth_request).deliver_now
      @encrypted_email = EncryptionService.encrypt(@auth_request.email)

      render json: {
        encrypted_email: @encrypted_email,
      }, status: :created
    else
      render json: { errors: @auth_request.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def request_params
    params.require(:auth_request).permit(:email)
  end

  def restrict_to_guests
    return unless logged_in?

    render json: { error: "既にログインしています" }, status: :forbidden
  end
end
