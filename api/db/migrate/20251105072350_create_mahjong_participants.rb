class CreateMahjongParticipants < ActiveRecord::Migration[7.2]
  def change
    create_table :mahjong_participants do |t|
      t.references :mahjong_session, null: false, foreign_key: true, comment: "麻雀開催ID"
      t.references :user, foreign_key: true, comment: "ユーザーID"
      t.string :name, null: false, comment: "参加者名"

      t.timestamps
    end

    add_index :mahjong_participants, %i[mahjong_session_id user_id], unique: true, name: "index_mahjong_participants_on_session_and_user"
  end
end
