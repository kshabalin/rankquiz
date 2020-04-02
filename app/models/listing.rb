class Listing < ApplicationRecord
  has_many :markets, dependent: :destroy
  belongs_to :user
  validates :listing_id, uniqueness: { scope: :user }
  accepts_nested_attributes_for :markets, allow_destroy: true

  def list_markets
    markets.map{|m| m.name}.join(", ")
  end
end
