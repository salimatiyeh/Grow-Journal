class PlantDailyDatum < ApplicationRecord
  belongs_to :daily_entry
  belongs_to :plant
end
