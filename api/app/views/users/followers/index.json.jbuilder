json.users @followers do |user|
  json.id user.id
  json.name user.name
  json.avatar_url user.avatar_url
  json.profile_text user.profile_text
end
