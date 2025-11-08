class CreateWfEventNutrients < ActiveRecord::Migration[7.1]
  def change
    create_table :wf_event_nutrients do |t|
      t.references :water_feed_event, null: false, foreign_key: true
      t.string :name
      t.float :amount_per_gal
      t.string :unit

      t.timestamps
    end
  end
end
