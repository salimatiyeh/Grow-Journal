class DailyEntry < ApplicationRecord
  belongs_to :grow
  has_many :plant_daily_data, class_name: 'PlantDailyDatum', dependent: :destroy
  before_save :recalculate_vpd
  private
  def recalculate_vpd
    return if temperature_f.blank? || humidity_percent.blank?

    t_c = (temperature_f - 32) * 5.0 / 9.0
    svp = 0.6108 * Math.exp((17.27 * t_c) / (t_c + 237.3))
    vpd_kpa = svp * (1 - humidity_percent.to_f / 100.0)
    self.vpd = vpd_kpa.round(2)
  end
end
