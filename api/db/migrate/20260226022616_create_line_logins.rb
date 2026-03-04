class CreateLineLogins < ActiveRecord::Migration[7.2]
  def change
    create_table :line_logins do |t|
      t.string :state, null: false
      t.timestamps
    end
  end
end
