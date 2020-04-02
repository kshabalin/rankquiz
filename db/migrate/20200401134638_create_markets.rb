class CreateMarkets < ActiveRecord::Migration[6.0]
  def change
    create_table :markets do |t|
      t.string :name
      t.references :listing, null: false, foreign_key: true

      t.timestamps
    end
  end
end
