# frozen_string_literal: true

namespace :tiles do
  desc "Create all 34 mahjong tiles (idempotent)"
  task seed: :environment do
    tiles_data = [
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
    ]

    created_count = 0
    skipped_count = 0

    tiles_data.each do |tile_data|
      tile = Tile.find_or_initialize_by(
        suit: tile_data[:suit],
        ordinal_number_in_suit: tile_data[:ordinal_number_in_suit]
      )

      if tile.new_record?
        tile.name = tile_data[:name]
        if tile.save
          created_count += 1
          puts "Created: #{tile.name} (ID: #{tile.id})"
        else
          puts "Failed to create: #{tile_data[:name]} - #{tile.errors.full_messages.join(', ')}"
        end
      else
        skipped_count += 1
        puts "Skipped (already exists): #{tile.name} (ID: #{tile.id})"
      end
    end

    puts "\n===== Summary ====="
    puts "Created: #{created_count} tiles"
    puts "Skipped: #{skipped_count} tiles"
    puts "Total: #{Tile.count} tiles in database"
  end
end
