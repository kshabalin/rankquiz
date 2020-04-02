Rails.application.routes.draw do
  devise_for :users

  devise_scope :user do
    authenticated :user do
      root 'listing#index', as: :authenticated_root
      resources :listing, only: %i[new create index] do
        collection do
          get :fetch
        end
      end
    end

    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end
  end

end
