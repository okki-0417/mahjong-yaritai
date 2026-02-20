class CreateWhatToDiscardProblemVotes < ActiveRecord::Migration[7.2]
  def change
    create_table :what_to_discard_problem_votes do |t|
      t.references :user, foreign_key: true, null: false
      t.references :tile, foreign_key: true, null: false
      t.references :what_to_discard_problem, foreign_key: true, null: false
      t.timestamps
    end

    add_index :what_to_discard_problem_votes, %i[user_id what_to_discard_problem_id], unique: true
  end
end
