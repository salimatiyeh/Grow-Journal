# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_11_24_180000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
    t.index ["blob_id"], name: "index_active_storage_variant_records_on_blob_id"
  end

  create_table "daily_entries", force: :cascade do |t|
    t.bigint "grow_id", null: false
    t.date "date"
    t.float "temperature_f"
    t.float "humidity_percent"
    t.float "vpd"
    t.float "light_intensity_percent"
    t.float "outside_high_f"
    t.float "outside_low_f"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "notes"
    t.float "outside_humidity_percent"
    t.index ["grow_id", "date"], name: "index_daily_entries_on_grow_id_and_date", unique: true
    t.index ["grow_id"], name: "index_daily_entries_on_grow_id"
  end

  create_table "grows", force: :cascade do |t|
    t.string "name"
    t.date "start_date"
    t.date "end_date"
    t.float "area_sqft"
    t.string "light_type"
    t.string "light_brand"
    t.string "light_model"
    t.string "light_cycle"
    t.boolean "autoflower"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "plant_count"
  end

  create_table "harvests", force: :cascade do |t|
    t.bigint "plant_id", null: false
    t.date "harvest_date"
    t.integer "drying_days"
    t.integer "curing_days"
    t.float "final_weight_g"
    t.text "notes"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plant_id"], name: "index_harvests_on_plant_id"
  end

  create_table "plant_daily_data", force: :cascade do |t|
    t.bigint "daily_entry_id", null: false
    t.bigint "plant_id", null: false
    t.float "ppfd"
    t.float "light_height_in"
    t.float "plant_height_in"
    t.text "issue"
    t.text "issue_photo_url"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["daily_entry_id", "plant_id"], name: "idx_pdd_entry_plant", unique: true
    t.index ["daily_entry_id"], name: "index_plant_daily_data_on_daily_entry_id"
    t.index ["plant_id"], name: "index_plant_daily_data_on_plant_id"
  end

  create_table "plants", force: :cascade do |t|
    t.bigint "grow_id", null: false
    t.string "name"
    t.string "breeder"
    t.string "medium"
    t.float "pot_size_gal"
    t.boolean "is_autoflower"
    t.string "stage"
    t.string "status"
    t.date "sprout_date"
    t.datetime "last_update"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["grow_id"], name: "index_plants_on_grow_id"
  end

  create_table "transplants", force: :cascade do |t|
    t.bigint "plant_id", null: false
    t.date "date"
    t.float "new_pot_size_gal"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plant_id"], name: "index_transplants_on_plant_id"
  end

  create_table "water_feed_events", force: :cascade do |t|
    t.bigint "grow_id", null: false
    t.date "date"
    t.float "solution_ph"
    t.string "strength_mode"
    t.float "solution_strength"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "ppm_ec_unit", default: 0, null: false
    t.decimal "ph", precision: 4, scale: 2
    t.decimal "ppm_ec_value", precision: 8, scale: 2
    t.boolean "is_feed", default: false, null: false
    t.index ["grow_id"], name: "index_water_feed_events_on_grow_id"
  end

  create_table "wf_event_nutrients", force: :cascade do |t|
    t.bigint "water_feed_event_id", null: false
    t.string "name"
    t.float "amount_per_gal"
    t.string "unit"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["water_feed_event_id"], name: "index_wf_event_nutrients_on_water_feed_event_id"
  end

  create_table "wf_event_plants", force: :cascade do |t|
    t.bigint "water_feed_event_id", null: false
    t.bigint "plant_id", null: false
    t.float "volume_gal"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "runoff_ppm_ec_unit", default: 0, null: false
    t.decimal "amount_gal", precision: 5, scale: 2
    t.decimal "runoff_ph", precision: 3, scale: 1
    t.decimal "runoff_ppm_ec_value", precision: 8, scale: 2
    t.index ["plant_id"], name: "index_wf_event_plants_on_plant_id"
    t.index ["water_feed_event_id", "plant_id"], name: "index_wf_event_plants_on_water_feed_event_id_and_plant_id", unique: true
    t.index ["water_feed_event_id"], name: "index_wf_event_plants_on_water_feed_event_id"
  end

  create_table "wf_event_runoffs", force: :cascade do |t|
    t.bigint "water_feed_event_id", null: false
    t.bigint "plant_id", null: false
    t.float "runoff_ph"
    t.float "runoff_strength"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plant_id"], name: "index_wf_event_runoffs_on_plant_id"
    t.index ["water_feed_event_id", "plant_id"], name: "index_wf_event_runoffs_on_water_feed_event_id_and_plant_id", unique: true
    t.index ["water_feed_event_id"], name: "index_wf_event_runoffs_on_water_feed_event_id"
  end

  create_table "wf_nutrient_lines", force: :cascade do |t|
    t.bigint "water_feed_event_id", null: false
    t.string "name", null: false
    t.integer "unit", default: 0, null: false
    t.decimal "amount_per_gal", precision: 8, scale: 2, default: "0.0", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["water_feed_event_id"], name: "index_wf_nutrient_lines_on_water_feed_event_id"
  end

  add_foreign_key "daily_entries", "grows"
  add_foreign_key "harvests", "plants"
  add_foreign_key "plant_daily_data", "daily_entries"
  add_foreign_key "plant_daily_data", "plants"
  add_foreign_key "plants", "grows"
  add_foreign_key "transplants", "plants"
  add_foreign_key "water_feed_events", "grows"
  add_foreign_key "wf_event_nutrients", "water_feed_events"
  add_foreign_key "wf_event_plants", "plants"
  add_foreign_key "wf_event_plants", "water_feed_events"
  add_foreign_key "wf_event_runoffs", "plants"
  add_foreign_key "wf_event_runoffs", "water_feed_events"
  add_foreign_key "wf_nutrient_lines", "water_feed_events"
end
