# frozen_string_literal: true

class AddProfileTextToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :profile_text, :text
  end
end
