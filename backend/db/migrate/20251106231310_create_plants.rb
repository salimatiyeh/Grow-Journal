class CreatePlants < ActiveRecord::Migration[7.1]
  def change
    create_table :plants do |t|
      t.references :grow, null: false, foreign_key: true
      t.string :name
      t.string :breeder
      t.string :medium
      t.float :pot_size_gal
      t.boolean :is_autoflower
      t.string :stage
      t.string :status
      t.date :sprout_date
      t.datetime :last_update

      t.timestamps
    end
  end
end
