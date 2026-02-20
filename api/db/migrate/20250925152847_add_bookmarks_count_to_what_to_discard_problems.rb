class AddBookmarksCountToWhatToDiscardProblems < ActiveRecord::Migration[7.2]
  def change
    add_column :what_to_discard_problems, :bookmarks_count, :integer, default: 0, null: false
  end
end
