class SetDefaultForRunoffPpmEcUnitOnWfEventPlants < ActiveRecord::Migration[7.1]
  def up
    change_column_default :wf_event_plants, :runoff_ppm_ec_unit, 0
    execute "UPDATE wf_event_plants SET runoff_ppm_ec_unit = 0 WHERE runoff_ppm_ec_unit IS NULL"
  end
  def down
    change_column_default :wf_event_plants, :runoff_ppm_ec_unit, nil
  end
end
