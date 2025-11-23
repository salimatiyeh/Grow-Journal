# backend/db/seeds.rb

puts "Deleting existing data..."
PlantDailyDatum.delete_all if defined?(PlantDailyDatum)
DailyEntry.delete_all
Plant.delete_all
Grow.delete_all

puts "Creating grow..."

start_date = 20.days.ago.to_date

grow = Grow.create!(
  name:        "Test Tent Grow",
  start_date:  start_date,
  end_date:    nil,
  area_sqft:   8.0,
  light_type:  "LED",
  light_brand: "AC Infinity",
  light_model: "IONBOARD S44",
  light_cycle: "18/6",
  autoflower:  true,
  status:      "active",
  plant_count: 3
)

puts "Created grow: #{grow.name} (id=#{grow.id})"

puts "Creating plants..."

plants_attrs = [
  {
    name:          "Gorilla Zkittlez",
    breeder:       "Barney's Farm",
    medium:        "Coco",
    pot_size_gal:  5.0,
    is_autoflower: true,
    stage:         "veg",
    status:        "healthy",
    sprout_date:   start_date + 4.days
  },
  {
    name:          "Purple Lemonade",
    breeder:       "Fast Buds",
    medium:        "Soil",
    pot_size_gal:  3.0,
    is_autoflower: true,
    stage:         "flower",
    status:        "healthy",
    sprout_date:   start_date + 6.days
  },
  {
    name:          "Mystery Auto",
    breeder:       "Bagseed",
    medium:        "Soil",
    pot_size_gal:  3.0,
    is_autoflower: true,
    stage:         "veg",
    status:        "ok",
    sprout_date:   start_date + 8.days
  }
]

plants = plants_attrs.map { |attrs| grow.plants.create!(attrs) }

puts "Created #{plants.size} plants."

puts "Creating daily entries..."

14.downto(1) do |i|
  day = i.days.ago.to_date

  base_temp = 75 + rand(-3..3)      # 72–78°F
  humidity  = 60 + rand(-5..5)      # 55–65%

  DailyEntry.create!(
    grow:                grow,
    date:                day,
    temperature_f:       base_temp,
    humidity_percent:    humidity,
    outside_high_f:      base_temp + rand(5..10),
    outside_low_f:       base_temp - rand(5..10),
    light_intensity_percent: nil,   # currently unused
    notes:               "Auto-seeded day #{day}"
  )
end

puts "Seeding done."
puts "Grow.count:        #{Grow.count}"
puts "Plant.count:       #{Plant.count}"
puts "DailyEntry.count:  #{DailyEntry.count}"
