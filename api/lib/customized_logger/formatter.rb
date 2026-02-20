# frozen_string_literal: true

module CustomizedLogger
  class Formatter < Logger::Formatter
    def call(severity, time, program_name, message)
      jst_formatted_log(severity, time, program_name, message)
    end

    private

    def jst_formatted_log(severity, time, program_name, message)
      trimmed_message = trim_utc_time(convert_msg_to_string(message))
      jst_time = time.getlocal("+09:00").strftime("%Y/%m/%d %H:%M:%S.%6N %z")

      "[#{severity}] #{trimmed_message} at #{jst_time}\n"
    end

    def convert_msg_to_string(msg)
      case msg
      when ::String
        msg
      when ::Exception
        "#{msg.message} (#{msg.class})\n" + (msg.backtrace || []).join("\n")
      else
        msg.inspect
      end
    end

    def trim_utc_time(message)
      # example: "at 2024-06-01 12:34:56 +0000"
      message.gsub(/at \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+\d{4}/, "")
    end
  end
end
