class CreateAuthorizations < ActiveRecord::Migration[7.2]
  def change
    create_table :authorizations do |t|
      t.string :email, null: false
      t.string :token, null: false
      t.timestamps
    end
  end
end
