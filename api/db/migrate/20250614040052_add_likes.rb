class AddLikes < ActiveRecord::Migration[7.2]
  def change
    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :likable_type, null: false
      t.bigint :likable_id, null: false
      t.timestamps
    end
  end
end
