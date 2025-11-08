class CreatePlantDailyData < ActiveRecord::Migration[7.1]
  def change
    create_table :plant_daily_data do |t|
      t.references :daily_entry, null: false, foreign_key: true
      t.references :plant, null: false, foreign_key: true
      t.float :ppfd
      t.float :light_height_in
      t.float :plant_height_in
      t.text :issue
      t.text :issue_photo_url
      t.text :notes

      t.timestamps
      t.index [:daily_entry_id, :plant_id], unique: true, name: 'idx_pdd_entry_plant'
    end
  end
end
