# frozen_string_literal: true

class WithdrawalMailer < ApplicationMailer
  def withdrawal_completed(user_email, user_name)
    @user_name = user_name

    mail(
      to: user_email,
      subject: "【麻雀ヤリタイ】退会完了のお知らせ",
    )
  end
end
