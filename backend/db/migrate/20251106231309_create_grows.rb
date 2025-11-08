class CreateGrows < ActiveRecord::Migration[7.1]
  def change
    create_table :grows do |t|
      t.string :name
      t.date :start_date
      t.date :end_date
      t.float :area_sqft
      t.string :light_type
      t.string :light_brand
      t.string :light_model
      t.string :light_cycle
      t.boolean :autoflower
      t.string :status

      t.timestamps
    end
  end
end
