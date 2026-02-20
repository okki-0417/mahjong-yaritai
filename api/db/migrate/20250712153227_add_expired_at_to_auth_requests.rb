class AddExpiredAtToAuthRequests < ActiveRecord::Migration[7.2]
  def change
    add_column :auth_requests, :expired_at, :datetime, null: false, default: -> { "NOW() + INTERVAL '15 minutes'" }
  end
end
