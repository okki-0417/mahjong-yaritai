class CreateMahjongScoringSettings < ActiveRecord::Migration[7.2]
  def change
    create_table :mahjong_scoring_settings do |t|
      t.integer :rate, null: false, comment: "1000点あたりの額"
      t.integer :chip_amount, null: false, comment: "チップ額"
      t.string :uma_rule_label, null: false, default: "", comment: "ウマ設定のラベル"
      t.string :oka_rule_label, null: false, default: "", comment: "オカ設定のラベル"

      t.timestamps
    end
  end
end
