class AddNotesToDailyEntries < ActiveRecord::Migration[7.1]
  def change
    add_column :daily_entries, :notes, :text
  end
end
