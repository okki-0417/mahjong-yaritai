class CreateWhatToDiscardProblems < ActiveRecord::Migration[7.2]
  def change
    create_table :what_to_discard_problems do |t|
      t.references :user, null: false, foreign_key: true

      t.string :round, null: false
      t.integer :turn, null: false
      t.string :wind, null: false

      t.integer :point_east, null: false
      t.integer :point_south, null: false
      t.integer :point_west, null: false
      t.integer :point_north, null: false

      t.references :dora, foreign_key: { to_table: :tiles },  null: false
      t.references :hand1, foreign_key: { to_table: :tiles },  null: false
      t.references :hand2, foreign_key: { to_table: :tiles },  null: false
      t.references :hand3, foreign_key: { to_table: :tiles },  null: false
      t.references :hand4, foreign_key: { to_table: :tiles },  null: false
      t.references :hand5, foreign_key: { to_table: :tiles },  null: false
      t.references :hand6, foreign_key: { to_table: :tiles },  null: false
      t.references :hand7, foreign_key: { to_table: :tiles },  null: false
      t.references :hand8, foreign_key: { to_table: :tiles },  null: false
      t.references :hand9, foreign_key: { to_table: :tiles },  null: false
      t.references :hand10, foreign_key: { to_table: :tiles },  null: false
      t.references :hand11, foreign_key: { to_table: :tiles },  null: false
      t.references :hand12, foreign_key: { to_table: :tiles },  null: false
      t.references :hand13, foreign_key: { to_table: :tiles },  null: false
      t.references :tsumo, foreign_key: { to_table: :tiles }, null: false

      t.integer :comments_count, default: 0, null: false
      t.integer :likes_count, default: 0, null: false
      t.integer :votes_count, default: 0, null: false

      t.timestamps
    end
  end
end
