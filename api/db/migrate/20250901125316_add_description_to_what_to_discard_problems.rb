class AddDescriptionToWhatToDiscardProblems < ActiveRecord::Migration[7.2]
  def change
    add_column :what_to_discard_problems, :description, :text
  end
end
