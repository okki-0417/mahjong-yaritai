class MahjongUmaRule
  UMA_RULES = {
    none: "なし",
    standard: "標準 (10-0-(-10)-(-20))",
    custom: "カスタム",
  }.freeze

  def self.labels
    UMA_RULES.values
  end

  def self.label_to_key(label)
    UMA_RULES.key(label)
  end
end
