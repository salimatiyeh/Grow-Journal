## Backend refresh summary

- Rebuilt the core migrations (`grows`, `plants`, `daily_entries`, `plant_daily_data`, `water_feed_events`, `wf_event_plants`, `wf_nutrient_lines`) so the schema lines up exactly with the spec: only the documented columns exist, and enum columns now store friendly strings (`"ppm"`/`"ec"`, `"ml"`/`"g"`).
- Models reflect those relationships and validations—grows/plants require names, ppm/ec and runoff units use string enums, and plant daily data exposes a `stage_*` enum for the veg/flower/auto stages.
- Controllers were updated to whitelist the new attributes, keep daily-entry plant data in sync with grow ownership, and expose the plant-daily-data endpoint at `/v1/plants/:plant_id/daily_data`.
- Routes are now RESTful per the requirements: grow-scoped plants/daily entries/water-feed events plus top-level plant show/update/destroy, nested `daily_data`, and feed-event show routes.
