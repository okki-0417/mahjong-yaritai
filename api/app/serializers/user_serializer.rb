# frozen_string_literal: true

class UserSerializer < ActiveModel::Serializer
  attributes %i[
    id
    name
    profile_text
    avatar_url
    is_following
    created_at
    updated_at
  ]

  def avatar_url
    return nil unless object.avatar.attached?

    begin
      object.avatar.url
    rescue
      Rails.application.routes.url_helpers.url_for(object.avatar)
    end
  end

  def is_following
    return false unless instance_options[:current_user]

    instance_options[:current_user].following?(object)
  end
end
