class CreateWfEventPlants < ActiveRecord::Migration[7.1]
  def change
    create_table :wf_event_plants do |t|
      t.references :water_feed_event, null: false, foreign_key: true
      t.references :plant, null: false, foreign_key: true
      t.float :volume_gal

      t.timestamps
      t.index [:water_feed_event_id, :plant_id], unique: true
    end
  end
end
