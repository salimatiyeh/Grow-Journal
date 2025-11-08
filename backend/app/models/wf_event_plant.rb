class WfEventPlant < ApplicationRecord
  belongs_to :water_feed_event
  belongs_to :plant

  enum runoff_ppm_ec_unit: { ppm: 0, ec: 1 },
       _prefix: :runoff_unit,
       _default: :ppm
end
