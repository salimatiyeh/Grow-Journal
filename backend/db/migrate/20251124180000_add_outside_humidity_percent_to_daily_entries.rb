class AddOutsideHumidityPercentToDailyEntries < ActiveRecord::Migration[7.1]
  def change
    add_column :daily_entries, :outside_humidity_percent, :float
  end
end
