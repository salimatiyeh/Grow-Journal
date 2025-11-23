class Plant < ApplicationRecord
  belongs_to :grow

  has_many :transplants, dependent: :destroy
  has_many :harvests,    dependent: :destroy

  has_one_attached :photo, dependent: :purge_later rescue nil

  validates :name, presence: true
end
