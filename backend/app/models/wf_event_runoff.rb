class WfEventRunoff < ApplicationRecord
  belongs_to :event, class_name: 'WaterFeedEvent', foreign_key: 'water_feed_event_id'
  belongs_to :plant
end
