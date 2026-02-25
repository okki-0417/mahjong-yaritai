class AddJtiToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :jti, :string
    add_index :users, :jti, unique: true

    remove_column :users, :remember_digest, :string
  end
end
