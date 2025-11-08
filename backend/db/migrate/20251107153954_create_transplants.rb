class CreateTransplants < ActiveRecord::Migration[7.1]
  def change
    create_table :transplants do |t|
      t.references :plant, null: false, foreign_key: true
      t.date :date
      t.float :new_pot_size_gal

      t.timestamps
    end
  end
end
