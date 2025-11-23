class AddPhotoUrlToPlants < ActiveRecord::Migration[7.1]
  def change
    add_column :plants, :photo_url, :text
  end
end
