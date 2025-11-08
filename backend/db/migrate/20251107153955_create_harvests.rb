class CreateHarvests < ActiveRecord::Migration[7.1]
  def change
    create_table :harvests do |t|
      t.references :plant, null: false, foreign_key: true
      t.date :harvest_date
      t.integer :drying_days
      t.integer :curing_days
      t.float :final_weight_g
      t.text :notes
      t.string :status

      t.timestamps
    end
  end
end
