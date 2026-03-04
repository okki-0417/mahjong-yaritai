# frozen_string_literal: true

module ErrorRenderable
  extend ActiveSupport::Concern

  private

  def render_error(message, status: :bad_request)
    @error_message = message
    render "shared/error", status: status
  end

  def render_validation_error(model)
    render_error model.errors.full_messages.join(", "), status: :unprocessable_entity
  end
end
