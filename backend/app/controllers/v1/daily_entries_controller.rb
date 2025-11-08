module V1
  class DailyEntriesController < ApplicationController
    # GET /v1/grows/:grow_id/daily_entries
    def index
      entries = DailyEntry.where(grow_id: params[:grow_id]).order(date: :desc)
      render json: entries
    end

    # GET /v1/daily_entries/:id
    def show
      entry = DailyEntry.find(params[:id])
      render json: entry.as_json.merge(
        plant_data: entry.plant_daily_data.as_json
      )
    end

    # POST /v1/grows/:grow_id/daily_entries
    # Accepts shared fields + optional plant_data: [{plant_id, ppfd, light_height_in, plant_height_in, issue, notes, issue_photo_url}]
    def create
      entry = DailyEntry.create!(daily_params.merge(grow_id: params[:grow_id]))

      if params[:plant_data].present?
        params[:plant_data].each do |pd|
          PlantDailyDatum.create!(
            daily_entry: entry,
            plant_id: pd[:plant_id],
            ppfd: pd[:ppfd],
            light_height_in: pd[:light_height_in],
            plant_height_in: pd[:plant_height_in],
            issue: pd[:issue],
            notes: pd[:notes],
            issue_photo_url: pd[:issue_photo_url]
          )
        end
      end

      render json: entry, status: :created
    end

    private

    def daily_params
      params.permit(:date, :temperature_f, :humidity_percent, :vpd,
                    :light_intensity_percent, :outside_high_f, :outside_low_f)
    end
  end
end
