class Grow < ApplicationRecord
  has_many :plants, dependent: :destroy
  has_many :daily_entries, dependent: :destroy
  has_many :water_feed_events, dependent: :destroy

  validates :name, presence: true
end
