class CreateMahjongGames < ActiveRecord::Migration[7.2]
  def change
    create_table :mahjong_games do |t|
      t.references :mahjong_session, null: false, foreign_key: true, comment: "麻雀開催ID"

      t.timestamps
    end
  end
end
