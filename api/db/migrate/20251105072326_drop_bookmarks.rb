class DropBookmarks < ActiveRecord::Migration[7.2]
  def change
    drop_table :bookmarks
    remove_column :what_to_discard_problems, :bookmarks_count, :integer
  end
end
