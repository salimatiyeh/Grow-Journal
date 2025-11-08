# class AddUnitsAndPrecisionsToWaterFeedEvents < ActiveRecord::Migration[7.1]
#   def change
#     add_column :water_feed_events, :ppm_ec_unit, :integer
#     change_column :water_feed_events, :ph,           :decimal, precision: 4, scale: 2
#     change_column :water_feed_events, :ppm_ec_value, :decimal, precision: 6, scale: 2
#   end
# end
class AddUnitsAndPrecisionsToWaterFeedEvents < ActiveRecord::Migration[7.1]
  def change
    # enum backing column for ppm/ec
    add_column :water_feed_events, :ppm_ec_unit, :integer, default: 0, null: false \
      unless column_exists?(:water_feed_events, :ppm_ec_unit)

    # ph might not exist (your original create didn’t add it)
    if column_exists?(:water_feed_events, :ph)
      change_column :water_feed_events, :ph, :decimal, precision: 4, scale: 2
    else
      add_column :water_feed_events, :ph, :decimal, precision: 4, scale: 2
    end

    # tighten precision
    change_column :water_feed_events, :ppm_ec_value, :decimal, precision: 4, scale: 2 \
      if column_exists?(:water_feed_events, :ppm_ec_value)
  end
end
