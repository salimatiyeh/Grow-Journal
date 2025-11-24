module V1
  class WeatherController < ApplicationController
    require 'net/http'
    require 'json'
    require 'date'

    # GET /v1/weather/:zip
    def show
      zip = params[:zip].to_s.strip
      return render json: { error: 'ZIP code required' }, status: :bad_request if zip.blank?

      date = parse_date(params[:date])
      return render json: { error: 'Invalid date' }, status: :bad_request if date == :invalid
      date ||= Date.current

      geocode = fetch_geocode(zip)
      unless geocode
        return render json: { error: 'Location not found' }, status: :not_found
      end

      forecast = fetch_forecast(geocode[:latitude], geocode[:longitude], date)
      unless forecast
        return render json: { error: 'Weather unavailable' }, status: :bad_gateway
      end

      render json: forecast
    rescue StandardError => e
      render json: { error: e.message }, status: :bad_gateway
    end

    private

    def parse_date(date_param)
      return nil if date_param.blank?
      Date.iso8601(date_param)
    rescue ArgumentError
      :invalid
    end

    def fetch_geocode(zip)
      url = URI("https://geocoding-api.open-meteo.com/v1/search?name=#{URI.encode_www_form_component(zip)}&count=1&language=en&format=json")
      response = Net::HTTP.get_response(url)
      return nil unless response.is_a?(Net::HTTPSuccess)

      data = JSON.parse(response.body)
      result = data['results']&.first
      return nil unless result

      {
        latitude: result['latitude'],
        longitude: result['longitude']
      }
    end

    def fetch_forecast(latitude, longitude, date)
      params = {
        latitude: latitude,
        longitude: longitude,
        daily: 'temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean',
        temperature_unit: 'fahrenheit',
        windspeed_unit: 'mph',
        timezone: 'auto',
        start_date: date.iso8601,
        end_date: date.iso8601
      }
      query = URI.encode_www_form(params)
      url = URI("https://api.open-meteo.com/v1/forecast?#{query}")

      response = Net::HTTP.get_response(url)
      return nil unless response.is_a?(Net::HTTPSuccess)

      data = JSON.parse(response.body)
      daily = data['daily'] || {}
      temps_max = daily['temperature_2m_max']
      temps_min = daily['temperature_2m_min']
      humidity_mean = daily['relative_humidity_2m_mean']

      return nil if temps_max.nil? || temps_min.nil? || temps_max.empty? || temps_min.empty?

      {
        outside_high_f: temps_max[0],
        outside_low_f: temps_min[0],
        humidity_percent: humidity_mean&.first
      }
    end
  end
end
