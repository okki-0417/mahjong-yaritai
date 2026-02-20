# frozen_string_literal: true

module AssociationErrorHandler
  def collect_all_errors(parent)
    errors = []

    errors.concat(parent.errors.full_messages)

    parent.errors.attribute_names.each do |attribute_name|
      association_reflection = parent.class.reflect_on_association(attribute_name)
      next unless association_reflection

      case association_reflection.macro
      when :has_many
        children = parent.public_send(attribute_name)
        children.each_with_index do |child, index|
          next unless child.errors.any?

          child.errors.full_messages.each do |message|
            errors << "#{attribute_name.to_s.singularize} ##{index + 1}: #{message}"
          end

          collect_all_errors(child).each do |nested_error|
            errors << "#{attribute_name.to_s.singularize} ##{index + 1} -> #{nested_error}"
          end
        end

      when :has_one, :belongs_to
        child = parent.public_send(attribute_name)
        next unless child&.errors&.any?

        child.errors.full_messages.each do |message|
          errors << "#{attribute_name}: #{message}"
        end

        collect_all_errors(child).each do |nested_error|
          errors << "#{attribute_name} -> #{nested_error}"
        end
      end
    end

    errors
  end

  def add_all_errors_to_context(parent, context)
    collect_all_errors(parent).each do |message|
      context.add_error(GraphQL::ExecutionError.new(message))
    end
  end
end
