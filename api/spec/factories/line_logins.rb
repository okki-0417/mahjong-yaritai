FactoryBot.define do
  factory :line_login do
    state { SecureRandom.hex(32) }
  end
end
