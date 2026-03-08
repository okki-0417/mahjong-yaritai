require "sidekiq/web"

Rails.application.routes.draw do
  mount ActiveStorage::Engine => "/rails/active_storage"

  get "/", to: "rails/health#show"
  get "/up", to: "rails/health#show"

  defaults format: :json do
    namespace :auth do
      namespace :google do
        resource :callback, only: %i[create]
      end

      resource :status, only: %i[show]
      resource :request, only: %i[create]
      resource :verify, only: %i[create]
      resource :refresh, only: %i[create]
      resource :logout, only: %i[create]

      namespace :line do
        resource :login_url, only: %i[create]
        resource :callback, only: %i[create]
      end
    end

    resource :me, controller: :me, only: %i[show update] do
      resources :followings, only: %i[create destroy], module: :me
    end

    resources :users, only: %i[show] do
      resource :follow_stats, only: %i[show], module: :users
      resources :followers, only: %i[index], module: :users
      resources :followings, only: %i[index], module: :users
    end

    resources :what_to_discard_problems, only: %i[index show create update destroy] do
      resources :likes, only: %i[create destroy], module: :what_to_discard_problems
      resources :votes, only: %i[create destroy], module: :what_to_discard_problems
      resources :comments, module: :what_to_discard_problems, only: %i[index create] do
        resources :replies, only: %i[index], controller: :comments, action: :replies
      end
    end

    post "/graphql", to: "graphql#execute"
  end

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
    mount Sidekiq::Web => "/sidekiq"
    mount Rswag::Ui::Engine => "/api-docs"
    mount Rswag::Api::Engine => "/api-docs"
  end
end
