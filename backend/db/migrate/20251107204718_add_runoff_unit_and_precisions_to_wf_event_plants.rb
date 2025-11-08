# class AddRunoffUnitAndPrecisionsToWfEventPlants < ActiveRecord::Migration[7.1]
#   def change
#     add_column :wf_event_plants, :runoff_ppm_ec_unit, :integer
#     change_column :wf_event_plants, :amount_gal,          :decimal, precision: 5, scale: 2
#     change_column :wf_event_plants, :runoff_ph,           :decimal, precision: 4, scale: 2
#     change_column :wf_event_plants, :runoff_ppm_ec_value, :decimal, precision: 6, scale: 2
#   end
# end
class AddRunoffUnitAndPrecisionsToWfEventPlants < ActiveRecord::Migration[7.1]
  def change
    add_column :wf_event_plants, :runoff_ppm_ec_unit, :integer, default: 0, null: false \
      unless column_exists?(:wf_event_plants, :runoff_ppm_ec_unit)

    change_column :wf_event_plants, :runoff_ph, :decimal, precision: 4, scale: 2 \
      if column_exists?(:wf_event_plants, :runoff_ph)

    change_column :wf_event_plants, :amount_gal, :decimal, precision: 5, scale: 2 \
      if column_exists?(:wf_event_plants, :amount_gal)

    change_column :wf_event_plants, :runoff_ppm_ec_value, :decimal, precision: 6, scale: 2 \
      if column_exists?(:wf_event_plants, :runoff_ppm_ec_value)
  end
end
