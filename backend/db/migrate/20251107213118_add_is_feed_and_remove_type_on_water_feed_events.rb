class AddIsFeedAndRemoveTypeOnWaterFeedEvents < ActiveRecord::Migration[7.1]
  def change
    # add is_feed if it isn't there yet
    add_column :water_feed_events, :is_feed, :boolean, null: false, default: false unless column_exists?(:water_feed_events, :is_feed)

    # remove STI-reserved column if it exists
    remove_column :water_feed_events, :type, :string if column_exists?(:water_feed_events, :type)
  end
end
