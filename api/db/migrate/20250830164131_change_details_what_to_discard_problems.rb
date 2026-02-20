class ChangeDetailsWhatToDiscardProblems < ActiveRecord::Migration[7.2]
  def up
    remove_column :what_to_discard_problems, :point_east, null: true
    remove_column :what_to_discard_problems, :point_south, null: true
    remove_column :what_to_discard_problems, :point_west, null: true
    remove_column :what_to_discard_problems, :point_north, null: true
    add_column :what_to_discard_problems, :points, :integer
    change_column :what_to_discard_problems, :round, :string, null: true
    change_column :what_to_discard_problems, :turn, :integer, null: true
    change_column :what_to_discard_problems, :wind, :string, null: true
  end

  def down
    add_column :what_to_discard_problems, :point_east, :integer, null: false, default: 25000
    add_column :what_to_discard_problems, :point_south, :integer, null: false, default: 25000
    add_column :what_to_discard_problems, :point_west, :integer, null: false, default: 25000
    add_column :what_to_discard_problems, :point_north, :integer, null: false, default: 25000
    remove_column :what_to_discard_problems, :points
    change_column :what_to_discard_problems, :round, :string, null: false
    change_column :what_to_discard_problems, :turn, :integer, null: false
    change_column :what_to_discard_problems, :wind, :string, null: false
  end
end
