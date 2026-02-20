require "sidekiq/web"

Rails.application.routes.draw do
  mount ActiveStorage::Engine => "/rails/active_storage"

  get "/", to: "rails/health#show"
  get "/up", to: "rails/health#show"

  namespace :auth do
    namespace :google do
      resource :callback, only: %i[create]
    end

    namespace :line do
      resource :login_url, only: %i[show]
      resource :callback, only: %i[create]
    end
  end

  post "/graphql", to: "graphql#execute"

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
    mount Sidekiq::Web => "/sidekiq"
    mount Rswag::Ui::Engine => "/api-docs"
    mount Rswag::Api::Engine => "/api-docs"
  end
end
