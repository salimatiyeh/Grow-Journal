class WfEventNutrient < ApplicationRecord
  belongs_to :event, class_name: 'WaterFeedEvent', foreign_key: 'water_feed_event_id'
  belongs_to :water_feed_event
  enum unit: { ml: 0, g: 1 }, _prefix: :unit
end
