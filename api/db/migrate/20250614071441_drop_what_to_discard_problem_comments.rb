class DropWhatToDiscardProblemComments < ActiveRecord::Migration[7.2]
  def up
    drop_table :what_to_discard_problem_comments
  end

  def down
    create_table :what_to_discard_problem_comments do |t|
      t.references :what_to_discard_problem, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.references :parent_comment, foreign_key: { to_table: :what_to_discard_problem_comments }, null: true
      t.string :content, null: false, limit: 500
      t.timestamps
    end
  end
end
