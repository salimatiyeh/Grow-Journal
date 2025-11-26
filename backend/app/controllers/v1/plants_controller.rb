module V1
  class PlantsController < ApplicationController
    include Rails.application.routes.url_helpers

    # GET /v1/grows/:grow_id/plants
    def index
      plants = Plant.where(grow_id: params[:grow_id]).order(created_at: :desc)
      render json: plants.map { |plant| plant_json(plant) }
    end

    # POST /v1/grows/:grow_id/plants
    def create
      grow = Grow.find(params[:grow_id])
      plant = grow.plants.build(plant_params.except(:photo))

      if plant.save
        attach_photo(plant)
        render json: plant_json(plant), status: :created
      else
        render json: { errors: plant.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # GET /v1/plants/:id
    def show
      render json: plant_json(Plant.find(params[:id]))
    end

    # PATCH/PUT /v1/plants/:id
    def update
      plant = Plant.find(params[:id])
      attach_photo(plant)

      if plant.update(plant_params.except(:photo))
        render json: plant_json(plant)
      else
        render json: { errors: plant.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /v1/plants/:id
    def destroy
      Plant.find(params[:id]).destroy!
      head :no_content
    end

    private

    def attach_photo(plant)
      file = params.dig(:plant, :photo)
      return unless file.present?

      plant.photo.attach(file)
    end

    def plant_params
      params.require(:plant).permit(
        :name, :strain, :breeder, :medium, :pot_size_gal,
        :is_autoflower, :stage, :status, :sprout_date, :photo
      )
    end

    def plant_json(plant)
      photo_url = plant.photo.attached? ? rails_blob_url(plant.photo, only_path: false) : nil
      plant.as_json.merge(photo_url: photo_url)
    end
  end
end
