class AddComments < ActiveRecord::Migration[7.2]
  def change
    create_table :comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :parent_comment, foreign_key: { to_table: :comments }, null: true
      t.integer :replies_count, default: 0, null: false
      t.string :commentable_type, null: false
      t.bigint :commentable_id, null: false
      t.string :content, null: false, limit: 500
      t.timestamps
    end
  end
end
