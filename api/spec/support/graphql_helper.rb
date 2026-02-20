# frozen_string_literal: true

module GraphqlHelper
  def execute_mutation(mutation, variables, context: {})
    context.each { |key, value| stub_context(key, value) }

    post "/graphql", params: { query: mutation, variables: }, as: :json
  end

  def execute_query(query, variables = {}, context: {})
    context.each { |key, value| stub_context(key, value) }

    post "/graphql", params: { query:, variables: }, as: :json
  end

  private

  def stub_context(key, value)
    case key
    when :current_user
      allow_any_instance_of(GraphqlController).to receive(:current_user).and_return(value)
    when :session
      allow_any_instance_of(GraphqlController).to receive(:session).and_return(value)
    when :cookies
      allow_any_instance_of(GraphqlController).to receive(:cookies).and_return(value)
    end
  end
end
