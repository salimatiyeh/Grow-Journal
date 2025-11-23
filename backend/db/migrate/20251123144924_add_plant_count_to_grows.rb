class AddPlantCountToGrows < ActiveRecord::Migration[7.1]
  def change
    add_column :grows, :plant_count, :integer
  end
end
