# frozen_string_literal: true

FactoryBot.define do
  factory :mahjong_scoring_setting do
    rate { 100 }
    chip_amount { 0 }
    uma_rule_label { "" }
    oka_rule_label { "" }
  end
end
