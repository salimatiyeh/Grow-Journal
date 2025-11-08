class DailyEntry < ApplicationRecord
  belongs_to :grow
  has_many :plant_daily_data, class_name: 'PlantDailyDatum', dependent: :destroy
end
