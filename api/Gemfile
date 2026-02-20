source "https://rubygems.org"

gem "active_model_serializers"
gem "aws-sdk-s3", require: false
gem "bcrypt", "~> 3.1.7"
gem "bootsnap", require: false
gem "dotenv-rails"
gem "pg"
gem "puma", ">= 5.0"
gem "rack-cors"
gem "rails", "7.2.1"
gem "redis-rails"
gem "redis-store"
gem "rswag-api"
gem "rswag-ui"
gem "sidekiq"
gem "graphql"
gem "graphql-batch"
gem "apollo_upload_server", "~> 2.1"

group :development do
  gem "graphiql-rails"
  gem "brakeman", require: false
  gem "letter_opener_web"
  gem "rubocop-rails-omakase", require: false
  gem "ruby-lsp"
end

group :development, :test do
  gem "debug"
  gem "factory_bot_rails"
  gem "pry"
  gem "rspec-rails", "~> 8.0.1"
  gem "shoulda-matchers"
  gem "rswag-specs"
end

group :production do
  gem "sentry-ruby"
  gem "sentry-rails"
end
