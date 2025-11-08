module V1
  class PlantsController < ApplicationController
    # GET /v1/grows/:grow_id/plants
    def index
      render json: Plant.where(grow_id: params[:grow_id]).order(created_at: :desc)
    end

    # POST /v1/grows/:grow_id/plants
    def create
      plant = Plant.create!(plant_params.merge(grow_id: params[:grow_id]))
      render json: plant, status: :created
    end

    # GET /v1/plants/:id
    def show
      render json: Plant.find(params[:id])
    end

    # PATCH/PUT /v1/plants/:id
    def update
      plant = Plant.find(params[:id])
      plant.update!(plant_params)
      render json: plant
    end

    # DELETE /v1/plants/:id
    def destroy
      Plant.find(params[:id]).destroy!
      head :no_content
    end

    private

    def plant_params
      params.require(:plant).permit(
        :name, :breeder, :medium, :pot_size_gal, :is_autoflower,
        :stage, :status, :sprout_date, :last_update
      )
    end
  end
end
