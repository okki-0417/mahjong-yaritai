# frozen_string_literal: true

class AuthorizationMailer < ApplicationMailer
  def send_authorization_token(auth_request)
    @token = auth_request.token

    mail(
      to: auth_request.email,
      subject: "【麻雀ヤリタイ】認証メール",
    )
  end
end
