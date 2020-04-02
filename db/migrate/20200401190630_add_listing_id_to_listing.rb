class AddListingIdToListing < ActiveRecord::Migration[6.0]
  def change
    add_column :listings, :listing_id, :string
  end
end
