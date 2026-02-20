class DropWhatToDiscardProblemLikes < ActiveRecord::Migration[7.2]
  def up
    drop_table :what_to_discard_problem_likes
  end

  def down
    create_table :what_to_discard_problem_likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :what_to_discard_problem, null: false, foreign_key: true
      t.timestamps
    end

    add_index :what_to_discard_problem_likes, %i[user_id what_to_discard_problem_id], unique: true
  end
end
