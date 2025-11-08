module V1
  class PlantDailyDataController < ApplicationController
    # POST /v1/daily_entries/:daily_entry_id/plant_daily_data
    def create
      entry = DailyEntry.find(params[:daily_entry_id])
      pdd = PlantDailyDatum.create!(pdd_params.merge(daily_entry: entry))
      render json: pdd, status: :created
    end

    # GET /v1/plant_daily_data/:id
    def show
      render json: PlantDailyDatum.find(params[:id])
    end

    # PATCH /v1/plant_daily_data/:id
    def update
      pdd = PlantDailyDatum.find(params[:id])
      pdd.update!(pdd_params)
      render json: pdd
    end

    private

    def pdd_params
      params.require(:plant_daily_datum).permit(
        :plant_id, :ppfd, :light_height_in, :plant_height_in,
        :issue, :notes, :issue_photo_url
      )
    end
  end
end
