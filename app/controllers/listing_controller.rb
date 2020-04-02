class ListingController < ApplicationController
  def index
    @listings = current_user.listings.all
  end

  def new
  end

  def create
    current_user.listings.create!(listing_params)
    head :ok
    rescue StandardError => e
      render json: { error_message: e.message }, status: :unprocessable_entity
  end

  private

  def listing_params
    {
      listing_id: permitted_params[:listing_id],
      city: permitted_params[:city],
      title: permitted_params[:title],
      markets_attributes: permitted_params[:markets]
    }
  end

  def permitted_params
    params.require(:listing).permit(:listing_id, :city, :title, markets: [:name])
  end
end
