class CreateWaterFeedEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :water_feed_events do |t|
      t.references :grow, null: false, foreign_key: true
      t.date :date
      t.string :type
      t.float :solution_ph
      t.string :strength_mode
      t.float :solution_strength

      t.timestamps
    end
  end
end
