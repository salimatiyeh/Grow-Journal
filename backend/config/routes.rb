Rails.application.routes.draw do
  namespace :v1 do
    resources :grows, only: %i[index show create update destroy] do
      resources :plants,        only: %i[index create]
      resources :daily_entries, only: %i[index create]   # <-- needed

      resources :water_feed_events, only: %i[index create]
    end
    resources :water_feed_events, only: %i[show]

    resources :plants,        only: %i[show update destroy]
    resources :daily_entries, only: %i[show] do
      resources :plant_daily_data, only: %i[create]      # <-- needed
    end
    resources :plant_daily_data, only: %i[show update]

    get 'weather/:zip', to: 'weather#show'
  end
end
