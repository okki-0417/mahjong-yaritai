class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :name, null: false, limit: 20
      t.string :email, null: false, limit: 64
      t.string :password_digest, null: false
      t.string :remember_digest

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
