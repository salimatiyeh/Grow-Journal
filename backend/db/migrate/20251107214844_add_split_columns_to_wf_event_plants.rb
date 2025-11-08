class AddSplitColumnsToWfEventPlants < ActiveRecord::Migration[7.1]
  def change
    # how much each plant received (gallons)
    add_column :wf_event_plants, :amount_gal, :decimal, precision: 5, scale: 2 unless column_exists?(:wf_event_plants, :amount_gal)

    # optional runoff readings per plant
    add_column :wf_event_plants, :runoff_ph, :decimal, precision: 3, scale: 1 unless column_exists?(:wf_event_plants, :runoff_ph)
    add_column :wf_event_plants, :runoff_ppm_ec_value, :decimal, precision: 8, scale: 2 unless column_exists?(:wf_event_plants, :runoff_ppm_ec_value)
    add_column :wf_event_plants, :runoff_ppm_ec_unit, :integer unless column_exists?(:wf_event_plants, :runoff_ppm_ec_unit)
  end
end
