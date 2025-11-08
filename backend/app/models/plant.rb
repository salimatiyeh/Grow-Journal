class Plant < ApplicationRecord
  belongs_to :grow
  has_many :transplants, dependent: :destroy
  has_many :harvests,    dependent: :destroy
end
