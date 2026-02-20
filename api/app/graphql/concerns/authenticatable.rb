# frozen_string_literal: true

module Authenticatable
  def login(user)
    return unless user

    reset_session
    context[:session][:user_id] = user.id
  end

  def remember(user)
    return unless user

    user.remember

    context[:cookies].permanent.signed[:user_id] = {
      value: user.id,
      domain: Rails.env.production? ? ENV.fetch("ETLD_HOST") : "localhost",
      same_site: :lax,
      secure: Rails.env.production?,
      httponly: true,
    }

    context[:cookies].permanent.signed[:remember_token] = {
      value: user.remember_token,
      domain: Rails.env.production? ? ENV.fetch("ETLD_HOST") : "localhost",
      same_site: :lax,
      secure: Rails.env.production?,
      httponly: true,
    }
  end

  def current_user
    context[:current_user]
  end

  def session
    context[:session]
  end

  def cookies
    context[:cookies]
  end

  def forget(user)
    return unless user

    user.forget
    return unless context[:cookies]

    context[:cookies].delete(:user_id)
    context[:cookies].delete(:remember_token)
  end

  def logout
    forget(current_user)
    reset_session
    context[:current_user] = nil
  end

  def logged_in?
    context[:current_user].present?
  end

  def require_authentication!
    raise GraphQL::ExecutionError, "ログインしてください" unless logged_in?
  end

  private

  def reset_session
    if context[:session].respond_to?(:destroy)
      context[:session].destroy
    else
      context[:session].clear
    end
  end
end
