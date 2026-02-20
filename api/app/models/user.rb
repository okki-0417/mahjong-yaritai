# frozen_string_literal: true

class User < ApplicationRecord
  USER_NAME_LENGTH = 20
  PROFILE_TEXT_LENGTH = 500

  validates :name, presence: true, length: { maximum: USER_NAME_LENGTH }
  validates :profile_text, length: { maximum: PROFILE_TEXT_LENGTH }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  has_one_attached :avatar
  has_many :created_what_to_discard_problems, class_name: :WhatToDiscardProblem, dependent: :destroy
  has_many :created_comments, class_name: :Comment, dependent: :destroy
  has_many :created_what_to_discard_problem_votes, class_name: "WhatToDiscardProblem::Vote", dependent: :destroy

  has_many :active_follows, class_name: "Follow", foreign_key: "follower_id", dependent: :destroy
  has_many :passive_follows, class_name: "Follow", foreign_key: "followee_id", dependent: :destroy
  has_many :followings, through: :active_follows, source: :followee
  has_many :followers, through: :passive_follows, source: :follower

  has_many :created_likes, class_name: :Like, dependent: :destroy
  has_many :liked_what_to_discard_problems, through: :created_likes, source: :likable, source_type: "WhatToDiscardProblem"
  has_many :voted_what_to_discard_problems, through: :created_what_to_discard_problem_votes, source: :what_to_discard_problem

  has_many :created_mahjong_sessions, class_name: "MahjongSession", foreign_key: "creator_user_id", dependent: :destroy
  has_many :mahjong_participations, class_name: :MahjongParticipant, dependent: :destroy
  has_many :participated_mahjong_sessions, through: :mahjong_participations, source: :mahjong_session

  attr_accessor :remember_token

  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  def authenticated?(remember_token)
    return false if remember_digest.nil?

    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  def forget
    update_attribute(:remember_digest, nil)
  end

  def delete_account
    ActiveRecord::Base.transaction do
      created_what_to_discard_problems.destroy_all
      created_comments.destroy_all
      created_likes.destroy_all
      created_what_to_discard_problem_votes.destroy_all
      active_follows.destroy_all
      passive_follows.destroy_all
      created_mahjong_sessions.destroy_all
      mahjong_participations.destroy_all

      destroy!
    end

    true
  rescue StandardError => e
    errors.add(:base, e.message)
    false
  end

  def created_resources_summary
    {
      what_to_discard_problems_count: created_what_to_discard_problems.count,
      comments_count: created_comments.count,
      likes_count: created_likes.count,
      what_to_discard_problem_votes_count: created_what_to_discard_problem_votes.count,
    }
  end

  def follow(other_user)
    active_follows.create(followee: other_user)
  end

  def unfollow(other_user)
    active_follows.find_by(followee: other_user)&.destroy
  end

  def following?(other_user)
    followings.include?(other_user)
  end

  private

  def self.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(string, cost:)
  end

  def self.new_token
    SecureRandom.urlsafe_base64(64)
  end
end
