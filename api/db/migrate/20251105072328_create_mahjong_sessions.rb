class CreateMahjongSessions < ActiveRecord::Migration[7.2]
  def change
    create_table :mahjong_sessions do |t|
      t.integer :total_game_fee, null: false, default: 0, comment: "ゲーム代"
      t.string :name, null: false, default: "", comment: "セッション名"
      t.references :creator_user, null: false, foreign_key: { to_table: :users }, comment: "作成者のユーザーID"
      t.references :mahjong_scoring_setting, null: false, foreign_key: true, comment: "ゲーム設定ID"

      t.timestamps
    end
  end
end
