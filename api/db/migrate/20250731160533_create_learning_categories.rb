class CreateLearningCategories < ActiveRecord::Migration[7.2]
  def change
    create_table :learning_categories do |t|
      t.string :name, null: false
      t.string :description, null: false

      t.timestamps
    end
  end
end
