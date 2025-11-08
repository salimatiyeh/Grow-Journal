class CreateWfNutrientLines < ActiveRecord::Migration[7.1]
  def change
    create_table :wf_nutrient_lines do |t|
      t.references :water_feed_event, null: false, foreign_key: true
      t.string  :name, null: false
      t.integer :unit, null: false, default: 0  # 0=ml, 1=g
      t.decimal :amount_per_gal, precision: 8, scale: 2, null: false, default: 0
      t.timestamps
    end
  end
end
