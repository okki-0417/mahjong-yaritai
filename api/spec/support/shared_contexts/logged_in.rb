# frozen_string_literal: true

shared_context "logged_in" do
  before do
    if defined?(current_user) && current_user
      post session_url, params: {
        session: {
          email: current_user.email,
          password: "password",
        },
      }
    end
  end
end
