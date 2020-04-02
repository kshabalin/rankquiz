class ListingController < ApplicationController
  require "http"
  USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Safari/537.36"

  def fetch
    render json: JSON.parse(fetch_listing), status: :ok
  end

  def index
    @listings = current_user.listings.all
  end

  def new
  end

  def create
    current_user.listings.create!(listing_params)
    head :ok
    rescue StandardError => e
      render json: { error_message: error_message(e) }, status: :unprocessable_entity
  end

  private

  def error_message(e)
    e.message.include?("Listing has already been taken") ? "You have already added this listing to your Portfolio" : e.message
  end

  def fetch_listing
    HTTP.headers(:user_agent => USER_AGENT).get(fetch_listing_url).body
  end

  def fetch_listing_url
    "https://api.airbnb.com/v2/listings/#{listing_id}?_format=v1_legacy_short&client_id=d306zoyjsyarp7ifhu67rjxn52tv0t20"
  end

  def listing_id
    res = HTTP.headers(:user_agent => USER_AGENT).follow.get(fetch_params[:url])
    res.uri.to_s.match(/[0-9]+($|\/?)/)
  end

  def listing_params
    {
      listing_id: permitted_params[:listing_id],
      city: permitted_params[:city],
      title: permitted_params[:title],
      markets_attributes: permitted_params[:markets]
    }
  end

  def fetch_params
    params.permit(:url)
  end

  def permitted_params
    params.require(:listing).permit(:listing_id, :city, :title, markets: [:name])
  end
end
