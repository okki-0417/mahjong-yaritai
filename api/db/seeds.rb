# frozen_string_literal: true

require "factory_bot_rails"

return if Rails.env.test?

user = FactoryBot.create(:user, name: "murai", email:  "ouki.murai@gmail.com")

if Rails.env.development?
  [
    { suit: "manzu", ordinal_number_in_suit: 1, name: "一萬" },
    { suit: "manzu", ordinal_number_in_suit: 2, name: "二萬" },
    { suit: "manzu", ordinal_number_in_suit: 3, name: "三萬" },
    { suit: "manzu", ordinal_number_in_suit: 4, name: "四萬" },
    { suit: "manzu", ordinal_number_in_suit: 5, name: "五萬" },
    { suit: "manzu", ordinal_number_in_suit: 6, name: "六萬" },
    { suit: "manzu", ordinal_number_in_suit: 7, name: "七萬" },
    { suit: "manzu", ordinal_number_in_suit: 8, name: "八萬" },
    { suit: "manzu", ordinal_number_in_suit: 9, name: "九萬" },
    { suit: "pinzu", ordinal_number_in_suit: 1, name: "一筒" },
    { suit: "pinzu", ordinal_number_in_suit: 2, name: "二筒" },
    { suit: "pinzu", ordinal_number_in_suit: 3, name: "三筒" },
    { suit: "pinzu", ordinal_number_in_suit: 4, name: "四筒" },
    { suit: "pinzu", ordinal_number_in_suit: 5, name: "五筒" },
    { suit: "pinzu", ordinal_number_in_suit: 6, name: "六筒" },
    { suit: "pinzu", ordinal_number_in_suit: 7, name: "七筒" },
    { suit: "pinzu", ordinal_number_in_suit: 8, name: "八筒" },
    { suit: "pinzu", ordinal_number_in_suit: 9, name: "九筒" },
    { suit: "souzu", ordinal_number_in_suit: 1, name: "一索" },
    { suit: "souzu", ordinal_number_in_suit: 2, name: "二索" },
    { suit: "souzu", ordinal_number_in_suit: 3, name: "三索" },
    { suit: "souzu", ordinal_number_in_suit: 4, name: "四索" },
    { suit: "souzu", ordinal_number_in_suit: 5, name: "五索" },
    { suit: "souzu", ordinal_number_in_suit: 6, name: "六索" },
    { suit: "souzu", ordinal_number_in_suit: 7, name: "七索" },
    { suit: "souzu", ordinal_number_in_suit: 8, name: "八索" },
    { suit: "souzu", ordinal_number_in_suit: 9, name: "九索" },
    { suit: "ji", ordinal_number_in_suit: 1, name: "東" },
    { suit: "ji", ordinal_number_in_suit: 2, name: "南" },
    { suit: "ji", ordinal_number_in_suit: 3, name: "西" },
    { suit: "ji", ordinal_number_in_suit: 4, name: "北" },
    { suit: "ji", ordinal_number_in_suit: 5, name: "白" },
    { suit: "ji", ordinal_number_in_suit: 6, name: "發" },
    { suit: "ji", ordinal_number_in_suit: 7, name: "中" },
  ].each do |obj|
    FactoryBot.create(:tile, obj)
  end

  [
    {
      round: "東四",
      turn: 12,
      wind: "東",
      dora_id: 12,
      hand1_id: 2,
      hand2_id: 3,
      hand3_id: 11,
      hand4_id: 12,
      hand5_id: 13,
      hand6_id: 14,
      hand7_id: 15,
      hand8_id: 16,
      hand9_id: 17,
      hand10_id: 20,
      hand11_id: 21,
      hand12_id: 21,
      hand13_id: 22,
      tsumo_id: 21,
    },
    {
      round: "東一",
      turn: 7,
      wind: "東",
      dora_id: 11,
      hand1_id: 1,
      hand2_id: 2,
      hand3_id: 4,
      hand4_id: 5,
      hand5_id: 6,
      hand6_id: 7,
      hand7_id: 9,
      hand8_id: 11,
      hand9_id: 12,
      hand10_id: 13,
      hand11_id: 14,
      hand12_id: 24,
      hand13_id: 25,
      tsumo_id: 13,
    },
    {
      round: "南四",
      turn: 8,
      wind: "南",
      dora_id: 25,
      hand1_id: 2,
      hand2_id: 3,
      hand3_id: 3,
      hand4_id: 4,
      hand5_id: 5,
      hand6_id: 11,
      hand7_id: 13,
      hand8_id: 15,
      hand9_id: 23,
      hand10_id: 23,
      hand11_id: 23,
      hand12_id: 24,
      hand13_id: 25,
      tsumo_id: 13,
    },
    {
      round: "東二",
      turn: 7,
      wind: "東",
      dora_id: 11,
      hand1_id: 3,
      hand2_id: 5,
      hand3_id: 7,
      hand4_id: 7,
      hand5_id: 8,
      hand6_id: 10,
      hand7_id: 12,
      hand8_id: 15,
      hand9_id: 16,
      hand10_id: 17,
      hand11_id: 22,
      hand12_id: 23,
      hand13_id: 24,
      tsumo_id: 13,
    },
    {
      round: "南一",
      turn: 6,
      wind: "西",
      dora_id: 25,
      hand1_id: 2,
      hand2_id: 3,
      hand3_id: 9,
      hand4_id: 10,
      hand5_id: 11,
      hand6_id: 12,
      hand7_id: 13,
      hand8_id: 15,
      hand9_id: 17,
      hand10_id: 19,
      hand11_id: 20,
      hand12_id: 22,
      hand13_id: 24,
      tsumo_id: 14,
    },
  ].map do |obj|
    FactoryBot.create(:what_to_discard_problem, **obj)
  end

  problem = FactoryBot.create(:what_to_discard_problem, user:, dora_id: 11, hand1_id: 3, hand2_id: 4, hand3_id: 5,
hand4_id: 7, hand5_id: 7, hand6_id: 9, hand7_id: 10, hand8_id: 10, hand9_id: 10, hand10_id: 14, hand11_id: 16, hand12_id: 18, hand13_id: 24, tsumo_id: 25)

  FactoryBot.create(:like, likable: problem, user:)
  FactoryBot.create(:comment, commentable: problem, user:)

  (1..50).each do |i|
    FactoryBot.create(:what_to_discard_problem_vote, what_to_discard_problem_id: problem.id, tile_id: rand(1..14))
  end

  # 麻雀セッションのサンプルデータ作成
  # 3人の追加参加者を作成（UserID 1のmuraiさんと合わせて4人）
  player2 = FactoryBot.create(:user, name: "南家", email: "south@mahjong.com")
  player3 = FactoryBot.create(:user, name: "西家", email: "west@mahjong.com")
  player4 = FactoryBot.create(:user, name: "北家", email: "north@mahjong.com")

  # スコア設定を作成（レート100, ウマ10-30）
  scoring_setting = FactoryBot.create(
    :mahjong_scoring_setting,
    rate: 100,
    chip_amount: 0,
    uma_rule_label: "10-30",
    oka_rule_label: "25000点30000点返し"
  )

  # セッションを作成（ゲーム代4000円、作成者はUserID 1のmuraiさん）
  session = FactoryBot.create(
    :mahjong_session,
    total_game_fee: 4000,
    creator_user: user,
    mahjong_scoring_setting: scoring_setting
  )

  # 参加者を作成（participant1はUserID 1のmuraiさん）
  participant1 = FactoryBot.create(:mahjong_participant, mahjong_session: session, user: user)
  participant2 = FactoryBot.create(:mahjong_participant, mahjong_session: session, user: player2)
  participant3 = FactoryBot.create(:mahjong_participant, mahjong_session: session, user: player3)
  participant4 = FactoryBot.create(:mahjong_participant, mahjong_session: session, user: player4)

  # 1ゲーム目を作成
  game1 = FactoryBot.create(:mahjong_game, mahjong_session: session)

  # 1ゲーム目の結果（player2が1位）
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant1,
    mahjong_game: game1,
    score: 22000,
    result_points: -8,
    ranking: 4
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant2,
    mahjong_game: game1,
    score: 38000,
    result_points: 43,
    ranking: 1
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant3,
    mahjong_game: game1,
    score: 28000,
    result_points: -10,
    ranking: 3
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant4,
    mahjong_game: game1,
    score: 32000,
    result_points: -25,
    ranking: 2
  )

  # 2ゲーム目を作成
  game2 = FactoryBot.create(:mahjong_game, mahjong_session: session)

  # 2ゲーム目の結果（player1が1位）
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant1,
    mahjong_game: game2,
    score: 42000,
    result_points: 57,
    ranking: 1
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant2,
    mahjong_game: game2,
    score: 18000,
    result_points: -22,
    ranking: 4
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant3,
    mahjong_game: game2,
    score: 33000,
    result_points: -25,
    ranking: 2
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant4,
    mahjong_game: game2,
    score: 27000,
    result_points: -10,
    ranking: 3
  )

  # 3ゲーム目を作成
  game3 = FactoryBot.create(:mahjong_game, mahjong_session: session)

  # 3ゲーム目の結果（player3が1位）
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant1,
    mahjong_game: game3,
    score: 25000,
    result_points: -20,
    ranking: 3
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant2,
    mahjong_game: game3,
    score: 31000,
    result_points: -19,
    ranking: 2
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant3,
    mahjong_game: game3,
    score: 39000,
    result_points: 49,
    ranking: 1
  )
  FactoryBot.create(:mahjong_result,
    mahjong_participant: participant4,
    mahjong_game: game3,
    score: 25000,
    result_points: -10,
    ranking: 4
  )
end
