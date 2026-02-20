# frozen_string_literal: true

module ErrorJsonRenderable
  def validation_error_json(model)
    error_json(model.errors.full_messages)
  end

  def error_json(messages)
    { errors: messages.map { |message| { message: } } }
  end
end
