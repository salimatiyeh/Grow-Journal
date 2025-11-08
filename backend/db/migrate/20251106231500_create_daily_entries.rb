class CreateDailyEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :daily_entries do |t|
      t.references :grow, null: false, foreign_key: true
      t.date :date
      t.float :temperature_f
      t.float :humidity_percent
      t.float :vpd
      t.float :light_intensity_percent
      t.float :outside_high_f
      t.float :outside_low_f
      t.timestamps

      t.index [:grow_id, :date], unique: true
    end
  end
end
