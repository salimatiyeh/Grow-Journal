class WaterFeedEvent < ApplicationRecord
  belongs_to :grow

  has_many :wf_event_plants, dependent: :destroy
  has_many :wf_event_runoffs, dependent: :destroy
  has_many :wf_event_nutrients, dependent: :destroy
  has_many :wf_nutrient_lines, dependent: :destroy
  has_many :plants, through: :wf_event_plants

  enum ppm_ec_unit: { ppm: 0, ec: 1 }, _prefix: :unit

  validates :date, presence: true
end
