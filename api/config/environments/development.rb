# frozen_string_literal: true

require "active_support/core_ext/integer/time"
require Rails.root.join("lib/customized_logger/formatter")

Rails.application.configure do
  config.enable_reloading = true
  config.debug_exception_response_format = :api
  config.eager_load = false
  config.consider_all_requests_local = true

  config.middleware.use ActionDispatch::Cookies
  config.middleware.use ActionDispatch::Session::RedisStore,
    servers: [
      {
        host: ENV.fetch("REDIS_HOST"),
        port: ENV.fetch("REDIS_PORT"),
      },
    ],
    domain: ENV.fetch("ETLD_HOST", "localhost"),
    same_site: :lax,
    httponly: true,
    secure: false,
    key: "_dev_session_id",
    expire_after: 1.month

  config.session_store :redis_store

  config.log_level = :debug

  logger = ActiveSupport::Logger.new(Rails.root.join("log/development.log"))
  logger.formatter = CustomizedLogger::Formatter.new
  config.logger = ActiveSupport::TaggedLogging.new(logger)

  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method = :letter_opener_web
  config.action_mailer.perform_deliveries = true
  config.action_mailer.default_options = { from: ENV.fetch("HOST_NAME") }
  config.action_mailer.default_url_options = { host: ENV.fetch("HOST_NAME"), port: 3001 }

  Rails.application.routes.default_url_options = { host: ENV.fetch("HOST_NAME"), port: 3001 }
  config.hosts << "murai.local"

  config.active_record.migration_error = :page_load

  config.active_record.verbose_query_logs = true
  config.active_record.query_log_tags_enabled = true

  config.action_controller.raise_on_missing_callback_actions = true

  config.active_job.queue_adapter = :sidekiq

  config.active_storage.service = :local
end
