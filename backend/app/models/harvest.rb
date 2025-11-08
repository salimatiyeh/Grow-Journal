class Harvest < ApplicationRecord
  belongs_to :plant

  # when a harvest is saved as completed, mark plant completed
  after_save :mark_plant_completed_if_final

  private

  def mark_plant_completed_if_final
    return unless status.to_s == 'completed'
    plant.update!(status: 'completed')

    # if every plant in the grow is completed, close the grow
    grow = plant.grow
    if grow.plants.where.not(status: 'completed').count == 0
      grow.update!(status: 'completed', end_date: (grow.end_date || Date.today))
    end
  end
end
