module V1
  class GrowsController < ApplicationController
    # GET /v1/grows
    def index
      render json: Grow.order(created_at: :desc)
    end

    # GET /v1/grows/:id
    def show
      render json: Grow.find(params[:id])
    end

    # POST /v1/grows
    def create
      grow = Grow.create!(grow_params)
      render json: grow, status: :created
    end

    # PATCH/PUT /v1/grows/:id
    def update
      grow = Grow.find(params[:id])
      grow.update!(grow_params)
      render json: grow
    end

    # DELETE /v1/grows/:id
    def destroy
      Grow.find(params[:id]).destroy!
      head :no_content
    end

    private

    def grow_params
      params.require(:grow).permit(
        :name, :start_date, :end_date, :area_sqft,
        :light_type, :light_brand, :light_model, :light_cycle,
        :autoflower, :status
      )
    end
  end
end
