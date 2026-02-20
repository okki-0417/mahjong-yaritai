class CreateTiles < ActiveRecord::Migration[7.2]
  def change
    create_table :tiles do |t|
      t.integer :suit, null: false
      t.integer :ordinal_number_in_suit, null: false
      t.string :name, null: false

      t.timestamps
    end
  end
end
