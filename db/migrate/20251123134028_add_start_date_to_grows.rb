class AddStartDateToGrows < ActiveRecord::Migration[7.1]
  def change
    add_column :grows, :start_date, :date
  end
end
