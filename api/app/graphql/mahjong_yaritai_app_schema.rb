# frozen_string_literal: true

class MahjongYaritaiAppSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Dataloader

  max_query_string_tokens(5000)
  validate_max_errors(100)

  rescue_from(ActiveRecord::RecordNotFound) do |err, obj, args, ctx, field|
    raise GraphQL::ExecutionError, "リソースが見つかりません"
  end
end
