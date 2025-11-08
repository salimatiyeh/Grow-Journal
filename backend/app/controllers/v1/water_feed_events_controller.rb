module V1
  class WaterFeedEventsController < ApplicationController
    def index
      events = WaterFeedEvent
                .where(grow_id: params[:grow_id])
                .order(date: :desc, created_at: :desc)

      render json: events.map { |e| serialize_event(e) }
    end

    def show
      event = WaterFeedEvent.find(params[:id])
      render json: serialize_event(event)
    end

    # Create event.
    # Supports:
    #  - Water-only: { is_feed:false, ph, plant_splits:[{plant_id, amount_gal, runoff_ph, runoff_ppm_ec_value, runoff_ppm_ec_unit}] }
    #  - Feed: { is_feed:true, ph, ppm_ec_value, ppm_ec_unit, nutrients:[{name, unit, amount_per_gal}], plant_splits:[...] }
    #  - Even split helper: { even_split_total_gal, plant_ids:[...] }  # auto-splits equally unless plant_splits given
    def create
      event = nil
      ActiveRecord::Base.transaction do
        event = WaterFeedEvent.create!(event_params.merge(grow_id: params[:grow_id]))

        splits = build_splits_from_params
        splits.each { |ps| WfEventPlant.create!(ps.merge(water_feed_event: event)) }

        Array(params[:nutrients]).each do |n|
          WfNutrientLine.create!(
            water_feed_event: event,
            name: n[:name],
            unit: n[:unit],                 # "ml" or "g"
            amount_per_gal: n[:amount_per_gal]
          )
        end
      end

      render json: serialize_event(event), status: :created
    end

    private

    def event_params
      params.permit(:date, :is_feed, :ph, :ppm_ec_value, :ppm_ec_unit)
    end

    # Accept either explicit plant_splits[] or even_split_total_gal + plant_ids[]
    def build_splits_from_params
      explicit = Array(params[:plant_splits])
      return explicit.map { |ps| permitted_split(ps) } if explicit.any?

      total = params[:even_split_total_gal].to_f
      ids   = Array(params[:plant_ids]).map(&:to_i)
      return [] if total <= 0 || ids.empty?

      per = (total / ids.size.to_f).round(3)
      ids.map { |pid| { plant_id: pid, amount_gal: per } }
    end

    def permitted_split(ps)
      {
        plant_id: ps[:plant_id],
        amount_gal: ps[:amount_gal],
        runoff_ph: ps[:runoff_ph],
        runoff_ppm_ec_value: ps[:runoff_ppm_ec_value],
        runoff_ppm_ec_unit: ps[:runoff_ppm_ec_unit]
    }.compact
    end

    def serialize_event(event)
      {
        id: event.id,
        grow_id: event.grow_id,
        date: event.date,
        is_feed: event.is_feed,
        ph: event.ph,
        ppm_ec_value: event.ppm_ec_value,
        ppm_ec_unit: event.ppm_ec_unit,
        plants: event.wf_event_plants.as_json,
        nutrients: event.wf_nutrient_lines.as_json
      }
    end
  end
end
