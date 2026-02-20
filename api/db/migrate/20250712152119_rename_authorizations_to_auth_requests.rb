class RenameAuthorizationsToAuthRequests < ActiveRecord::Migration[7.2]
  def change
    rename_table :authorizations, :auth_requests
  end
end
