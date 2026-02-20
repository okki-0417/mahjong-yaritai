class CreateMahjongResults < ActiveRecord::Migration[7.2]
  def change
    create_table :mahjong_results do |t|
      t.references :mahjong_participant, null: false, foreign_key: true, comment: "麻雀参加ID"
      t.references :mahjong_game, null: false, foreign_key: true, comment: "麻雀ゲームID"
      t.integer :ranking, null: false, comment: "着順"
      t.integer :result_points, null: false, comment: "計算後のポイント"
      t.integer :score, comment: "得点"

      t.timestamps
    end

    add_index :mahjong_results, %i[mahjong_game_id mahjong_participant_id], unique: true, name: "index_mahjong_results_on_game_and_participant"
  end
end
