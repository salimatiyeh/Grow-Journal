class AddMissingColsToWaterFeedEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :water_feed_events, :ph, :decimal, precision: 4, scale: 2, if_not_exists: true
    add_column :water_feed_events, :ppm_ec_value, :decimal, precision: 8, scale: 2, if_not_exists: true
    add_column :water_feed_events, :ppm_ec_unit, :integer, if_not_exists: true
  end
end
