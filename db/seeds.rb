# Seeds for grow-journal

puts "Clearing existing data..."
PlantDailyDatum.delete_all if defined?(PlantDailyDatum)
DailyEntry.delete_all
Plant.delete_all
Grow.delete_all

puts "Creating grow..."
start_date = 20.days.ago.to_date

grow = Grow.create!(
  name: 'Test Tent Grow',
  start_date: start_date,
  end_date: nil,
  area_sqft: 16.0,
  light_type: 'LED',
  light_brand: 'AC Infinity',
  light_model: 'IONBOARD S44',
  light_cycle: '18/6',
  autoflower: true,
  status: 'active'
)

puts "Creating plants..."
plants_attrs = [
  {
    name: 'Sunset Sherbet #1',
    breeder: "Barney's Farm",
    medium: 'Coco',
    pot_size_gal: 5.0,
    is_autoflower: true,
    stage: 'veg',
    status: 'healthy',
    sprout_date: start_date + 4.days
  },
  {
    name: 'Gorilla Zkittlez',
    breeder: "Barney's Farm",
    medium: 'Soil',
    pot_size_gal: 3.0,
    is_autoflower: true,
    stage: 'veg',
    status: 'healthy',
    sprout_date: start_date + 5.days
  },
  {
    name: 'Mystery Auto',
    breeder: 'Unknown',
    medium: 'Coco',
    pot_size_gal: 4.0,
    is_autoflower: true,
    stage: 'veg',
    status: 'healthy',
    sprout_date: start_date + 6.days
  }
]

plants_attrs.each do |attrs|
  Plant.create!(attrs.merge(grow_id: grow.id))
end

# Simple helper to approximate VPD (kPa)
def calculate_vpd(temperature_f, humidity_percent)
  return nil if temperature_f.nil? || humidity_percent.nil?
  temp_c = (temperature_f - 32) * 5.0 / 9.0
  es = 0.6108 * Math.exp((17.27 * temp_c) / (temp_c + 237.3))
  vpd = es * (1 - humidity_percent.to_f / 100.0)
  vpd.round(2)
end

puts "Creating daily entries..."
14.times do |i|
  date = (13 - i).days.ago.to_date
  temperature_f = rand(75.0..82.0).round(1)
  humidity_percent = rand(50.0..65.0).round(1)
  outside_high_f = rand(85.0..98.0).round(1)
  outside_low_f = rand(65.0..75.0).round(1)
  light_intensity_percent = rand(40.0..80.0).round(1)

  DailyEntry.create!(
    grow_id: grow.id,
    date: date,
    temperature_f: temperature_f,
    humidity_percent: humidity_percent,
    outside_high_f: outside_high_f,
    outside_low_f: outside_low_f,
    light_intensity_percent: light_intensity_percent,
    vpd: calculate_vpd(temperature_f, humidity_percent)
  )
end

puts "Seed complete: #{Grow.count} grows, #{Plant.count} plants, #{DailyEntry.count} daily entries"
