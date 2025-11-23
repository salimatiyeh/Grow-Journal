class AddPhRangeCheckToWaterFeedEvents < ActiveRecord::Migration[7.1]
  def change
    add_check_constraint :water_feed_events,
                         'ph >= 0 AND ph <= 14',
                         name: 'ph_between_0_and_14'
  end
end
