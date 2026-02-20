class CreateLearningQuestions < ActiveRecord::Migration[7.2]
  def change
    create_table :learning_questions do |t|
      t.references :learning_category, null: false, foreign_key: true
      t.string :statement, null: false
      t.string :answer, null: false

      t.timestamps
    end
  end
end
