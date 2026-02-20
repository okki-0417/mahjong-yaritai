# frozen_string_literal: true

module CustomizedLogger
  class Silencer
    SILENT_PATHS = %w[/up /].freeze

    def initialize(app)
      @app = app
    end

    def call(env)
      if silent_path?(env["PATH_INFO"])
        Rails.logger.silence do
          @app.call(env)
        end
      else
        @app.call(env)
      end
    end

    private

    def silent_path?(path)
      SILENT_PATHS.include?(path)
    end
  end
end
