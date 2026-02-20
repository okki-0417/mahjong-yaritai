# frozen_string_literal: true

class SessionSerializer < ActiveModel::Serializer
  attributes %i[
    is_logged_in
    user_id
  ]

  def is_logged_in
    object.present?
  end

  def user_id
    object&.id
  end
end
