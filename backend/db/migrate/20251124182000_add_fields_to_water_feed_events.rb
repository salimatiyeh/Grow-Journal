class AddFieldsToWaterFeedEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :water_feed_events, :water_amount_gal, :decimal, precision: 4, scale: 2 unless column_exists?(:water_feed_events, :water_amount_gal)
    add_column :water_feed_events, :nutrient_notes, :text unless column_exists?(:water_feed_events, :nutrient_notes)
  end
end
