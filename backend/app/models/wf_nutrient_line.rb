class WfNutrientLine < ApplicationRecord
  belongs_to :water_feed_event

  enum unit: { ml: 0, g: 1 }, _default: :ml

  validates :name, presence: true
  validates :amount_per_gal, numericality: { greater_than_or_equal_to: 0 }
end
