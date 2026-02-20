# frozen_string_literal: true

shared_context "logged_in_rswag" do
  before do
    if defined?(current_user) && current_user
      allow_any_instance_of(ApplicationController)
        .to receive(:current_user)
        .and_return(current_user)
    end
  end
end
