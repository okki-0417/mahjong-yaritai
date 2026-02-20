# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::WhatToDiscardProblems::Comments::CreateWhatToDiscardProblemComment, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:problem) { create(:what_to_discard_problem) }
    let(:variables) do
      {
        whatToDiscardProblemId: problem.id.to_s,
        content: "test content",
        parentCommentId: parent_comment_id,
      }
    end
    let(:parent_comment_id) { nil }
    let(:mutation) do
      <<~GQL
        mutation($whatToDiscardProblemId: ID!, $content: String!, $parentCommentId: ID) {
          createWhatToDiscardProblemComment(input: {
            whatToDiscardProblemId: $whatToDiscardProblemId
            content: $content
            parentCommentId: $parentCommentId
          }) {
            comment {
              id
              content
              userId
            }
          }
        }
      GQL
    end

    context "when not logged in" do
      let(:current_user) { nil }

      it "returns error" do
        json = subject

        expect(json[:data][:createWhatToDiscardProblemComment]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "when logged in" do
      context "when save fails" do
        before do
          errors = double(full_messages: [ "validation error" ])
          comment = instance_double(Comment, save: false, errors:)
          allow(current_user.created_comments).to receive(:new).and_return(comment)
        end

        it "returns validation error" do
          json = subject

          expect(json[:data][:createWhatToDiscardProblemComment]).to be_nil
          expect(json[:errors].any?).to be true
        end
      end

      context "when save succeeds" do
        context "without parent comment" do
          it "creates comment" do
            json = subject

            expect(json[:data][:createWhatToDiscardProblemComment][:comment]).to be_present
          end
        end

        context "with parent comment" do
          let(:parent_comment) { create(:comment, commentable: problem, user: current_user) }
          let(:parent_comment_id) { parent_comment.id.to_s }

          it "creates reply comment" do
            json = subject

            expect(json[:data][:createWhatToDiscardProblemComment][:comment]).to be_present
          end
        end
      end
    end
  end
end
